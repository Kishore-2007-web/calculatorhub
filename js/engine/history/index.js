/**
 * Universal Calculator Engine - History & Sharing Module
 * Stores historical calculation values locally. Keeps logs optional and disabled by default.
 */
export class UceHistory {
  constructor() {
    this.enabled = false; // Disabled by default
  }

  /**
   * Toggle history logging
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Log calculation values to history stack
   */
  save(calculatorId, inputs, outputs) {
    if (!this.enabled) return;

    try {
      const log = {
        calculatorId,
        inputs: { ...inputs },
        outputs: { ...outputs },
        timestamp: Date.now()
      };

      const history = this.getHistoryList();
      history.unshift(log);

      // Truncate to keep the last 50 entries
      if (history.length > 50) history.pop();

      localStorage.setItem('uce_history_logs', JSON.stringify(history));
    } catch (err) {
      console.warn('[History] Failed to store calculation log:', err);
    }
  }

  /**
   * Retrieve historical logs list
   */
  getHistoryList() {
    if (!this.enabled) return [];
    try {
      const logsStr = localStorage.getItem('uce_history_logs');
      return logsStr ? JSON.parse(logsStr) : [];
    } catch (err) {
      return [];
    }
  }

  /**
   * Generate sharing query parameters link
   */
  generateShareLink(calculatorId, inputs) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    
    // Prefix parameters to prevent collisions with router params
    Object.entries(inputs).forEach(([key, val]) => {
      params.set(`p_${key}`, val);
    });

    url.search = params.toString();
    return url.toString();
  }

  /**
   * Extract inputs map from current sharing URL search params
   */
  parseShareLink() {
    const params = new URLSearchParams(window.location.search);
    const inputs = {};
    for (const [key, value] of params.entries()) {
      if (key.startsWith('p_')) {
        const inputId = key.substring(2);
        inputs[inputId] = value;
      }
    }
    return inputs;
  }

  /**
   * Clear historical logs
   */
  clear() {
    try {
      localStorage.removeItem('uce_history_logs');
    } catch (err) {}
  }
}

export const uceHistory = new UceHistory();
export default uceHistory;
