# CalculatorHub

> Every Calculator You Need — Free, Fast & Accurate

CalculatorHub is a production-ready, highly scalable online calculator platform containing 300+ calculators spanning Mathematics, Finance, Tax, Health, Unit Conversions, Science, Engineering, and more.

## Tech Stack & Architecture
- **Front-end**: HTML5, Vanilla CSS3 (Custom Properties, Flexbox/Grid, Dark Mode), Vanilla JavaScript (ES6 Modules).
- **Core Architecture**: Single-page templates (`templates/`) compiled into statically served, fully SEO-optimized directory structures.
- **Build System**: Clean, zero-dependency Node.js template compiler (`scripts/build.js`).
- **Target Metrics**: 95+ score on Lighthouse Performance, Accessibility, Best Practices, and SEO.

## Directory Structure
- `css/` — Core stylesheet, grid utilities, components, dark/light theme properties.
- `js/` — App runner, dynamic database lookup, global autocomplete search engine.
- `js/calculators/` — Logic and UI configurations for individual calculators.
- `templates/` — Core page structural templates (layout, homepage, category pages, blog list/post, terms, privacy).
- `scripts/` — Automated build system to pre-compile the templates into standard HTML pages.
- `calculators/` — Compiled static HTML files for all calculators.
- `categories/` — Compiled static HTML files for category listing pages.
- `blog/` — Static blog articles.

## Getting Started
### Install Dependencies & Local Server
No third-party framework libraries are needed! Simply use Node.js to preview the project locally.

```bash
# Start local preview server
npm start
```

### Compile & Build
To rebuild all static index pages and categories:

```bash
npm run build
```

## Adding a Calculator
Adding calculator #301 is simple:
1. Create a module file in `js/calculators/` (e.g. `compound-interest.js`).
2. Add its schema, calculations, and UI structure.
3. Register the calculator ID and metadata inside `js/database.js`.
4. Run `npm run build` to compile the new pages and sitemap.
