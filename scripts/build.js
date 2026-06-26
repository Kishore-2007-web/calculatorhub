import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, calculators } from "../js/database.js";
import { articles } from "../js/blog-db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target file system paths
const rootDir = path.join(__dirname, "..", "public");
const templatesDir = path.join(rootDir, "templates");
const cssDir = path.join(rootDir, "css");
const jsDir = path.join(rootDir, "js");

// Custom layout configurations
const SITE_URL = "https://calculatorhub.org";
const defaultOgImage = `${SITE_URL}/assets/og-image.png`;

async function runBuild() {
  console.log("🚀 Running CalculatorHub Compiler...");
  console.log(
    `📂 Read ${categories.length} categories and ${calculators.length} calculators from database.js`,
  );

  // 0. MINIFY ASSETS FOR PRODUCTION
  minifyAssets();

  // Load layout shell
  const rawLayoutHtml = fs.readFileSync(
    path.join(templatesDir, "layout.html"),
    "utf8",
  );

  // Replace links with minified references for production performance
  const layoutHtml = rawLayoutHtml
    .replace(/\/css\/main\.css/g, "/css/main.min.css")
    .replace(/\/css\/components\.css/g, "/css/components.min.css")
    .replace(/\/css\/dark-theme\.css/g, "/css/dark-theme.min.css")
    .replace(/\/js\/app\.js/g, "/js/app.min.js")
    .replace(/\/js\/search\.js/g, "/js/search.min.js");

  // Verify and create root output directories
  ensureDir(path.join(rootDir, "categories"));
  ensureDir(path.join(rootDir, "calculators"));
  ensureDir(path.join(rootDir, "blog"));

  // 1. BUILD HOMEPAGE
  buildHomepage(layoutHtml, categories, calculators);

  // 2. BUILD CATEGORY LANDING PAGES
  buildCategories(layoutHtml, categories, calculators);

  // 3. BUILD INDIVIDUAL CALCULATOR PAGES
  buildCalculators(layoutHtml, categories, calculators);

  // 4. BUILD STATIC PAGES (about, contact, terms, privacy, disclaimer, 404, sitemap)
  buildStaticPages(layoutHtml, categories, calculators, articles);

  // 4.5. BUILD BLOG SYSTEM (100 Articles)
  buildBlog(layoutHtml, articles, calculators);

  // 5. GENERATE SITEMAP.XML
  generateSitemaps(categories, calculators, articles);

  console.log(
    "🎉 Site Compilation Complete! All static pre-rendered pages built successfully.",
  );
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate structural input/output html mockups for standard calculators
 */
function getCalculatorInputsOutputs(id, category) {
  // Return custom inputs/outputs markup based on calculator ID
  switch (id) {
    case "age-calculator":
      return {
        inputs: `
          <div class="form-group">
            <label for="birth-date">Date of Birth</label>
            <input type="date" id="birth-date" class="input-control" required value="1995-01-01">
          </div>
          <div class="form-group">
            <label for="target-date">Calculate Age At</label>
            <input type="date" id="target-date" class="input-control" required value="${new Date().toISOString().split("T")[0]}">
          </div>
        `,
        outputs: `
          <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">YOUR AGE IS</div>
            <div id="result-years" style="font-size: 3rem; font-weight: 800; color: var(--color-primary); line-height: 1;">0</div>
            <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem;">years, <span id="result-months-remain">0</span> months, <span id="result-days-remain">0</span> days</div>
            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: left; font-size: 0.9rem;">
              <div><strong>Months:</strong> <span id="result-months">0</span></div>
              <div><strong>Weeks:</strong> <span id="result-weeks">0</span></div>
              <div><strong>Days:</strong> <span id="result-days">0</span></div>
              <div><strong>Hours:</strong> <span id="result-hours">0</span></div>
            </div>
          </div>
        `,
      };
    case "bmi-calculator":
      return {
        inputs: `
          <div class="form-group">
            <label for="bmi-units">Unit System</label>
            <select id="bmi-units" class="input-control">
              <option value="metric">Metric (kg / cm)</option>
              <option value="imperial">Imperial (lbs / inches)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="bmi-weight" id="weight-label">Weight (kg)</label>
            <input type="number" id="bmi-weight" class="input-control" placeholder="70" required min="1" step="0.1" value="70">
          </div>
          <div class="form-group">
            <label for="bmi-height" id="height-label">Height (cm)</label>
            <input type="number" id="bmi-height" class="input-control" placeholder="175" required min="1" step="0.1" value="175">
          </div>
        `,
        outputs: `
          <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">BODY MASS INDEX (BMI)</div>
            <div id="result-bmi" style="font-size: 3.5rem; font-weight: 800; color: var(--color-primary); line-height: 1; margin: 0.5rem 0;">0.0</div>
            <div id="result-bmi-cat" style="font-size: 1.25rem; font-weight: 700; color: var(--color-success); margin-bottom: 1.5rem;">Normal Weight</div>
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); text-align: left; background: var(--color-bg-base); padding: 0.75rem 1rem; border-radius: var(--radius-md);">
              <strong>BMI Scales:</strong><br>
              &bull; Underweight: < 18.5<br>
              &bull; Normal weight: 18.5 - 24.9<br>
              &bull; Overweight: 25.0 - 29.9<br>
              &bull; Obese: &ge; 30.0
            </div>
          </div>
        `,
      };
    case "percentage-calculator":
      return {
        inputs: `
          <div class="form-group">
            <label for="pct-type">Operation</label>
            <select id="pct-type" class="input-control">
              <option value="of">What is X% of Y?</option>
              <option value="is">X is what percent of Y?</option>
              <option value="change">Percentage change from X to Y</option>
            </select>
          </div>
          <div class="form-group">
            <label for="pct-x" id="label-x">Value X</label>
            <input type="number" id="pct-x" class="input-control" placeholder="20" required value="20">
          </div>
          <div class="form-group">
            <label for="pct-y" id="label-y">Value Y</label>
            <input type="number" id="pct-y" class="input-control" placeholder="150" required value="150">
          </div>
        `,
        outputs: `
          <div style="text-align: center; padding: 2rem 0;">
            <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">CALCULATED RESULT</div>
            <div id="result-pct" style="font-size: 3rem; font-weight: 800; color: var(--color-primary); margin-top: 0.5rem;">30</div>
            <p style="font-size: 0.95rem; margin-top: 1rem;" id="pct-description">20% of 150 is 30.</p>
          </div>
        `,
      };
    case "emi-calculator":
      return {
        inputs: `
          <div class="form-group">
            <label for="emi-amount">Loan Amount ($)</label>
            <input type="number" id="emi-amount" class="input-control" placeholder="10000" required value="10000" min="1">
          </div>
          <div class="form-group">
            <label for="emi-rate">Annual Interest Rate (%)</label>
            <input type="number" id="emi-rate" class="input-control" placeholder="7.5" required value="7.5" min="0.1" step="0.01">
          </div>
          <div class="form-group">
            <label for="emi-tenure">Loan Tenure (Years)</label>
            <input type="number" id="emi-tenure" class="input-control" placeholder="5" required value="5" min="1">
          </div>
        `,
        outputs: `
          <div style="padding: 0.5rem 0;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">MONTHLY EMI PAYABLE</div>
              <div id="result-emi" style="font-size: 2.5rem; font-weight: 800; color: var(--color-primary);">$200.38</div>
            </div>
            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
              <div class="flex justify-between">
                <span>Principal Amount:</span>
                <strong id="result-emi-principal">$10,000.00</strong>
              </div>
              <div class="flex justify-between">
                <span>Total Interest Payable:</span>
                <strong id="result-emi-interest">$2,022.75</strong>
              </div>
              <div class="flex justify-between" style="border-top: 1px solid var(--color-border); padding-top: 0.5rem;">
                <span>Total Amount Payable:</span>
                <strong id="result-emi-total">$12,022.75</strong>
              </div>
            </div>
          </div>
        `,
      };
    case "gst-calculator":
      return {
        inputs: `
          <div class="form-group">
            <label for="gst-amount">Amount ($)</label>
            <input type="number" id="gst-amount" class="input-control" placeholder="1000" required value="1000" min="1" step="0.01">
          </div>
          <div class="form-group">
            <label for="gst-rate">GST Rate (%)</label>
            <input type="number" id="gst-rate" class="input-control" placeholder="18" required value="18" min="0" step="0.1">
          </div>
          <div class="form-group">
            <label for="gst-action">Tax Calculation</label>
            <select id="gst-action" class="input-control">
              <option value="add">Add GST (+)</option>
              <option value="remove">Remove GST (-)</option>
            </select>
          </div>
        `,
        outputs: `
          <div style="padding: 0.5rem 0;">
            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
              <div class="flex justify-between">
                <span>Net Amount (Before Tax):</span>
                <strong id="result-gst-net">$1,000.00</strong>
              </div>
              <div class="flex justify-between">
                <span>Tax Amount (GST):</span>
                <strong id="result-gst-tax">$180.00</strong>
              </div>
              <div class="flex justify-between" style="border-top: 1px solid var(--color-border); padding-top: 0.5rem;">
                <span>Gross Amount (Inclusive):</span>
                <strong id="result-gst-gross">$1,180.00</strong>
              </div>
            </div>
          </div>
        `,
      };
    default:
      // Programmatic layout templates for various categories
      if (category === "unit-conversion") {
        return {
          inputs: `
            <div class="form-group">
              <label for="conv-value">Value to Convert</label>
              <input type="number" id="conv-value" class="input-control" value="10" required>
            </div>
            <div class="form-group">
              <label for="conv-from">From Unit</label>
              <select id="conv-from" class="input-control">
                <option value="a">Metric Unit</option>
                <option value="b">Imperial Unit</option>
              </select>
            </div>
            <div class="form-group">
              <label for="conv-to">To Unit</label>
              <select id="conv-to" class="input-control">
                <option value="b">Imperial Unit</option>
                <option value="a">Metric Unit</option>
              </select>
            </div>
          `,
          outputs: `
            <div style="text-align: center; padding: 2.5rem 0;">
              <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">CONVERTED RESULT</div>
              <div id="result-val" style="font-size: 3rem; font-weight: 800; color: var(--color-primary); margin-top: 0.5rem;">0.00</div>
              <div style="font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 0.5rem;" id="result-desc">Pending inputs</div>
            </div>
          `,
        };
      } else if (category === "math" || category === "statistics") {
        return {
          inputs: `
            <div class="form-group">
              <label for="val-a">Input Value A</label>
              <input type="number" id="val-a" class="input-control" value="25" required>
            </div>
            <div class="form-group">
              <label for="val-b">Input Value B</label>
              <input type="number" id="val-b" class="input-control" value="5" required>
            </div>
          `,
          outputs: `
            <div style="text-align: center; padding: 2.5rem 0;">
              <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">RESULT</div>
              <div id="result-val" style="font-size: 3rem; font-weight: 800; color: var(--color-primary); margin-top: 0.5rem;">30.00</div>
            </div>
          `,
        };
      } else {
        // Finance / Business / Default
        return {
          inputs: `
            <div class="form-group">
              <label for="val-principal">Amount / Principal ($)</label>
              <input type="number" id="val-principal" class="input-control" value="1000" required>
            </div>
            <div class="form-group">
              <label for="val-rate">Interest / Margin Rate (%)</label>
              <input type="number" id="val-rate" class="input-control" value="10" required>
            </div>
            <div class="form-group">
              <label for="val-term">Term / Duration</label>
              <input type="number" id="val-term" class="input-control" value="5" required>
            </div>
          `,
          outputs: `
            <div style="padding: 0.5rem 0;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">ESTIMATED TOTAL OUTCOME</div>
                <div id="result-val" style="font-size: 2.5rem; font-weight: 800; color: var(--color-primary);">$1,500.00</div>
              </div>
              <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
                <div class="flex justify-between">
                  <span>Interest Accumulated:</span>
                  <strong id="result-accrued">$500.00</strong>
                </div>
              </div>
            </div>
          `,
        };
      }
  }
}

/**
 * 1. BUILD HOMEPAGE
 */
function buildHomepage(layoutHtml, categories, calculators) {
  console.log("Rendering homepage...");
  const homepageTemplate = fs.readFileSync(
    path.join(templatesDir, "homepage.html"),
    "utf8",
  );

  // Categories Grid Compilation
  const categoriesGrid = categories
    .map(
      (cat) => `
    <a href="/categories/${cat.id}/" class="card flex flex-col justify-between" style="text-align: left; padding: 1.5rem; min-height: 160px;">
      <div>
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">
          ${getCategoryIcon(cat.icon)}
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.25rem;">${cat.name}</h3>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0; line-height: 1.4;">${cat.desc}</p>
      </div>
    </a>
  `,
    )
    .join("");

  // Popular Grid Compilation
  const popularCalcs = calculators.filter((c) => c.popular).slice(0, 8);
  const popularGrid = popularCalcs
    .map(
      (calc) => `
    <a href="/calculators/${calc.id}/" class="card flex flex-col justify-between" style="text-align: left; padding: 1.5rem; border-color: var(--color-border);">
      <div>
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⚡</div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">${calc.name}</h3>
        <p style="font-size: 0.825rem; color: var(--color-text-secondary); margin-bottom: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${calc.desc}</p>
      </div>
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary); margin-top: 1rem; align-self: flex-start; text-transform: uppercase;">Compute Now &rarr;</div>
    </a>
  `,
    )
    .join("");

  // Replace Homepage placeholders
  let homepageContent = homepageTemplate
    .replace("{{categories_grid}}", categoriesGrid)
    .replace("{{popular_calculators_grid}}", popularGrid);

  // Generate homepage JSON-LD Schema
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CalculatorHub",
    url: SITE_URL,
    description:
      "Every Calculator You Need — Free, Fast & Accurate. Solve math, finance, loans, tax, and health calculations.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
  };

  // Compile final index.html
  const finalHtml = layoutHtml
    .replace(
      /{{title}}/g,
      "CalculatorHub - Every Calculator You Need — Free, Fast & Accurate",
    )
    .replace(
      /{{description}}/g,
      "Every calculator you need. 300+ free online calculators covering math, finance, health, science, and unit conversions.",
    )
    .replace(/{{canonical_url}}/g, SITE_URL)
    .replace(/{{og_type}}/g, "website")
    .replace(/{{og_image}}/g, defaultOgImage)
    .replace(/{{additional_head}}/g, "")
    .replace(/{{schema_json}}/g, JSON.stringify(homepageSchema, null, 2))
    .replace(/{{content}}/g, homepageContent)
    .replace(/{{additional_scripts}}/g, "");

  fs.writeFileSync(path.join(rootDir, "index.html"), finalHtml, "utf8");
}

/**
 * 2. BUILD CATEGORY LANDING PAGES
 */
function buildCategories(layoutHtml, categories, calculators) {
  console.log("Rendering category pages...");
  const categoryTemplate = fs.readFileSync(
    path.join(templatesDir, "category.html"),
    "utf8",
  );

  // Also compile the central Categories overview page
  buildCategoriesOverview(layoutHtml, categories);

  categories.forEach((cat) => {
    ensureDir(path.join(rootDir, "categories", cat.id));

    // Get calculators belonging to this category
    const catCalcs = calculators.filter((c) => c.category === cat.id);
    const calcListHtml = catCalcs
      .map(
        (calc) => `
      <a href="/calculators/${calc.id}/" class="card flex flex-col justify-between" style="padding: 1.25rem; height: 100%;">
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--color-primary);">${calc.name}</h3>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4; margin: 0;">${calc.desc}</p>
        </div>
      </a>
    `,
      )
      .join("");

    // Compile dynamic sidebar listings of other categories
    const otherCategoriesHtml = categories
      .filter((c) => c.id !== cat.id)
      .map((c) => `<li><a href="/categories/${c.id}/">${c.name}</a></li>`)
      .join("");

    // Dummy category structural guides for SEO
    const categoryGuide = `
      <p style="margin-bottom: 1rem;">This section lists all core <strong>${cat.name}</strong> calculators designed to assist your daily research. These tools are constructed based on standardized methods to ensure exact calculations.</p>
      <p>Whether you require instant arithmetic analysis, complex conversion operations, or parameter optimization, selecting any calculator above provides detailed instructions, active math formulas, worked examples, and relevant FAQs.</p>
    `;

    let catContent = categoryTemplate
      .replace(/{{category_name}}/g, cat.name)
      .replace(/{{category_description}}/g, cat.desc)
      .replace(/{{calculators_list}}/g, calcListHtml)
      .replace(/{{category_guide}}/g, categoryGuide)
      .replace(/{{sidebar_categories}}/g, otherCategoriesHtml);

    // Schema compilation for category page
    const categorySchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${cat.name} Calculators`,
      description: cat.desc,
      url: `${SITE_URL}/categories/${cat.id}/`,
    };

    const finalHtml = layoutHtml
      .replace(/{{title}}/g, `${cat.name} Calculators - CalculatorHub`)
      .replace(/{{description}}/g, cat.desc)
      .replace(/{{canonical_url}}/g, `${SITE_URL}/categories/${cat.id}/`)
      .replace(/{{og_type}}/g, "website")
      .replace(/{{og_image}}/g, defaultOgImage)
      .replace(/{{additional_head}}/g, "")
      .replace(/{{schema_json}}/g, JSON.stringify(categorySchema, null, 2))
      .replace(/{{content}}/g, catContent)
      .replace(/{{additional_scripts}}/g, "");

    fs.writeFileSync(
      path.join(rootDir, "categories", cat.id, "index.html"),
      finalHtml,
      "utf8",
    );
  });
}

function buildCategoriesOverview(layoutHtml, categories) {
  ensureDir(path.join(rootDir, "categories"));

  const categoriesListHtml = categories
    .map(
      (cat) => `
    <a href="/categories/${cat.id}/" class="card flex items-center gap-md" style="padding: 1.5rem;">
      <div style="font-size: 2.25rem;">${getCategoryIcon(cat.icon)}</div>
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">${cat.name}</h3>
        <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0;">${cat.desc}</p>
      </div>
    </a>
  `,
    )
    .join("");

  const content = `
    <header style="margin-bottom: 2.5rem; text-align: center;">
      <h1 style="font-size: 2.75rem; margin-bottom: 0.75rem;">Calculator Categories</h1>
      <p style="font-size: 1.15rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto;">Browse our categorized lists of calculators covering math, investments, finance, healthcare, and engineering.</p>
    </header>
    <div class="grid grid-cols-2" style="gap: 1.5rem; margin-bottom: 3rem;">
      ${categoriesListHtml}
    </div>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Calculator Categories - CalculatorHub",
    url: `${SITE_URL}/categories/`,
  };

  const finalHtml = layoutHtml
    .replace(/{{title}}/g, "Calculator Categories - CalculatorHub")
    .replace(
      /{{description}}/g,
      "Browse 300+ free online calculators categorized by topic: math, finance, fitness, conversion, science, and more.",
    )
    .replace(/{{canonical_url}}/g, `${SITE_URL}/categories/`)
    .replace(/{{og_type}}/g, "website")
    .replace(/{{og_image}}/g, defaultOgImage)
    .replace(/{{additional_head}}/g, "")
    .replace(/{{schema_json}}/g, JSON.stringify(schema, null, 2))
    .replace(/{{content}}/g, content)
    .replace(/{{additional_scripts}}/g, "");

  fs.writeFileSync(
    path.join(rootDir, "categories", "index.html"),
    finalHtml,
    "utf8",
  );
}

/**
 * 3. BUILD INDIVIDUAL CALCULATOR PAGES
 */
function buildCalculators(layoutHtml, categories, calculators) {
  console.log("Rendering calculators...");
  const calculatorTemplate = fs.readFileSync(
    path.join(templatesDir, "calculator.html"),
    "utf8",
  );

  // Also compile the central Calculators index list (A-Z)
  buildAllCalculatorsList(layoutHtml, calculators);

  let count = 0;

  calculators.forEach((calc) => {
    count++;
    console.log(`🔨 Building ${count}/${calculators.length}: ${calc.id}`);

    try {
      ensureDir(path.join(rootDir, "calculators", calc.id));

      // Get matching category details
      const categoryObj = categories.find((c) => c.id === calc.category);
      const categoryName = categoryObj ? categoryObj.name : "Other";
      const categoryId = categoryObj ? categoryObj.id : "lifestyle-travel";

      // Retrieve input/output markup configurations
      const io = getCalculatorInputsOutputs(calc.id, calc.category);

      // Compile FAQs
      const faqsHtml = calc.faqs
        .map(
          (faq) => `
      <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1rem;">
        <h4>Q: ${faq.q}</h4>
        <p>${faq.a}</p>
      </div>
    `,
        )
        .join("");

      // Related calculators
      const relatedCalcs = calculators
        .filter((c) => c.category === calc.category && c.id !== calc.id)
        .slice(0, 5);

      const relatedLinksHtml = relatedCalcs
        .map(
          (rc) => `
      <li><a href="/calculators/${rc.id}/">${rc.name}</a></li>
    `,
        )
        .join("");

      const finalHtml = layoutHtml
        .replace(/{{title}}/g, `${calc.name}`)
        .replace(/{{description}}/g, calc.desc)
        .replace(/{{canonical_url}}/g, `${SITE_URL}/calculators/${calc.id}/`)
        .replace(/{{schema_json}}/g, "{}")
        .replace(/{{content}}/g, "")
        .replace(/{{additional_scripts}}/g, "");

      fs.writeFileSync(
        path.join(rootDir, "calculators", calc.id, "index.html"),
        finalHtml,
        "utf8",
      );

      // JS file creation
      const scriptPath = path.join(jsDir, "calculators", `${calc.id}.js`);

      if (!fs.existsSync(scriptPath)) {
        const genericScript = `
document.addEventListener('DOMContentLoaded', () => {
  console.log("Calculator loaded: ${calc.id}");
});
      `;

        fs.writeFileSync(scriptPath, genericScript, "utf8");
      }
    } catch (err) {
      console.error(`❌ Failed building calculator: ${calc.id}`);
      console.error(err);
      throw err;
    }
  });

  function buildAllCalculatorsList(layoutHtml, calculators) {
    ensureDir(path.join(rootDir, "calculators"));

    // Sort calculators alphabetically
    const sorted = [...calculators].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const listHtml = sorted
      .map(
        (calc) => `
    <a href="/calculators/${calc.id}/" class="card flex justify-between items-center" style="padding: 1rem 1.25rem;">
      <span style="font-weight: 600; color: var(--color-text-primary);">${calc.name}</span>
      <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); background: var(--color-primary-light); padding: 2px 6px; border-radius: var(--radius-xs);">
        ${calc.category.replace(/-/g, " ")}
      </span>
    </a>
  `,
      )
      .join("");

    const content = `
    <header style="margin-bottom: 2.5rem; text-align: center;">
      <h1 style="font-size: 2.75rem; margin-bottom: 0.75rem;">All Calculators (A–Z)</h1>
      <p style="font-size: 1.15rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto;">Browse all 300+ free online calculators in alphabetical order.</p>
    </header>
    <div class="grid grid-cols-3" style="gap: 1rem; margin-bottom: 3rem;">
      ${listHtml}
    </div>
  `;

    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "All Calculators A-Z - CalculatorHub",
      url: `${SITE_URL}/calculators/`,
    };

    const finalHtml = layoutHtml
      .replace(/{{title}}/g, "All Calculators (A–Z) - CalculatorHub")
      .replace(
        /{{description}}/g,
        "A complete index of all 300+ calculators on CalculatorHub arranged alphabetically from A to Z.",
      )
      .replace(/{{canonical_url}}/g, `${SITE_URL}/calculators/`)
      .replace(/{{og_type}}/g, "website")
      .replace(/{{og_image}}/g, defaultOgImage)
      .replace(/{{additional_head}}/g, "")
      .replace(/{{schema_json}}/g, JSON.stringify(schema, null, 2))
      .replace(/{{content}}/g, content)
      .replace(/{{additional_scripts}}/g, "");

    fs.writeFileSync(
      path.join(rootDir, "calculators", "index.html"),
      finalHtml,
      "utf8",
    );
  }

  /**
   * 4. BUILD STATIC PAGES
   */
  function buildStaticPages(layoutHtml, categories, calculators, articles) {
    console.log(
      "Rendering static pages (about, contact, terms, privacy, etc)...",
    );

    const sitemapCategoriesHtml = categories
      .map((cat) => {
        const catCalcs = calculators.filter((c) => c.category === cat.id);
        const linksList = catCalcs
          .map((c) => `<li><a href="/calculators/${c.id}/">${c.name}</a></li>`)
          .join("");
        return `
      <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.5rem;"><a href="/categories/${cat.id}/">${cat.name}</a></h3>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1rem;">${cat.desc}</p>
        <ul style="list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.9rem; padding-left: 0;">
          ${linksList}
        </ul>
      </div>
    `;
      })
      .join("");

    const sitemapArticlesHtml = articles
      .map(
        (art) => `
    <li><a href="/blog/${art.slug}/">${art.title}</a></li>
  `,
      )
      .join("");

    const pages = [
      {
        id: "sitemap",
        title: "HTML Sitemap - CalculatorHub",
        desc: "Explore the complete directory list of categories, calculators, and articles on CalculatorHub.",
        content: `
        <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem; text-align: center;">HTML Sitemap</h1>
        <p style="text-align: center; color: var(--color-text-secondary); margin-bottom: 3rem;">A comprehensive map of all pages and directories within CalculatorHub.</p>
        
        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Calculators by Category</h2>
          ${sitemapCategoriesHtml}
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Calculation Insights & Blog Posts</h2>
          <ul style="list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.9rem; padding-left: 0;">
            ${sitemapArticlesHtml}
          </ul>
        </section>
      `,
      },
      {
        id: "about",
        title: "About Us - CalculatorHub",
        desc: "Learn about our mission to provide the most comprehensive, fast, and accurate calculations on the web.",
        content: `
        <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;">About CalculatorHub</h1>
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem;">CalculatorHub was founded in 2026 with a simple mission: to build the most comprehensive, easy-to-use, and highly optimized portal for everyday calculations.</p>
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem;">We believe equations and formulas should not be difficult to solve. That is why we provide free calculators across mathematics, investments, civil engineering, sports activity tracking, date difference analysis, and everything in between.</p>
        <p style="font-size: 1.1rem; line-height: 1.8;">Our focus is on delivering modern responsive user interfaces with lightning-fast speeds, zero layout shifts, and absolute mathematical precision.</p>
      `,
      },
      {
        id: "contact",
        title: "Contact Us - CalculatorHub",
        desc: "Get in touch with the CalculatorHub support team for feedback, bugs, or feature suggestions.",
        content: `
        <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Contact Us</h1>
        <div class="grid grid-cols-2" style="gap: 2rem;">
          <div class="card">
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Send a Message</h2>
            <form onsubmit="alert('Thank you for contacting us! We will get back to you shortly.'); return false;">
              <div class="form-group">
                <label for="c-name">Full Name</label>
                <input type="text" id="c-name" class="input-control" required placeholder="John Doe">
              </div>
              <div class="form-group">
                <label for="c-email">Email Address</label>
                <input type="email" id="c-email" class="input-control" required placeholder="john@example.com">
              </div>
              <div class="form-group">
                <label for="c-msg">Message</label>
                <textarea id="c-msg" class="input-control" rows="5" required placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Message</button>
            </form>
          </div>
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">General Inquiries</h2>
            <p>For inquiries regarding calculator metrics, formulas, bug reports, and advertising integrations, please reach us through the contact form or email our support desk.</p>
            <p style="margin-top: 1.5rem;"><strong>Email:</strong> <a href="mailto:itsmekishoreoo@gmail.com" style="color: var(--color-primary); text-decoration: underline;">itsmekishoreoo@gmail.com</a></p>
          </div>
        </div>
      `,
      },
      {
        id: "privacy-policy",
        title: "Privacy Policy - CalculatorHub",
        desc: "Understand how CalculatorHub protects user privacy and handles browser storage.",
        content: `
        <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Privacy Policy</h1>
        <p>At CalculatorHub, available at calculatorhub.org, user privacy is one of our primary priorities. This Privacy Policy documents what types of information are collected and recorded by our servers and how we use them.</p>
        <h2 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem;">Log Files</h2>
        <p>CalculatorHub follows standard log file procedures. These logs report visitors when they navigate websites. This is a common practice for web hosts as part of hosting diagnostics.</p>
        <h2 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem;">Cookies and Local Storage</h2>
        <p>We use Local Storage to store user preferences, such as selected themes (Light/Dark mode) and recently visited calculators, to personalize your experience. No personal data is stored.</p>
      `,
      },
      {
        id: "terms",
        title: "Terms & Conditions - CalculatorHub",
        desc: "Read the terms and agreements of using the CalculatorHub platform.",
        content: `
        <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Terms & Conditions</h1>
        <p>Welcome to CalculatorHub! These terms and conditions outline the rules and regulations for using the CalculatorHub Website, located at calculatorhub.org.</p>
        <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use CalculatorHub if you do not agree to take all of the terms and conditions stated on this page.</p>
      `,
      },
      {
        id: "disclaimer",
        title: "Disclaimer - CalculatorHub",
        desc: "Understand the terms of usage and mathematical variance disclaimers.",
        content: `
        <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Disclaimer</h1>
        <p>All calculators on CalculatorHub are provided "as is" for informational and educational purposes. While we strive to ensure absolute accuracy of all equations, results should not be used as official financial, medical, tax, or engineering advice.</p>
        <p style="margin-top: 1rem;">Please consult certified experts (e.g. tax advisers, mortgage brokers, physicians) before executing financial commitments or medical routines based on these results.</p>
      `,
      },
      {
        id: "404",
        title: "Page Not Found - CalculatorHub",
        desc: "The page you are looking for does not exist.",
        content: `
        <div style="text-align: center; padding: 4rem 1rem;">
          <h1 style="font-size: 5rem; color: var(--color-primary); font-weight: 800; line-height: 1;">404</h1>
          <h2 style="font-size: 2rem; margin-bottom: 1rem;">Page Not Found</h2>
          <p style="margin-bottom: 2rem;">The calculator or page you requested could not be located or has been relocated.</p>
          <a href="/" class="btn btn-primary">Go to Homepage</a>
        </div>
      `,
      },
    ];

    pages.forEach((p) => {
      const pageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: p.title,
        url: `${SITE_URL}/${p.id}.html`,
      };

      const finalHtml = layoutHtml
        .replace(/{{title}}/g, p.title)
        .replace(/{{description}}/g, p.desc)
        .replace(/{{canonical_url}}/g, `${SITE_URL}/${p.id}.html`)
        .replace(/{{og_type}}/g, "website")
        .replace(/{{og_image}}/g, defaultOgImage)
        .replace(/{{additional_head}}/g, "")
        .replace(/{{schema_json}}/g, JSON.stringify(pageSchema, null, 2))
        .replace(
          /{{content}}/g,
          `<div class="card animate-fade-in" style="padding: 2.5rem; margin-bottom: 2rem;">${p.content}</div>`,
        )
        .replace(/{{additional_scripts}}/g, "");

      fs.writeFileSync(path.join(rootDir, `${p.id}.html`), finalHtml, "utf8");
    });
  }

  /**
   * 4.5. BUILD BLOG
   */
  function buildBlog(layoutHtml, articles, calculators) {
    console.log("Rendering blog pages...");

    // Build blog index listing page
    const articlesListHtml = articles
      .map(
        (art) => `
    <article class="card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--color-primary);">${art.title}</h2>
        <p style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 1.5rem;">${art.description}</p>
      </div>
      <a href="/blog/${art.slug}/" style="font-weight: 600; font-size: 0.9rem; align-self: flex-start; text-transform: uppercase;">Read Article &rarr;</a>
    </article>
  `,
      )
      .join("");

    const blogIndexContent = `
    <header style="margin-bottom: 2.5rem; text-align: center;">
      <h1 style="font-size: 2.75rem; margin-bottom: 0.75rem;">Calculator Insights & Guides</h1>
      <p style="font-size: 1.15rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto;">Read expert articles detailing how math equations, interest computations, and physical units affect your day-to-day decisions.</p>
    </header>
    <div class="grid grid-cols-3" style="gap: 1.5rem; margin-bottom: 3rem;">
      ${articlesListHtml}
    </div>
  `;

    const blogIndexSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Blog Insights - CalculatorHub",
      url: `${SITE_URL}/blog/`,
    };

    const finalIndexHtml = layoutHtml
      .replace(/{{title}}/g, "Blog Insights & Guides - CalculatorHub")
      .replace(
        /{{description}}/g,
        "Explore 100 expert calculation articles covering mathematical tips, investment guidelines, and scientific formulas.",
      )
      .replace(/{{canonical_url}}/g, `${SITE_URL}/blog/`)
      .replace(/{{og_type}}/g, "website")
      .replace(/{{og_image}}/g, defaultOgImage)
      .replace(/{{additional_head}}/g, "")
      .replace(/{{schema_json}}/g, JSON.stringify(blogIndexSchema, null, 2))
      .replace(/{{content}}/g, blogIndexContent)
      .replace(/{{additional_scripts}}/g, "");

    fs.writeFileSync(
      path.join(rootDir, "blog", "index.html"),
      finalIndexHtml,
      "utf8",
    );

    // Build each blog article detail page
    articles.forEach((art) => {
      ensureDir(path.join(rootDir, "blog", art.slug));

      const relatedCalc = calculators.find((c) => c.id === art.calculatorId);
      const relatedLink = relatedCalc
        ? `<div class="alert alert-success" style="margin-top: 2rem;"><strong>Related Calculator:</strong> Solve this problem instantly with our <a href="/calculators/${relatedCalc.id}/" style="font-weight:700; color:inherit; text-decoration:underline;">${relatedCalc.name} &rarr;</a></div>`
        : "";

      const articleBody = `
      <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-size: 0.9rem;">
        <ol style="list-style: none; display: flex; gap: 0.5rem; padding: 0;">
          <li><a href="/">Home</a></li>
          <li style="color: var(--color-text-tertiary);">&gt;</li>
          <li><a href="/blog/">Blog</a></li>
          <li style="color: var(--color-text-tertiary);">&gt;</li>
          <li aria-current="page" style="color: var(--color-text-primary); font-weight: 500;">${art.title}</li>
        </ol>
      </nav>
      <article style="max-width: 800px; margin: 0 auto; line-height: 1.8;">
        <header style="margin-bottom: 2rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem;">
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${art.title}</h1>
          <p style="color: var(--color-text-tertiary); font-size: 0.9rem;">Published in Calculator Insights &bull; Reading time: 4 mins</p>
        </header>
        <div style="font-size: 1.05rem; color: var(--color-text-secondary);">
          ${art.content}
          ${relatedLink}
        </div>
      </article>
    `;

      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: art.title,
        description: art.description,
        url: `${SITE_URL}/blog/${art.slug}/`,
        author: {
          "@type": "Organization",
          name: "CalculatorHub Editorial Desk",
        },
      };

      const finalArticleHtml = layoutHtml
        .replace(/{{title}}/g, `${art.title} - CalculatorHub`)
        .replace(/{{description}}/g, art.description)
        .replace(/{{canonical_url}}/g, `${SITE_URL}/blog/${art.slug}/`)
        .replace(/{{og_type}}/g, "article")
        .replace(/{{og_image}}/g, defaultOgImage)
        .replace(/{{additional_head}}/g, "")
        .replace(/{{schema_json}}/g, JSON.stringify(articleSchema, null, 2))
        .replace(
          /{{content}}/g,
          `<div class="card" style="padding: 2.5rem; margin-bottom: 2rem;">${articleBody}</div>`,
        )
        .replace(/{{additional_scripts}}/g, "");

      fs.writeFileSync(
        path.join(rootDir, "blog", art.slug, "index.html"),
        finalArticleHtml,
        "utf8",
      );
    });
  }

  /**
   * 5. GENERATE SITEMAPS
   */
  function generateSitemaps(categories, calculators, articles) {
    console.log("Generating sitemap.xml...");

    const urls = [
      { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
      { loc: `${SITE_URL}/categories/`, priority: "0.8", changefreq: "weekly" },
      { loc: `${SITE_URL}/calculators/`, priority: "0.9", changefreq: "daily" },
      { loc: `${SITE_URL}/about.html`, priority: "0.5", changefreq: "monthly" },
      {
        loc: `${SITE_URL}/contact.html`,
        priority: "0.5",
        changefreq: "monthly",
      },
      {
        loc: `${SITE_URL}/privacy-policy.html`,
        priority: "0.3",
        changefreq: "monthly",
      },
      { loc: `${SITE_URL}/terms.html`, priority: "0.3", changefreq: "monthly" },
      {
        loc: `${SITE_URL}/disclaimer.html`,
        priority: "0.3",
        changefreq: "monthly",
      },
      { loc: `${SITE_URL}/blog/`, priority: "0.7", changefreq: "weekly" },
    ];

    categories.forEach((cat) => {
      urls.push({
        loc: `${SITE_URL}/categories/${cat.id}/`,
        priority: "0.8",
        changefreq: "weekly",
      });
    });

    calculators.forEach((calc) => {
      urls.push({
        loc: `${SITE_URL}/calculators/${calc.id}/`,
        priority: "0.9",
        changefreq: "weekly",
      });
    });

    articles.forEach((art) => {
      urls.push({
        loc: `${SITE_URL}/blog/${art.slug}/`,
        priority: "0.6",
        changefreq: "weekly",
      });
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemapXml, "utf8");
  }

  function getCategoryIcon(iconName) {
    // Returns SVG or Emoji placeholder based on category icon string
    switch (iconName) {
      case "abacus":
        return "🧮";
      case "coins":
        return "🪙";
      case "bank":
        return "🏦";
      case "receipt":
        return "🧾";
      case "briefcase":
        return "💼";
      case "heart":
        return "❤️";
      case "stethoscope":
        return "🩺";
      case "graduation-cap":
        return "🎓";
      case "chart-bar":
        return "📊";
      case "cog":
        return "⚙️";
      case "hard-hat":
        return "👷";
      case "clock":
        return "⏰";
      case "exchange-alt":
        return "🔄";
      case "compass":
        return "🧭";
      default:
        return "🧮";
    }
  }

  /**
   * Minify CSS and JS assets using fast regex minifiers
   */
  function minifyAssets() {
    console.log(
      "📦 Minifying asset files (CSS & JS) for production performance...",
    );

    // Minify CSS files
    const cssFiles = ["main.css", "components.css", "dark-theme.css"];
    cssFiles.forEach((file) => {
      const rawCss = fs.readFileSync(path.join(cssDir, file), "utf8");
      const minifiedCss = rawCss
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
        .replace(/\s+/g, " ") // collapse spaces
        .replace(/\s*([\{\}:;,])\s*/g, "$1") // remove margins around structural markers
        .trim();
      fs.writeFileSync(
        path.join(cssDir, file.replace(".css", ".min.css")),
        minifiedCss,
        "utf8",
      );
      console.log(
        `  &bull; Minified: css/${file} -> css/${file.replace(".css", ".min.css")}`,
      );
    });

    // Minify JS files
    const jsFiles = ["app.js", "search.js"];
    jsFiles.forEach((file) => {
      const rawJs = fs.readFileSync(path.join(jsDir, file), "utf8");
      const minifiedJs = rawJs
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
        .replace(/\/\/\s.*/g, "") // remove standard inline comments
        .replace(/\s+/g, " ") // collapse spaces
        .trim();
      fs.writeFileSync(
        path.join(jsDir, file.replace(".js", ".min.js")),
        minifiedJs,
        "utf8",
      );
      console.log(
        `  &bull; Minified: js/${file} -> js/${file.replace(".js", ".min.js")}`,
      );
    });
  }

  // Execute compilation
  runBuild().catch((err) => {
    console.error("❌ Build script crashed with error: ", err);
  });
}
