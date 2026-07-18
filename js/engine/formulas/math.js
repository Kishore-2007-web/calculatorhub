/**
 * Math category formulas
 */
export const mathFormulas = {
  /**
   * Percentage Calculator formula logic
   */
  'percentage-calculator'(inputs) {
    const mode = inputs['pct-type'] || 'of';
    const x = inputs['pct-x'];
    const y = inputs['pct-y'];

    if (x === undefined || y === undefined) {
      throw new Error('Input variables are undefined.');
    }

    let result = 0;
    
    if (mode === 'of') {
      // What is X% of Y?
      result = (x / 100) * y;
    } else if (mode === 'is') {
      // X is what percent of Y?
      if (y === 0) {
        throw new Error('Whole value (Y) cannot be zero.');
      }
      result = (x / y) * 100;
    } else {
      // Percentage change from X to Y
      if (x === 0) {
        throw new Error('Initial value (X) cannot be zero.');
      }
      result = ((y - x) / x) * 100;
    }

    return result;
  },

  /**
   * General fallback double input sum
   */
  'simple-calculator'(inputs) {
    const a = inputs['val-a'] !== undefined ? inputs['val-a'] : 0;
    const b = inputs['val-b'] !== undefined ? inputs['val-b'] : 0;
    return a + b;
  }
};

export default mathFormulas;
