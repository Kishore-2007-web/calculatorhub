import { FdlCompiler } from '../utils/fdl.js';

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
   * Interactive pocket calculator formula evaluator
   */
  'simple-calculator'(inputs) {
    const expr = inputs.expression || '0';
    try {
      return FdlCompiler.evaluate(expr, {});
    } catch (err) {
      throw new Error('Mathematical syntax error.');
    }
  },

  /**
   * Interactive scientific calculator formula evaluator
   */
  'scientific-calculator'(inputs) {
    const expr = inputs.expression || '0';
    try {
      return FdlCompiler.evaluate(expr, {});
    } catch (err) {
      throw new Error('Mathematical syntax error.');
    }
  }
};

export default mathFormulas;
