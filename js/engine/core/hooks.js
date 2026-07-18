/**
 * Hook System
 * Enables custom plugin hooks to run sequentially during calculation pipeline stages.
 */
export class HookSystem {
  constructor() {
    this.hooks = new Map();
  }

  /**
   * Register a callback to a specific hook
   * @param {string} hookName 
   * @param {Function} callback 
   */
  register(hookName, callback) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(callback);
    return this;
  }

  /**
   * Run all callbacks registered to a specific hook sequentially
   * @param {string} hookName 
   * @param {any} context 
   * @returns {Promise<any>}
   */
  async run(hookName, context) {
    if (!this.hooks.has(hookName)) return context;
    
    let currentContext = context;
    const callbacks = this.hooks.get(hookName);

    for (const callback of callbacks) {
      try {
        const result = await callback(currentContext);
        if (result !== undefined) {
          currentContext = result;
        }
      } catch (err) {
        console.error(`[HookSystem] Error running callback for hook [${hookName}]:`, err);
      }
    }

    return currentContext;
  }
}

export const hooks = new HookSystem();
