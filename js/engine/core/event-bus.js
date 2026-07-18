/**
 * UCE Event Bus
 * Facilitates loosely coupled communication across engine layers
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName 
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);

    // Return an unsubscribe handler
    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName 
   * @param {Function} callback 
   */
  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;
    const list = this.listeners.get(eventName);
    const index = list.indexOf(callback);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  /**
   * Emit an event
   * @param {string} eventName 
   * @param {any} data 
   */
  emit(eventName, data) {
    // Exact match listeners
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${eventName}:`, err);
        }
      });
    }

    // Global wildcard listeners (if registered under '*')
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => {
        try {
          cb({ eventName, data });
        } catch (err) {
          console.error(`Error in wildcard event listener:`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBus();
