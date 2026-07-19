import { FdlCompiler } from '../utils/fdl.js';
import { MathUtils } from '../utils/math.js';

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
   * Fraction Calculator
   */
  'fraction-calculator'(inputs) {
    const op = inputs['frac-op'] || '+';
    const n1 = Math.round(Number(inputs['frac-n1'] !== undefined ? inputs['frac-n1'] : 1));
    const d1 = Math.round(Number(inputs['frac-d1'] !== undefined ? inputs['frac-d1'] : 2));
    const n2 = Math.round(Number(inputs['frac-n2'] !== undefined ? inputs['frac-n2'] : 1));
    const d2 = Math.round(Number(inputs['frac-d2'] !== undefined ? inputs['frac-d2'] : 3));

    if (d1 === 0 || d2 === 0) {
      throw new Error('Denominator cannot be zero.');
    }

    let num = 0;
    let den = 1;

    switch (op) {
      case '+':
        num = n1 * d2 + n2 * d1;
        den = d1 * d2;
        break;
      case '-':
        num = n1 * d2 - n2 * d1;
        den = d1 * d2;
        break;
      case '*':
        num = n1 * n2;
        den = d1 * d2;
        break;
      case '/':
        if (n2 === 0) {
          throw new Error('Cannot divide by zero fraction.');
        }
        num = n1 * d2;
        den = d1 * n2;
        break;
      default:
        throw new Error('Invalid operator.');
    }

    if (den === 0) {
      throw new Error('Calculated denominator became zero.');
    }

    // Simplify fraction
    const divisor = MathUtils.gcd(num, den);
    num = num / divisor;
    den = den / divisor;

    // Adjust signs
    if (den < 0) {
      num = -num;
      den = -den;
    }

    let fracStr = '';
    if (num === 0) {
      fracStr = '0';
    } else if (den === 1) {
      fracStr = num.toString();
    } else {
      const absNum = Math.abs(num);
      if (absNum > den) {
        const whole = Math.floor(absNum / den);
        const rem = absNum % den;
        fracStr = `${num < 0 ? '-' : ''}${whole} ${rem}/${den}`;
      } else {
        fracStr = `${num}/${den}`;
      }
    }

    return {
      result: fracStr,
      decimal: num / den
    };
  },

  /**
   * Matrix Calculator for 2x2 matrices
   */
  'matrix-calculator'(inputs) {
    const op = inputs['matrix-op'] || 'add';
    const a11 = Number(inputs.a11 !== undefined ? inputs.a11 : 0);
    const a12 = Number(inputs.a12 !== undefined ? inputs.a12 : 0);
    const a21 = Number(inputs.a21 !== undefined ? inputs.a21 : 0);
    const a22 = Number(inputs.a22 !== undefined ? inputs.a22 : 0);
    const b11 = Number(inputs.b11 !== undefined ? inputs.b11 : 0);
    const b12 = Number(inputs.b12 !== undefined ? inputs.b12 : 0);
    const b21 = Number(inputs.b21 !== undefined ? inputs.b21 : 0);
    const b22 = Number(inputs.b22 !== undefined ? inputs.b22 : 0);

    let res = [];
    switch (op) {
      case 'add':
        res = [
          [a11 + b11, a12 + b12],
          [a21 + b21, a22 + b22]
        ];
        break;
      case 'subtract':
        res = [
          [a11 - b11, a12 - b12],
          [a21 - b21, a22 - b22]
        ];
        break;
      case 'multiply':
        res = [
          [a11 * b11 + a12 * b21, a11 * b12 + a12 * b22],
          [a21 * b11 + a22 * b21, a21 * b12 + a22 * b22]
        ];
        break;
      case 'det': {
        const det = a11 * a22 - a12 * a21;
        return { result: `det(A) = ${det}` };
      }
      case 'transpose':
        res = [
          [a11, a21],
          [a12, a22]
        ];
        break;
      default:
        throw new Error('Unsupported matrix operation.');
    }

    const formatMatrix = (m) => {
      return `[ ${m[0][0].toFixed(2)}, ${m[0][1].toFixed(2)} ]\n[ ${m[1][0].toFixed(2)}, ${m[1][1].toFixed(2)} ]`;
    };

    return { result: formatMatrix(res) };
  },

  /**
   * Percentage Difference Calculator
   */
  'percentage-difference-calculator'(inputs) {
    const a = Math.abs(Number(inputs.val_a !== undefined ? inputs.val_a : 0));
    const b = Math.abs(Number(inputs.val_b !== undefined ? inputs.val_b : 0));
    if (a + b === 0) return 0;
    return (Math.abs(a - b) / ((a + b) / 2)) * 100;
  },

  /**
   * Percentage Increase Calculator
   */
  'percentage-increase-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 0);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 0);
    if (a === 0) {
      throw new Error('Initial value cannot be zero.');
    }
    return ((b - a) / a) * 100;
  },

  /**
   * Percentage Decrease Calculator
   */
  'percentage-decrease-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 0);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 0);
    if (a === 0) {
      throw new Error('Initial value cannot be zero.');
    }
    return ((a - b) / a) * 100;
  },

  /**
   * Algebra Calculator
   */
  'algebra-calculator'(inputs) {
    const expr = (inputs.expression || '').trim();
    const x = Number(inputs['x-val'] !== undefined ? inputs['x-val'] : 0);
    if (!expr) throw new Error('Expression is empty.');
    try {
      return FdlCompiler.evaluate(expr, { x: x, X: x });
    } catch (err) {
      throw new Error(`Invalid expression: ${err.message}`);
    }
  },

  /**
   * Quadratic Equation Solver
   */
  'quadratic-equation-solver'(inputs) {
    const a = Number(inputs['eq-a'] !== undefined ? inputs['eq-a'] : 1);
    const b = Number(inputs['eq-b'] !== undefined ? inputs['eq-b'] : 0);
    const c = Number(inputs['eq-c'] !== undefined ? inputs['eq-c'] : 0);

    if (a === 0) {
      if (b === 0) {
        throw new Error('Not a valid equation (a and b are zero).');
      }
      return { result: `Linear Root: x = ${(-c / b).toFixed(4)}` };
    }

    const disc = b * b - 4 * a * c;
    if (disc > 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      return { result: `Two real roots:\nx1 = ${r1.toFixed(4)}\nx2 = ${r2.toFixed(4)}` };
    } else if (disc === 0) {
      const r = -b / (2 * a);
      return { result: `One double root:\nx = ${r.toFixed(4)}` };
    } else {
      const real = -b / (2 * a);
      const imag = Math.sqrt(-disc) / (2 * a);
      return { result: `Two complex roots:\nx1 = ${real.toFixed(4)} + ${imag.toFixed(4)}i\nx2 = ${real.toFixed(4)} - ${imag.toFixed(4)}i` };
    }
  },

  /**
   * GCD Calculator
   */
  'gcd-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 0);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 0);
    return MathUtils.gcd(a, b);
  },

  /**
   * LCM Calculator
   */
  'lcm-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 0);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 0);
    return MathUtils.lcm(a, b);
  },

  /**
   * Factorial Calculator
   */
  'factorial-calculator'(inputs) {
    const n = Number(inputs.val_a !== undefined ? inputs.val_a : 0);
    return MathUtils.factorial(n);
  },

  /**
   * Logarithm Calculator
   */
  'logarithm-calculator'(inputs) {
    const x = Number(inputs.val_a !== undefined ? inputs.val_a : 100);
    const baseType = inputs['log-base'] || '10';
    let base = 10;

    if (baseType === 'e') {
      base = Math.E;
    } else if (baseType === '2') {
      base = 2;
    } else if (baseType === 'custom') {
      base = Number(inputs['custom-base'] !== undefined ? inputs['custom-base'] : 10);
    }

    if (x <= 0) {
      throw new Error('Logarithm value must be greater than zero.');
    }
    if (base <= 0 || base === 1) {
      throw new Error('Logarithm base must be positive and not equal to 1.');
    }

    return Math.log(x) / Math.log(base);
  },

  /**
   * Antilogarithm Calculator
   */
  'antilogarithm-calculator'(inputs) {
    const x = Number(inputs.val_a !== undefined ? inputs.val_a : 2);
    const baseType = inputs['log-base'] || '10';
    let base = 10;

    if (baseType === 'e') {
      base = Math.E;
    } else if (baseType === '2') {
      base = 2;
    }

    return Math.pow(base, x);
  },

  /**
   * Binary Converter
   */
  'binary-converter'(inputs) {
    const rawVal = (inputs['num-val'] !== undefined ? inputs['num-val'] : '10').toString().trim();
    const dir = inputs['conv-dir'] || 'dec-to-bin';

    if (dir === 'dec-to-bin') {
      const dec = parseInt(rawVal, 10);
      if (isNaN(dec)) throw new Error('Invalid decimal number.');
      return { result: dec.toString(2) };
    } else {
      const dec = parseInt(rawVal, 2);
      if (isNaN(dec)) throw new Error('Invalid binary number.');
      return { result: dec.toString(10) };
    }
  },

  /**
   * Hex Converter
   */
  'hex-converter'(inputs) {
    const rawVal = (inputs['num-val'] !== undefined ? inputs['num-val'] : '255').toString().trim();
    const dir = inputs['conv-dir'] || 'dec-to-hex';

    if (dir === 'dec-to-hex') {
      const dec = parseInt(rawVal, 10);
      if (isNaN(dec)) throw new Error('Invalid decimal number.');
      return { result: dec.toString(16).toUpperCase() };
    } else {
      const dec = parseInt(rawVal, 16);
      if (isNaN(dec)) throw new Error('Invalid hexadecimal number.');
      return { result: dec.toString(10) };
    }
  },

  /**
   * Modulo Calculator
   */
  'modulo-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 0);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 0);
    if (b === 0) throw new Error('Divisor cannot be zero.');
    return a % b;
  },

  /**
   * Base Converter
   */
  'base-converter'(inputs) {
    const rawVal = (inputs['num-val'] !== undefined ? inputs['num-val'] : '1010').toString().trim();
    const fromBase = Math.round(Number(inputs['from-base'] !== undefined ? inputs['from-base'] : 2));
    const toBase = Math.round(Number(inputs['to-base'] !== undefined ? inputs['to-base'] : 10));

    if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
      throw new Error('Base must be between 2 and 36.');
    }

    const decimalValue = parseInt(rawVal, fromBase);
    if (isNaN(decimalValue)) {
      throw new Error(`Invalid input "${rawVal}" for base ${fromBase}.`);
    }

    return { result: decimalValue.toString(toBase).toUpperCase() };
  },

  /**
   * Fibonacci Calculator
   */
  'fibonacci-calculator'(inputs) {
    const n = Math.round(Number(inputs.val_a !== undefined ? inputs.val_a : 10));
    if (n < 0) throw new Error('Index must be non-negative.');
    const result = MathUtils.fibonacci(n);

    const terms = [];
    for (let i = 0; i <= Math.min(n, 12); i++) {
      terms.push(MathUtils.fibonacci(i));
    }
    let sequence = terms.join(', ');
    if (n > 12) sequence += ', ...';

    return {
      result: result,
      sequence: sequence
    };
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
        return MathUtils.factorial(a);
      case 'prime-number-checker':
        return MathUtils.isPrime(a) ? 1 : 0; // Returns 1 for Prime, 0 for Composite
      case 'gcd-calculator':
        return MathUtils.gcd(a, b);
      case 'lcm-calculator':
        return MathUtils.lcm(a, b);
      case 'modulo-calculator':
        if (b === 0) throw new Error('Division by zero.');
        return a % b;
      case 'exponent-calculator':
        return Math.pow(a, b);
      case 'fibonacci-calculator':
        return MathUtils.fibonacci(a);
      case 'sine-calculator':
        return Math.sin(MathUtils.degToRad(a));
      case 'cosine-calculator':
        return Math.cos(MathUtils.degToRad(a));
      case 'tangent-calculator':
        if ((a - 90) % 180 === 0) throw new Error('Tangent is undefined for this angle.');
        return Math.tan(MathUtils.degToRad(a));
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

export default mathFormulas;
