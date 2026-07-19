/**
 * Centralized Mathematical Utilities for UCE
 */
export const MathUtils = {
  // Greatest Common Divisor
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

  // Least Common Multiple
  lcm(x, y) {
    if (x === 0 || y === 0) return 0;
    return Math.abs(x * y) / this.gcd(x, y);
  },

  // Clamp a number between min and max boundaries
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  // Factorial calculations
  factorial(n) {
    const val = Math.floor(n);
    if (val < 0) return NaN;
    if (val === 0 || val === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(val, 170); i++) {
      res *= i;
    }
    return res;
  },

  // Primality checker
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

  // Fibonacci numbers
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
  },

  // Round with exact precision helper
  round(val, decimals = 4) {
    if (typeof val !== 'number' || isNaN(val)) return val;
    const factor = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * factor) / factor;
  },

  // Angles conversions
  degToRad(deg) {
    return (deg * Math.PI) / 180;
  },

  radToDeg(rad) {
    return (rad * 180) / Math.PI;
  },

  // Basic Statistics
  sum(arr) {
    return arr.reduce((acc, x) => acc + x, 0);
  },

  average(arr) {
    if (!arr.length) return 0;
    return this.sum(arr) / arr.length;
  },

  median(arr) {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },

  variance(arr) {
    if (arr.length <= 1) return 0;
    const avg = this.average(arr);
    return this.sum(arr.map(x => Math.pow(x - avg, 2))) / (arr.length - 1);
  },

  stdDev(arr) {
    return Math.sqrt(this.variance(arr));
  }
};

export default MathUtils;
