import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from '../api/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/contact') && req.method === 'POST') {
    // Collect POST request data
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const params = new URLSearchParams(body);
      req.body = {};
      for (const [key, value] of params.entries()) {
        req.body[key] = value;
      }

      // Mock Vercel res helpers
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.send = (text) => {
        res.setHeader('Content-Type', 'text/plain');
        res.end(text);
      };
      res.redirect = (url) => {
        res.writeHead(302, { Location: url });
        res.end();
      };

      try {
        await handler(req, res);
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(rootDir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  // Clean URL support (e.g. /about -> /about.html)
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const errorPagePath = path.join(rootDir, '404.html');
      if (fs.existsSync(errorPagePath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        fs.createReadStream(errorPagePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

let currentPort = Number(PORT);

function startServer(port) {
  server.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort += 1;
    console.log(`⚠️ Port ${currentPort - 1} in use, trying port ${currentPort}...`);
    startServer(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);

