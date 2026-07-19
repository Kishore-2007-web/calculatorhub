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
   * Trigonometry Calculator
   */
  'trigonometry-calculator'(inputs) {
    const val = Number(inputs.val_a !== undefined ? inputs.val_a : 45);
    const unit = inputs['angle-unit'] || 'degrees';
    const func = inputs['trig-func'] || 'sin';

    const rad = unit === 'degrees' ? MathUtils.degToRad(val) : val;

    let res = 0;
    switch (func) {
      case 'sin': res = Math.sin(rad); break;
      case 'cos': res = Math.cos(rad); break;
      case 'tan': {
        if (unit === 'degrees' && (val - 90) % 180 === 0) {
          throw new Error('Tangent is undefined for this angle.');
        }
        res = Math.tan(rad);
        break;
      }
      case 'csc': {
        const sin = Math.sin(rad);
        if (sin === 0) throw new Error('Cosecant is undefined (sine is zero).');
        res = 1 / sin;
        break;
      }
      case 'sec': {
        const cos = Math.cos(rad);
        if (cos === 0) throw new Error('Secant is undefined (cosine is zero).');
        res = 1 / cos;
        break;
      }
      case 'cot': {
        const tan = Math.tan(rad);
        if (tan === 0) throw new Error('Cotangent is undefined (tangent is zero).');
        res = 1 / tan;
        break;
      }
      default:
        throw new Error('Unsupported trigonometric function.');
    }
    return res;
  },

  /**
   * Sine Calculator
   */
  'sine-calculator'(inputs) {
    const val = Number(inputs.val_a !== undefined ? inputs.val_a : 30);
    const unit = inputs['angle-unit'] || 'degrees';
    const rad = unit === 'degrees' ? MathUtils.degToRad(val) : val;
    return Math.sin(rad);
  },

  /**
   * Cosine Calculator
   */
  'cosine-calculator'(inputs) {
    const val = Number(inputs.val_a !== undefined ? inputs.val_a : 60);
    const unit = inputs['angle-unit'] || 'degrees';
    const rad = unit === 'degrees' ? MathUtils.degToRad(val) : val;
    return Math.cos(rad);
  },

  /**
   * Tangent Calculator
   */
  'tangent-calculator'(inputs) {
    const val = Number(inputs.val_a !== undefined ? inputs.val_a : 45);
    const unit = inputs['angle-unit'] || 'degrees';
    const rad = unit === 'degrees' ? MathUtils.degToRad(val) : val;
    if (unit === 'degrees' && (val - 90) % 180 === 0) {
      throw new Error('Tangent is undefined for this angle.');
    }
    return Math.tan(rad);
  },

  /**
   * Division Calculator
   */
  'division-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 10);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 3);
    if (b === 0) throw new Error('Division by zero.');
    return {
      result: a / b,
      'integer-quotient': Math.floor(a / b),
      remainder: a % b
    };
  },

  /**
   * Exponent Calculator
   */
  'exponent-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 2);
    const b = Number(inputs.val_b !== undefined ? inputs.val_b : 3);
    return Math.pow(a, b);
  },

  /**
   * Square Root Calculator
   */
  'square-root-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 16);
    if (a < 0) throw new Error('Cannot calculate square root of a negative number.');
    return Math.sqrt(a);
  },

  /**
   * Cube Root Calculator
   */
  'cube-root-calculator'(inputs) {
    const a = Number(inputs.val_a !== undefined ? inputs.val_a : 27);
    return Math.cbrt(a);
  },

  /**
   * Pi Calculator
   */
  'pi-calculator'(inputs) {
    const digits = Math.round(Number(inputs.digits !== undefined ? inputs.digits : 100));
    if (digits < 0 || digits > 1000) {
      throw new Error('Digits count must be between 0 and 1000.');
    }
    const PI_STR = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989";
    if (digits === 0) return { result: "3" };
    return { result: PI_STR.slice(0, digits + 2) };
  },

  /**
   * Prime Number Checker
   */
  'prime-number-checker'(inputs) {
    const val = Number(inputs.val_a !== undefined ? inputs.val_a : 17);
    return MathUtils.isPrime(val) ? 'Prime Number' : 'Composite Number';
  },

  /**
   * Fraction to Decimal Calculator
   */
  'fraction-to-decimal'(inputs) {
    const n = Number(inputs['frac-n'] !== undefined ? inputs['frac-n'] : 3);
    const d = Number(inputs['frac-d'] !== undefined ? inputs['frac-d'] : 4);
    if (d === 0) throw new Error('Denominator cannot be zero.');
    return n / d;
  },

  /**
   * Decimal to Fraction Calculator
   */
  'decimal-to-fraction'(inputs) {
    const val = Number(inputs['dec-val'] !== undefined ? inputs['dec-val'] : 0.75);
    if (isNaN(val)) throw new Error('Invalid number.');
    
    if (Number.isInteger(val)) {
      return { result: `${val}/1` };
    }

    const sign = val < 0 ? '-' : '';
    const absVal = Math.abs(val);
    
    const str = absVal.toString();
    const decIndex = str.indexOf('.');
    let decPlaces = 0;
    if (decIndex !== -1) {
      decPlaces = str.length - decIndex - 1;
    }
    decPlaces = Math.min(decPlaces, 9);

    const den = Math.pow(10, decPlaces);
    const num = Math.round(absVal * den);

    const divisor = MathUtils.gcd(num, den);
    const simplifiedNum = num / divisor;
    const simplifiedDen = den / divisor;

    return { result: `${sign}${simplifiedNum}/${simplifiedDen}` };
  },

  /**
   * Roman Numeral Converter
   */
  'roman-numeral-converter'(inputs) {
    const rawVal = (inputs['roman-val'] || 'XIV').toString().trim();
    const dir = inputs['conv-dir'] || 'rom-to-dec';

    const romanToDecimal = (str) => {
      const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let num = 0;
      for (let i = 0; i < str.length; i++) {
        const current = roman[str[i].toUpperCase()];
        const next = roman[str[i + 1]?.toUpperCase()];
        if (current === undefined) throw new Error('Invalid Roman Numeral character.');
        if (next && current < next) {
          num += next - current;
          i++;
        } else {
          num += current;
        }
      }
      return num;
    };

    const decimalToRoman = (num) => {
      let val = Math.round(Number(num));
      if (isNaN(val) || val <= 0 || val > 3999) throw new Error('Value must be an integer between 1 and 3999.');
      const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
      let roman = '';
      for (const key in lookup) {
        while (val >= lookup[key]) {
          roman += key;
          val -= lookup[key];
        }
      }
      return roman;
    };

    if (dir === 'rom-to-dec') {
      return { result: romanToDecimal(rawVal).toString() };
    } else {
      return { result: decimalToRoman(rawVal) };
    }
  },

  /**
   * Linear Equation Solver
   */
  'linear-equation-solver'(inputs) {
    const a = Number(inputs['eq-a'] !== undefined ? inputs['eq-a'] : 2);
    const b = Number(inputs['eq-b'] !== undefined ? inputs['eq-b'] : -4);

    if (a === 0) {
      if (b === 0) return { result: 'Infinitely many solutions (0 = 0)' };
      return { result: 'No solution (equation is inconsistent)' };
    }
    return { result: `x = ${(-b / a).toFixed(4)}` };
  },

  /**
   * Cubic Equation Solver
   */
  'cubic-equation-solver'(inputs) {
    const a = Number(inputs['eq-a'] !== undefined ? inputs['eq-a'] : 1);
    const b = Number(inputs['eq-b'] !== undefined ? inputs['eq-b'] : 0);
    const c = Number(inputs['eq-c'] !== undefined ? inputs['eq-c'] : 0);
    const d = Number(inputs['eq-d'] !== undefined ? inputs['eq-d'] : 0);

    const solveQuadratic = (qa, qb, qc) => {
      if (qa === 0) {
        if (qb === 0) return 'No solution';
        return `x = ${(-qc / qb).toFixed(4)}`;
      }
      const disc = qb * qb - 4 * qa * qc;
      if (disc > 0) {
        const r1 = (-qb + Math.sqrt(disc)) / (2 * qa);
        const r2 = (-qb - Math.sqrt(disc)) / (2 * qa);
        return `x1 = ${r1.toFixed(4)}, x2 = ${r2.toFixed(4)}`;
      } else if (disc === 0) {
        return `x = ${(-qb / (2 * qa)).toFixed(4)}`;
      } else {
        const real = -qb / (2 * qa);
        const imag = Math.sqrt(-disc) / (2 * qa);
        return `x1 = ${real.toFixed(4)} + ${imag.toFixed(4)}i, x2 = ${real.toFixed(4)} - ${imag.toFixed(4)}i`;
      }
    };

    if (a === 0) {
      return { result: solveQuadratic(b, c, d) };
    }

    const normB = b / a;
    const normC = c / a;
    const normD = d / a;

    const q = (3 * normC - normB * normB) / 9;
    const r = (9 * normB * normC - 27 * normD - 2 * Math.pow(normB, 3)) / 54;
    const disc = q * q * q + r * r;

    let roots = [];

    if (disc > 0) {
      const s = Math.cbrt(r + Math.sqrt(disc));
      const t = Math.cbrt(r - Math.sqrt(disc));
      const r1 = -normB / 3 + (s + t);
      const realPart = -normB / 3 - (s + t) / 2;
      const imagPart = (Math.sqrt(3) * (s - t)) / 2;
      roots = [
        `x1 = ${r1.toFixed(4)}`,
        `x2 = ${realPart.toFixed(4)} + ${Math.abs(imagPart).toFixed(4)}i`,
        `x3 = ${realPart.toFixed(4)} - ${Math.abs(imagPart).toFixed(4)}i`
      ];
    } else if (disc === 0) {
      const r13 = Math.cbrt(r);
      const r1 = -normB / 3 + 2 * r13;
      const r2 = -normB / 3 - r13;
      roots = [
        `x1 = ${r1.toFixed(4)}`,
        `x2 = ${r2.toFixed(4)} (double root)`
      ];
    } else {
      const theta = Math.acos(r / Math.sqrt(-Math.pow(q, 3)));
      const sqrtQ = Math.sqrt(-q);
      const r1 = 2 * sqrtQ * Math.cos(theta / 3) - normB / 3;
      const r2 = 2 * sqrtQ * Math.cos((theta + 2 * Math.PI) / 3) - normB / 3;
      const r3 = 2 * sqrtQ * Math.cos((theta + 4 * Math.PI) / 3) - normB / 3;
      roots = [
        `x1 = ${r1.toFixed(4)}`,
        `x2 = ${r2.toFixed(4)}`,
        `x3 = ${r3.toFixed(4)}`
      ];
    }

    return { result: roots.join('\n') };
  },

  /**
   * Algebraic Expression Simplifier
   */
  'algebraic-expression-simplifier'(inputs) {
    let expr = (inputs.expression || '3*x + 2*x - 5 + 10').toString();
    expr = expr.replace(/\s+/g, '').replace(/-/g, '+-');
    const terms = expr.split('+').filter(Boolean);
    let xCoeff = 0;
    let x2Coeff = 0;
    let constant = 0;

    for (let term of terms) {
      if (term.includes('x^2') || term.includes('x*x')) {
        const c = term.replace(/x\^2|x\*x/g, '').replace(/\*/g, '');
        const val = c === '' ? 1 : (c === '-' ? -1 : parseFloat(c));
        x2Coeff += isNaN(val) ? 0 : val;
      } else if (term.includes('x')) {
        const c = term.replace(/x/g, '').replace(/\*/g, '');
        const val = c === '' ? 1 : (c === '-' ? -1 : parseFloat(c));
        xCoeff += isNaN(val) ? 0 : val;
      } else {
        const val = parseFloat(term);
        constant += isNaN(val) ? 0 : val;
      }
    }

    const resultParts = [];
    if (x2Coeff !== 0) resultParts.push(`${x2Coeff === 1 ? '' : (x2Coeff === -1 ? '-' : x2Coeff)}x^2`);
    if (xCoeff !== 0) resultParts.push(`${xCoeff > 0 && resultParts.length > 0 ? '+' : ''}${xCoeff === 1 ? '' : (xCoeff === -1 ? '-' : xCoeff)}x`);
    if (constant !== 0) resultParts.push(`${constant > 0 && resultParts.length > 0 ? '+' : ''}${constant}`);
    
    return { result: resultParts.join('') || '0' };
  },

  /**
   * Partial Fraction Decomposition
   */
  'partial-fraction-decomposition-calculator'(inputs) {
    const numStr = (inputs['num-expr'] || '3*x + 5').toString();
    const denStr = (inputs['den-expr'] || '(x - 1)*(x + 2)').toString();

    const numMatch = numStr.replace(/\s+/g, '').match(/^([+-]?\d*)\*?x([+-]\d+)?$/);
    const denMatch = denStr.replace(/\s+/g, '').match(/^\(x([+-]\d+)\)\*?\(x([+-]\d+)\)$/);

    if (!numMatch || !denMatch) {
      return { result: 'Supported form: Numerator px + q, Denominator (x - a)(x - b)' };
    }

    const p = parseFloat(numMatch[1] === '' ? 1 : (numMatch[1] === '+' ? 1 : (numMatch[1] === '-' ? -1 : numMatch[1])));
    const q = parseFloat(numMatch[2] || 0);

    const negA = parseFloat(denMatch[1]);
    const negB = parseFloat(denMatch[2]);

    const a = -negA;
    const b = -negB;

    if (a === b) {
      return { result: 'Roots must be distinct (a !== b).' };
    }

    const A = (p * a + q) / (a - b);
    const B = (p * b + q) / (b - a);

    const termA = `(${A.toFixed(2)}) / (x - ${a})`;
    const termB = `(${B.toFixed(2)}) / (x - ${b})`;
    return { result: `${termA} + ${termB}` };
  },

  /**
   * Complex Number Calculator
   */
  'complex-number-calculator'(inputs) {
    const r1 = Number(inputs['real-1'] !== undefined ? inputs['real-1'] : 0);
    const i1 = Number(inputs['imag-1'] !== undefined ? inputs['imag-1'] : 0);
    const r2 = Number(inputs['real-2'] !== undefined ? inputs['real-2'] : 0);
    const i2 = Number(inputs['imag-2'] !== undefined ? inputs['imag-2'] : 0);
    const op = inputs['complex-op'] || 'add';

    let r = 0, i = 0;
    switch (op) {
      case 'add':
        r = r1 + r2;
        i = i1 + i2;
        break;
      case 'subtract':
        r = r1 - r2;
        i = i1 - i2;
        break;
      case 'multiply':
        r = r1 * r2 - i1 * i2;
        i = r1 * i2 + r2 * i1;
        break;
      case 'divide': {
        const div = r2 * r2 + i2 * i2;
        if (div === 0) throw new Error('Division by zero in complex calculation.');
        r = (r1 * r2 + i1 * i2) / div;
        i = (i1 * r2 - r1 * i2) / div;
        break;
      }
      default:
        throw new Error('Unsupported complex operation.');
    }

    const sign = i >= 0 ? '+' : '-';
    return { result: `${r.toFixed(4)} ${sign} ${Math.abs(i).toFixed(4)}i` };
  },

  /**
   * Vector Addition Calculator
   */
  'vector-addition-calculator'(inputs) {
    const v1x = Number(inputs.v1x !== undefined ? inputs.v1x : 0);
    const v1y = Number(inputs.v1y !== undefined ? inputs.v1y : 0);
    const v1z = Number(inputs.v1z !== undefined ? inputs.v1z : 0);
    const v2x = Number(inputs.v2x !== undefined ? inputs.v2x : 0);
    const v2y = Number(inputs.v2y !== undefined ? inputs.v2y : 0);
    const v2z = Number(inputs.v2z !== undefined ? inputs.v2z : 0);

    const rx = v1x + v2x;
    const ry = v1y + v2y;
    const rz = v1z + v2z;
    const mag = Math.sqrt(rx * rx + ry * ry + rz * rz);

    return {
      result: `[ ${rx.toFixed(2)}, ${ry.toFixed(2)}, ${rz.toFixed(2)} ]`,
      magnitude: mag
    };
  },

  /**
   * Matrix Inverse Calculator
   */
  'matrix-inverse-calculator'(inputs) {
    const a11 = Number(inputs.a11 !== undefined ? inputs.a11 : 1);
    const a12 = Number(inputs.a12 !== undefined ? inputs.a12 : 0);
    const a21 = Number(inputs.a21 !== undefined ? inputs.a21 : 0);
    const a22 = Number(inputs.a22 !== undefined ? inputs.a22 : 1);

    const det = a11 * a22 - a12 * a21;
    if (det === 0) {
      return {
        result: 'Matrix is singular and has no inverse.',
        determinant: 0
      };
    }

    const inv11 = a22 / det;
    const inv12 = -a12 / det;
    const inv21 = -a21 / det;
    const inv22 = a11 / det;

    return {
      result: `[ ${inv11.toFixed(4)}, ${inv12.toFixed(4)} ]\n[ ${inv21.toFixed(4)}, ${inv22.toFixed(4)} ]`,
      determinant: det
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
