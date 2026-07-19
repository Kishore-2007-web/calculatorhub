/**
 * CalculatorHub Global Application Logic
 * Manages core features: theme switching, navigation, recently visited tracking, and analytics hooks.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initStickyNavbar();
  initResetButton();
  trackCalculatorVisit();
});

/**
 * Initialize Light/Dark Theme Switching
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Establish initial theme state
  const isDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
  
  if (isDark) {
    document.body.classList.add('dark-theme');
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-theme');
    if (themeToggle) themeToggle.checked = false;
  }

  // Bind change handler
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

/**
 * Sticky Navbar Handler on scroll
 */
function initStickyNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const checkScroll = () => {
    if (window.scrollY > 15) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/**
 * Global Calculator Input Reset handler
 */
function initResetButton() {
  const resetBtn = document.getElementById('reset-btn');
  const form = document.getElementById('calculator-form');
  const resultsContainer = document.getElementById('calculator-results');
  const alertContainer = document.getElementById('calculator-alert');

  if (resetBtn && form) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      Utils.clearAlert(alertContainer);

      // Programmatic outputs lookup and cleanup
      const outputElements = resultsContainer ? resultsContainer.querySelectorAll('[id^="result-"]') : [];
      outputElements.forEach(elem => {
        if (elem.id === 'result-bmi') {
          elem.innerText = '0.0';
        } else if (elem.id === 'result-bmi-cat') {
          elem.innerText = 'Normal Weight';
        } else if (elem.id === 'result-pct') {
          elem.innerText = '30';
        } else if (elem.id === 'result-emi') {
          elem.innerText = '$0.00';
        } else if (['result-emi-principal', 'result-emi-interest', 'result-emi-total', 'result-gst-net', 'result-gst-tax', 'result-gst-gross'].includes(elem.id)) {
          elem.innerText = '$0.00';
        } else if (elem.id.includes('years') || elem.id.includes('months') || elem.id.includes('days') || elem.id.includes('weeks') || elem.id.includes('hours')) {
          elem.innerText = '0';
        } else {
          elem.innerText = '0.00';
        }
      });
    });
  }
}

/**
 * Mobile Navigation Hamburger Drawer Logic
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
  }
}

/**
 * Track Recently Visited Calculators
 */
function trackCalculatorVisit() {
  const currentPath = window.location.pathname;
  // We only track actual calculator page files (not index.html, blog posts, category pages, etc.)
  if (currentPath.includes('/calculators/') && !currentPath.endsWith('/calculators/')) {
    const calcId = currentPath.split('/').filter(Boolean).pop();
    if (!calcId) return;

    // Get name of calculator from meta tags or title
    const calcName = document.title.split(' - ')[0] || calcId.replace(/-/g, ' ');

    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('recent_calculators')) || [];
    } catch (e) {
      recent = [];
    }

    // Filter duplicates
    recent = recent.filter(item => item.id !== calcId);

    // Unshift new visit
    recent.unshift({ id: calcId, name: calcName, path: currentPath });

    // Limit list to last 5
    if (recent.length > 5) recent.pop();

    localStorage.setItem('recent_calculators', JSON.stringify(recent));
  }
}

/**
 * Global Utilities
 */
export const Utils = {
  /**
   * Format numbers to localized strings safely
   */
  formatNumber(number, decimals = 2) {
    if (isNaN(number) || number === null || number === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(number);
  },

  /**
   * Clear error message alerts
   */
  clearAlert(container) {
    if (container) container.innerHTML = '';
  },

  /**
   * Show custom alerts
   */
  showAlert(container, type, message) {
    if (!container) return;
    const alertHTML = `
      <div class="alert alert-${type} animate-fade-in" role="alert">
        <span>${message}</span>
      </div>
    `;
    container.innerHTML = alertHTML;
  }
};

