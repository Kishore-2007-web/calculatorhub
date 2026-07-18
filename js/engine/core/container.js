/**
 * Dependency Injection (DI) Container
 * Decouples engine modules and allows easy mocking during testing.
 */
export class Container {
  constructor() {
    this.services = new Map();
  }

  /**
   * Register a service/module instance
   * @param {string} name 
   * @param {any} instance 
   */
  register(name, instance) {
    this.services.set(name, instance);
    return this;
  }

  /**
   * Resolve a service/module instance
   * @param {string} name 
   * @returns {any}
   */
  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service [${name}] could not be resolved from DI Container.`);
    }
    return this.services.get(name);
  }

  /**
   * Check if a service is registered
   * @param {string} name 
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Reset the container (useful for test isolation)
   */
  clear() {
    this.services.clear();
  }
}

export const container = new Container();
