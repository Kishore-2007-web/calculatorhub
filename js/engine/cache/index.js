/**
 * Universal Calculator Engine - Tiered Caching System
 * Supports Memory, Session, and LocalStorage cache tiers.
 * Automatically invalidates calculations based on calculator definition versions.
 */
import { Utils } from '../utils/index.js';

export class UceCache {
  constructor() {
    this.memoryCache = new Map();
  }

  /**
   * Resolve cached output details based on calculator configs and inputs
   * @param {Object} calculator UceCalculator model
   * @param {Object} inputs key-value variables
   * @returns {Object|null} cached response
   */
  get(calculator, inputs) {
    const key = this.getCacheKey(calculator.id, inputs);
    const targetVersion = calculator.version || '1.0.0';

    // 1. MEMORY CACHE SEARCH
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (entry.version === targetVersion) {
        return entry.data;
      }
      this.memoryCache.delete(key); // Invalidate
    }

    // 2. SESSION STORAGE SEARCH
    try {
      const sessionEntryStr = sessionStorage.getItem(key);
      if (sessionEntryStr) {
        const entry = JSON.parse(sessionEntryStr);
        if (entry.version === targetVersion) {
          // Warm up Memory Cache
          this.memoryCache.set(key, entry);
          return entry.data;
        }
        sessionStorage.removeItem(key); // Invalidate
      }
    } catch (err) {}

    // 3. LOCAL STORAGE SEARCH
    try {
      const localEntryStr = localStorage.getItem(key);
      if (localEntryStr) {
        const entry = JSON.parse(localEntryStr);
        if (entry.version === targetVersion) {
          // Warm up Memory Cache
          this.memoryCache.set(key, entry);
          return entry.data;
        }
        localStorage.removeItem(key); // Invalidate
      }
    } catch (err) {}

    return null;
  }

  /**
   * Save outputs to cache tiers
   */
  set(calculator, inputs, outputData, tier = 'memory') {
    const key = this.getCacheKey(calculator.id, inputs);
    const entry = {
      version: calculator.version || '1.0.0',
      data: outputData,
      timestamp: Date.now()
    };

    // Always store in memory
    this.memoryCache.set(key, entry);

    // Tiered backup storage
    if (tier === 'session' || tier === 'local') {
      try {
        sessionStorage.setItem(key, JSON.stringify(entry));
      } catch (err) {}
    }

    if (tier === 'local') {
      try {
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (err) {}
    }
  }

  /**
   * Generate safe unique key based on inputs hash
   */
  getCacheKey(calculatorId, inputs) {
    const stringified = JSON.stringify(inputs);
    const hash = Utils.hashString(stringified);
    return `uce_cache_${calculatorId}_${hash}`;
  }

  /**
   * Clear all active cache keys
   */
  clear() {
    this.memoryCache.clear();
    try {
      // Clear session/local variables matching UCE cache prefixes
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('uce_cache_')) keysToRemove.push(key);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('uce_cache_')) sessionKeysToRemove.push(key);
      }
      sessionKeysToRemove.forEach(k => sessionStorage.removeItem(k));
    } catch (err) {}
  }
}

export const uceCache = new UceCache();
export default uceCache;
