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
  },

  /**
   * Category fallback handler for unregistered math calculators
   */
  _fallback(calculatorId, inputs) {
    const a = inputs.val_a !== undefined ? parseFloat(inputs.val_a) : 0;
    const b = inputs.val_b !== undefined ? parseFloat(inputs.val_b) : 0;

    switch (calculatorId) {
      case 'square-root-calculator':
        if (a < 0) throw new Error('Cannot compute square root of a negative number.');
        return Math.sqrt(a);
      case 'cube-root-calculator':
        return Math.cbrt(a);
      case 'factorial-calculator':
        return mathHelpers.factorial(a);
      case 'prime-number-checker':
        return mathHelpers.isPrime(a) ? 1 : 0; // Returns 1 for Prime, 0 for Composite
      case 'gcd-calculator':
        return mathHelpers.gcd(a, b);
      case 'lcm-calculator':
        return mathHelpers.lcm(a, b);
      case 'modulo-calculator':
        if (b === 0) throw new Error('Division by zero.');
        return a % b;
      case 'exponent-calculator':
        return Math.pow(a, b);
      case 'fibonacci-calculator':
        return mathHelpers.fibonacci(a);
      case 'sine-calculator':
        return Math.sin(a * Math.PI / 180);
      case 'cosine-calculator':
        return Math.cos(a * Math.PI / 180);
      case 'tangent-calculator':
        if ((a - 90) % 180 === 0) throw new Error('Tangent is undefined for this angle.');
        return Math.tan(a * Math.PI / 180);
      case 'logarithm-calculator':
        if (a <= 0) throw new Error('Logarithm is undefined for non-positive numbers.');
        return Math.log10(a);
      case 'antilogarithm-calculator':
        return Math.pow(10, a);
      case 'division-calculator':
        if (b === 0) throw new Error('Division by zero.');
        return a / b;
      case 'percentage-difference-calculator':
        if (a + b === 0) return 0;
        return (Math.abs(a - b) / ((a + b) / 2)) * 100;
      case 'percentage-increase-calculator':
        if (a === 0) throw new Error('Base value cannot be zero.');
        return ((b - a) / a) * 100;
      case 'percentage-decrease-calculator':
        if (a === 0) throw new Error('Base value cannot be zero.');
        return ((a - b) / a) * 100;
      default:
        // Default math operation is addition
        return a + b;
    }
  }
};

// Math helper algorithms
const mathHelpers = {
  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 170); i++) res *= i;
    return res;
  },

  gcd(x, y) {
    x = Math.abs(Math.floor(x));
    y = Math.abs(Math.floor(y));
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  },

  lcm(x, y) {
    if (x === 0 || y === 0) return 0;
    return Math.abs(x * y) / this.gcd(x, y);
  },

  isPrime(n) {
    const val = Math.floor(n);
    if (val <= 1) return false;
    if (val <= 3) return true;
    if (val % 2 === 0 || val % 3 === 0) return false;
    for (let i = 5; i * i <= val; i += 6) {
      if (val % i === 0 || val % (i + 2) === 0) return false;
    }
    return true;
  },

  fibonacci(n) {
    const val = Math.floor(n);
    if (val < 0) return NaN;
    if (val === 0) return 0;
    let a = 0, b = 1, temp;
    for (let i = 2; i <= Math.min(val, 75); i++) {
      temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }
};

export default mathFormulas;
