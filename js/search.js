/**
 * CalculatorHub Global Search and Autocomplete Engine
 * Features: instant search, category filtering, keyword matches, and recently visited list retrieval.
 */

import { calculators, categories } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});

function initSearch() {
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;

  let activeIndex = -1;
  let currentMatches = [];

  // Focus event: show recents or match search
  searchInput.addEventListener('focus', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query === '') {
      showRecents();
    } else {
      performSearch(query);
    }
  });

  // Blur event: hide container with short delay to allow click selection
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });

  // Input event: match query
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    activeIndex = -1;
    if (query === '') {
      showRecents();
    } else {
      performSearch(query);
    }
  });

  // Keyboard Navigation Support
  searchInput.addEventListener('keydown', (e) => {
    if (!searchResults.classList.contains('active') || currentMatches.length === 0) return;

    const items = searchResults.querySelectorAll('.search-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % currentMatches.length;
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
      updateActiveItem(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < currentMatches.length) {
        selectItem(currentMatches[activeIndex]);
      } else if (currentMatches.length > 0) {
        selectItem(currentMatches[0]);
      }
    } else if (e.key === 'Escape') {
      searchResults.classList.remove('active');
      searchInput.blur();
    }
  });

  function updateActiveItem(items) {
    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  function performSearch(query) {
    // Search algorithm: exact name matches first, then keyword matches
    const nameMatches = [];
    const keywordMatches = [];

    calculators.forEach(calc => {
      const name = calc.name.toLowerCase();
      const desc = calc.desc.toLowerCase();
      
      if (name.includes(query)) {
        nameMatches.push(calc);
      } else if (calc.keywords.some(k => k.includes(query)) || desc.includes(query)) {
        keywordMatches.push(calc);
      }
    });

    const combined = [...nameMatches, ...keywordMatches];
    // De-duplicate items
    const uniqueMatches = Array.from(new Set(combined)).slice(0, 8);
    currentMatches = uniqueMatches;

    renderResults(uniqueMatches, query);
  }

  function showRecents() {
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('recent_calculators')) || [];
    } catch (e) {
      recent = [];
    }

    if (recent.length === 0) {
      // If no recents, show popular calculators as default suggestions
      const popular = calculators.filter(c => c.popular).slice(0, 5);
      currentMatches = popular.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        isPopular: true
      }));
      renderDefaultSuggestions(currentMatches, '🔥 Popular Calculators');
    } else {
      currentMatches = recent.map(r => ({
        id: r.id,
        name: r.name,
        category: null,
        isRecent: true,
        path: r.path
      }));
      renderDefaultSuggestions(currentMatches, '🕒 Recently Visited');
    }
  }

  function renderDefaultSuggestions(items, heading) {
    searchResults.innerHTML = `
      <div style="padding: 8px 16px; font-size: 0.75rem; font-weight: 700; color: var(--color-text-tertiary); border-bottom: 1px solid var(--color-border); letter-spacing: 0.05em;">
        ${heading.toUpperCase()}
      </div>
    `;

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-item';
      div.innerHTML = `
        <span style="font-size: 1rem;">${item.isPopular ? '⚡' : '🕒'}</span>
        <div>
          <div style="font-weight: 500;">${item.name}</div>
        </div>
      `;
      div.addEventListener('click', () => selectItem(item));
      searchResults.appendChild(div);
    });

    searchResults.classList.add('active');
  }

  function renderResults(matches, query) {
    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--color-text-secondary); font-size: 0.9rem;">
          No calculators found matching "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      searchResults.classList.add('active');
      return;
    }

    searchResults.innerHTML = '';
    matches.forEach(item => {
      const categoryObj = categories.find(c => c.id === item.category);
      const categoryName = categoryObj ? categoryObj.name : 'Calculator';
      
      const div = document.createElement('div');
      div.className = 'search-item';
      
      // Highlight matching characters in name
      const regex = new RegExp(`(${query})`, 'gi');
      const highlightedName = item.name.replace(regex, '<mark style="background: var(--color-primary-light); color: var(--color-primary); font-weight: 600; border-radius: 2px;">$1</mark>');

      div.innerHTML = `
        <span style="font-size: 1.1rem;">🧮</span>
        <div style="flex: 1;">
          <div style="font-weight: 500;">${highlightedName}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-secondary); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${item.desc}
          </div>
        </div>
        <span class="search-item-category">${categoryName}</span>
      `;
      div.addEventListener('click', () => selectItem(item));
      searchResults.appendChild(div);
    });

    searchResults.classList.add('active');
  }

  function selectItem(item) {
    if (item.path) {
      window.location.href = item.path;
    } else {
      window.location.href = `/calculators/${item.id}/`;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
}
