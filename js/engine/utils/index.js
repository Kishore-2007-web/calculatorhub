/**
 * General Utilities
 */
export const Utils = {
  /**
   * Safely parse float from various inputs
   */
  parseFloat(val, fallback = 0) {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    const parsed = parseFloat(val.toString().replace(/[^0-9\.\-]/g, ''));
    return isNaN(parsed) ? fallback : parsed;
  },

  /**
   * Safely parse integer
   */
  parseInt(val, fallback = 0) {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'number') return isNaN(val) ? fallback : Math.floor(val);
    const parsed = parseInt(val.toString().replace(/[^0-9\-]/g, ''), 10);
    return isNaN(parsed) ? fallback : parsed;
  },

  /**
   * Safe hashing utility for string input mapping
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(36);
  },

  /**
   * Deep clone helper
   */
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Debounce events
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};
export default Utils;
