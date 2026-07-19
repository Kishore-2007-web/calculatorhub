/**
 * Math category registry configurations
 */
export const mathRegistry = [
  {
    id: 'percentage-calculator',
    version: '1.0.0',
    name: 'Percentage Calculator',
    category: 'math',
    desc: 'Calculate percentages, percentage increases, and percentage ratios.',
    formulaType: 'function',
    inputs: [
      {
        id: 'pct-type',
        label: 'Operation',
        type: 'dropdown',
        defaultValue: 'of',
        required: true,
        options: [
          { label: 'What is X% of Y?', value: 'of' },
          { label: 'X is what percent of Y?', value: 'is' },
          { label: 'Percentage change from X to Y', value: 'change' }
        ]
      },
      {
        id: 'pct-x',
        label: 'Value X',
        type: 'number',
        defaultValue: 20,
        required: true
      },
      {
        id: 'pct-y',
        label: 'Value Y',
        type: 'number',
        defaultValue: 150,
        required: true
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Calculated Result',
        primary: true,
        format: 'number',
        decimals: 2
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>Percentage Calculation Result: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'simple-calculator',
    version: '1.1.0',
    name: 'Simple Calculator',
    category: 'math',
    desc: 'Perform basic math operations including addition, subtraction, multiplication, and division.',
    formulaType: 'function',
    inputs: [
      {
        id: 'expression',
        type: 'hidden',
        defaultValue: '0'
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Result Outcome',
        primary: true,
        format: 'number',
        decimals: 6
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The standard arithmetic evaluation result is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'scientific-calculator',
    version: '1.1.0',
    name: 'Scientific Calculator',
    category: 'math',
    desc: 'Advanced scientific calculator supporting trigonometry, exponents, and logs.',
    formulaType: 'function',
    inputs: [
      {
        id: 'expression',
        type: 'hidden',
        defaultValue: '0'
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Scientific Outcome',
        primary: true,
        format: 'number',
        decimals: 6
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>Scientific equation evaluation result: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'fraction-calculator',
    version: '1.0.0',
    name: 'Fraction Calculator',
    category: 'math',
    desc: 'Add, subtract, multiply, and divide fractions.',
    formulaType: 'function',
    inputs: [
      {
        id: 'frac-op',
        label: 'Operation',
        type: 'dropdown',
        defaultValue: '+',
        required: true,
        options: [
          { label: 'Add (+)', value: '+' },
          { label: 'Subtract (-)', value: '-' },
          { label: 'Multiply (*)', value: '*' },
          { label: 'Divide (/)', value: '/' }
        ]
      },
      { id: 'frac-n1', label: 'Numerator 1 (Top)', type: 'number', defaultValue: 1, required: true },
      { id: 'frac-d1', label: 'Denominator 1 (Bottom)', type: 'number', defaultValue: 2, required: true },
      { id: 'frac-n2', label: 'Numerator 2 (Top)', type: 'number', defaultValue: 1, required: true },
      { id: 'frac-d2', label: 'Denominator 2 (Bottom)', type: 'number', defaultValue: 3, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Simplified Fraction', primary: true, format: 'string' },
      { id: 'decimal', label: 'Decimal Equivalent', format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The fraction operation result is: <strong>{result}</strong></p>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary);">Decimal value: <strong>{decimal}</strong></p>
      </div>
    `
  },
  {
    id: 'matrix-calculator',
    version: '1.0.0',
    name: 'Matrix Calculator',
    category: 'math',
    desc: 'Compute sum, difference, product, determinant, or transpose of 2x2 matrices.',
    formulaType: 'function',
    inputs: [
      {
        id: 'matrix-op',
        label: 'Operation',
        type: 'dropdown',
        defaultValue: 'add',
        required: true,
        options: [
          { label: 'Add A + B', value: 'add' },
          { label: 'Subtract A - B', value: 'subtract' },
          { label: 'Multiply A * B', value: 'multiply' },
          { label: 'Determinant of A', value: 'det' },
          { label: 'Transpose of A', value: 'transpose' }
        ]
      },
      { id: 'a11', label: 'Matrix A [1,1]', type: 'number', defaultValue: 1, required: true },
      { id: 'a12', label: 'Matrix A [1,2]', type: 'number', defaultValue: 2, required: true },
      { id: 'a21', label: 'Matrix A [2,1]', type: 'number', defaultValue: 3, required: true },
      { id: 'a22', label: 'Matrix A [2,2]', type: 'number', defaultValue: 4, required: true },
      { id: 'b11', label: 'Matrix B [1,1]', type: 'number', defaultValue: 5, required: true },
      { id: 'b12', label: 'Matrix B [1,2]', type: 'number', defaultValue: 6, required: true },
      { id: 'b21', label: 'Matrix B [2,1]', type: 'number', defaultValue: 7, required: true },
      { id: 'b22', label: 'Matrix B [2,2]', type: 'number', defaultValue: 8, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Calculation Result', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>Resulting matrix or value:</p>
        <pre style="background: var(--color-bg-base); padding: 0.75rem; border-radius: var(--radius-sm); font-family: monospace;">{result}</pre>
      </div>
    `
  },
  {
    id: 'percentage-difference-calculator',
    version: '1.0.0',
    name: 'Percentage Difference Calculator',
    category: 'math',
    desc: 'Calculate the percentage difference between two positive numbers.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Value A', type: 'number', defaultValue: 10, required: true },
      { id: 'val_b', label: 'Value B', type: 'number', defaultValue: 15, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Percentage Difference', primary: true, format: 'percentage', decimals: 2 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The percentage difference between the two values is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'percentage-increase-calculator',
    version: '1.0.0',
    name: 'Percentage Increase Calculator',
    category: 'math',
    desc: 'Calculate the percentage increase from one value to another.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Initial Value', type: 'number', defaultValue: 10, required: true },
      { id: 'val_b', label: 'New Value', type: 'number', defaultValue: 15, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Percentage Increase', primary: true, format: 'percentage', decimals: 2 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The initial value increased by <strong>{result}</strong> to become the new value.</p>
      </div>
    `
  },
  {
    id: 'percentage-decrease-calculator',
    version: '1.0.0',
    name: 'Percentage Decrease Calculator',
    category: 'math',
    desc: 'Calculate the percentage decrease from one value to another.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Initial Value', type: 'number', defaultValue: 15, required: true },
      { id: 'val_b', label: 'New Value', type: 'number', defaultValue: 10, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Percentage Decrease', primary: true, format: 'percentage', decimals: 2 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The initial value decreased by <strong>{result}</strong> to become the new value.</p>
      </div>
    `
  },
  {
    id: 'algebra-calculator',
    version: '1.0.0',
    name: 'Algebra Calculator',
    category: 'math',
    desc: 'Evaluate algebraic expressions containing variable x.',
    formulaType: 'function',
    inputs: [
      { id: 'expression', label: 'Algebraic Expression', type: 'text', defaultValue: '3 * x^2 + 5 * x - 2', required: true },
      { id: 'x-val', label: 'Value of x', type: 'number', defaultValue: 2, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Evaluated Result', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The expression evaluated at x = {x-val} is: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'quadratic-equation-solver',
    version: '1.0.0',
    name: 'Quadratic Equation Solver',
    category: 'math',
    desc: 'Find the real and complex roots of a quadratic equation ax^2 + bx + c = 0.',
    formulaType: 'function',
    inputs: [
      { id: 'eq-a', label: 'Coefficient a', type: 'number', defaultValue: 1, required: true },
      { id: 'eq-b', label: 'Coefficient b', type: 'number', defaultValue: -5, required: true },
      { id: 'eq-c', label: 'Coefficient c', type: 'number', defaultValue: 6, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Roots (Solutions)', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The solutions for the quadratic equation are: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'gcd-calculator',
    version: '1.0.0',
    name: 'GCD Calculator',
    category: 'math',
    desc: 'Calculate the Greatest Common Divisor (GCD) of two numbers.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Number A', type: 'number', defaultValue: 12, required: true },
      { id: 'val_b', label: 'Number B', type: 'number', defaultValue: 8, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Greatest Common Divisor', primary: true, format: 'number', decimals: 0 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The Greatest Common Divisor is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'lcm-calculator',
    version: '1.0.0',
    name: 'LCM Calculator',
    category: 'math',
    desc: 'Calculate the Least Common Multiple (LCM) of two numbers.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Number A', type: 'number', defaultValue: 12, required: true },
      { id: 'val_b', label: 'Number B', type: 'number', defaultValue: 8, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Least Common Multiple', primary: true, format: 'number', decimals: 0 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The Least Common Multiple is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'factorial-calculator',
    version: '1.0.0',
    name: 'Factorial Calculator',
    category: 'math',
    desc: 'Calculate the factorial of a positive integer (n!).',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Integer n', type: 'number', defaultValue: 5, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Factorial (n!)', primary: true, format: 'number', decimals: 0 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The factorial value is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'logarithm-calculator',
    version: '1.0.0',
    name: 'Logarithm Calculator',
    category: 'math',
    desc: 'Calculate the logarithm of a number to base 10, e, 2, or custom base.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Value (x)', type: 'number', defaultValue: 100, required: true },
      { id: 'log-base', label: 'Log Base', type: 'dropdown', defaultValue: '10', required: true, options: [
        { label: 'Common Log (Base 10)', value: '10' },
        { label: 'Natural Log (Base e)', value: 'e' },
        { label: 'Binary Log (Base 2)', value: '2' },
        { label: 'Custom Base', value: 'custom' }
      ]},
      { id: 'custom-base', label: 'Custom Base Value', type: 'number', defaultValue: 10 }
    ],
    outputs: [
      { id: 'result', label: 'Logarithm Value', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The calculated logarithm is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'antilogarithm-calculator',
    version: '1.0.0',
    name: 'Antilogarithm Calculator',
    category: 'math',
    desc: 'Calculate the inverse logarithm (antilog) of a number.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Value (x)', type: 'number', defaultValue: 2, required: true },
      { id: 'log-base', label: 'Log Base', type: 'dropdown', defaultValue: '10', required: true, options: [
        { label: 'Base 10', value: '10' },
        { label: 'Base e', value: 'e' },
        { label: 'Base 2', value: '2' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'Antilogarithm Value', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The calculated antilogarithm is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'binary-converter',
    version: '1.0.0',
    name: 'Binary Converter',
    category: 'math',
    desc: 'Convert numbers between decimal and binary representations.',
    formulaType: 'function',
    inputs: [
      { id: 'num-val', label: 'Input Value', type: 'text', defaultValue: '10', required: true },
      { id: 'conv-dir', label: 'Conversion Direction', type: 'dropdown', defaultValue: 'dec-to-bin', required: true, options: [
        { label: 'Decimal to Binary', value: 'dec-to-bin' },
        { label: 'Binary to Decimal', value: 'bin-to-dec' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'Converted Value', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The conversion result is: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'hex-converter',
    version: '1.0.0',
    name: 'Hex Converter',
    category: 'math',
    desc: 'Convert numbers between decimal and hexadecimal representations.',
    formulaType: 'function',
    inputs: [
      { id: 'num-val', label: 'Input Value', type: 'text', defaultValue: '255', required: true },
      { id: 'conv-dir', label: 'Conversion Direction', type: 'dropdown', defaultValue: 'dec-to-hex', required: true, options: [
        { label: 'Decimal to Hexadecimal', value: 'dec-to-hex' },
        { label: 'Hexadecimal to Decimal', value: 'hex-to-dec' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'Converted Value', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The conversion result is: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'modulo-calculator',
    version: '1.0.0',
    name: 'Modulo Calculator',
    category: 'math',
    desc: 'Calculate the remainder of a division operation (a mod b).',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Dividend (a)', type: 'number', defaultValue: 10, required: true },
      { id: 'val_b', label: 'Divisor (b)', type: 'number', defaultValue: 3, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Remainder (Modulo)', primary: true, format: 'number', decimals: 0 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The modulo remainder is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'base-converter',
    version: '1.0.0',
    name: 'Base Converter',
    category: 'math',
    desc: 'Convert numbers from any base (2 to 36) to any other base.',
    formulaType: 'function',
    inputs: [
      { id: 'num-val', label: 'Input Value', type: 'text', defaultValue: '1010', required: true },
      { id: 'from-base', label: 'From Base (2-36)', type: 'number', defaultValue: 2, required: true, min: 2, max: 36 },
      { id: 'to-base', label: 'To Base (2-36)', type: 'number', defaultValue: 10, required: true, min: 2, max: 36 }
    ],
    outputs: [
      { id: 'result', label: 'Converted Value', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The converted value in base {to-base} is: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'fibonacci-calculator',
    version: '1.0.0',
    name: 'Fibonacci Calculator',
    category: 'math',
    desc: 'Generate the n-th Fibonacci number and list terms in the sequence.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Integer n (Index)', type: 'number', defaultValue: 10, required: true }
    ],
    outputs: [
      { id: 'result', label: 'n-th Fibonacci Number', primary: true, format: 'number', decimals: 0 },
      { id: 'sequence', label: 'Sequence Preview', format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The {val_a}-th Fibonacci number is <strong>{result}</strong>.</p>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary); white-space: nowrap; overflow-x: auto;">Sequence: <strong>{sequence}</strong></p>
      </div>
    `
  },
  {
    id: 'trigonometry-calculator',
    version: '1.0.0',
    name: 'Trigonometry Calculator',
    category: 'math',
    desc: 'Calculate sine, cosine, tangent, and their reciprocal functions.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Angle Value', type: 'number', defaultValue: 45, required: true },
      { id: 'trig-func', label: 'Function', type: 'dropdown', defaultValue: 'sin', required: true, options: [
        { label: 'Sine (sin)', value: 'sin' },
        { label: 'Cosine (cos)', value: 'cos' },
        { label: 'Tangent (tan)', value: 'tan' },
        { label: 'Cosecant (csc)', value: 'csc' },
        { label: 'Secant (sec)', value: 'sec' },
        { label: 'Cotangent (cot)', value: 'cot' }
      ]},
      { id: 'angle-unit', label: 'Angle Unit', type: 'dropdown', defaultValue: 'degrees', required: true, options: [
        { label: 'Degrees', value: 'degrees' },
        { label: 'Radians', value: 'radians' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'Calculated Value', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The trigonometric result is: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'sine-calculator',
    version: '1.0.0',
    name: 'Sine Calculator',
    category: 'math',
    desc: 'Calculate the sine (sin) of a given angle.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Angle Value', type: 'number', defaultValue: 30, required: true },
      { id: 'angle-unit', label: 'Angle Unit', type: 'dropdown', defaultValue: 'degrees', required: true, options: [
        { label: 'Degrees', value: 'degrees' },
        { label: 'Radians', value: 'radians' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'sin(x)', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>sin({val_a} {angle-unit}) = <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'cosine-calculator',
    version: '1.0.0',
    name: 'Cosine Calculator',
    category: 'math',
    desc: 'Calculate the cosine (cos) of a given angle.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Angle Value', type: 'number', defaultValue: 60, required: true },
      { id: 'angle-unit', label: 'Angle Unit', type: 'dropdown', defaultValue: 'degrees', required: true, options: [
        { label: 'Degrees', value: 'degrees' },
        { label: 'Radians', value: 'radians' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'cos(x)', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>cos({val_a} {angle-unit}) = <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'tangent-calculator',
    version: '1.0.0',
    name: 'Tangent Calculator',
    category: 'math',
    desc: 'Calculate the tangent (tan) of a given angle.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Angle Value', type: 'number', defaultValue: 45, required: true },
      { id: 'angle-unit', label: 'Angle Unit', type: 'dropdown', defaultValue: 'degrees', required: true, options: [
        { label: 'Degrees', value: 'degrees' },
        { label: 'Radians', value: 'radians' }
      ]}
    ],
    outputs: [
      { id: 'result', label: 'tan(x)', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>tan({val_a} {angle-unit}) = <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'division-calculator',
    version: '1.0.0',
    name: 'Division Calculator',
    category: 'math',
    desc: 'Perform division of two numbers (a / b) and find quotient and remainder.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Dividend (a)', type: 'number', defaultValue: 10, required: true },
      { id: 'val_b', label: 'Divisor (b)', type: 'number', defaultValue: 3, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Quotient (Decimal)', primary: true, format: 'number', decimals: 4 },
      { id: 'integer-quotient', label: 'Integer Quotient', format: 'number', decimals: 0 },
      { id: 'remainder', label: 'Remainder', format: 'number', decimals: 0 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The result of {val_a} / {val_b} is:</p>
        <p>Decimal: <strong>{result}</strong></p>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary);">Quotient: <strong>{integer-quotient}</strong>, Remainder: <strong>{remainder}</strong></p>
      </div>
    `
  },
  {
    id: 'exponent-calculator',
    version: '1.0.0',
    name: 'Exponent Calculator',
    category: 'math',
    desc: 'Calculate a number raised to the power of an exponent (a^b).',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Base (a)', type: 'number', defaultValue: 2, required: true },
      { id: 'val_b', label: 'Exponent (b)', type: 'number', defaultValue: 3, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Result (a^b)', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>{val_a} raised to the power of {val_b} is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'square-root-calculator',
    version: '1.0.0',
    name: 'Square Root Calculator',
    category: 'math',
    desc: 'Calculate the square root of a non-negative number.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Number', type: 'number', defaultValue: 16, required: true, min: 0 }
    ],
    outputs: [
      { id: 'result', label: 'Square Root', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The square root of {val_a} is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'cube-root-calculator',
    version: '1.0.0',
    name: 'Cube Root Calculator',
    category: 'math',
    desc: 'Calculate the cube root of any real number.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Number', type: 'number', defaultValue: 27, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Cube Root', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The cube root of {val_a} is <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'pi-calculator',
    version: '1.0.0',
    name: 'Pi Calculator',
    category: 'math',
    desc: 'Generate digits of the mathematical constant Pi (π).',
    formulaType: 'function',
    inputs: [
      { id: 'digits', label: 'Number of decimal digits', type: 'number', defaultValue: 100, required: true, min: 1, max: 1000 }
    ],
    outputs: [
      { id: 'result', label: 'Value of Pi', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p style="word-break: break-all;">Pi to {digits} decimal places is:<br><strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'prime-number-checker',
    version: '1.0.0',
    name: 'Prime Number Checker',
    category: 'math',
    desc: 'Check if a number is prime or composite.',
    formulaType: 'function',
    inputs: [
      { id: 'val_a', label: 'Number to check', type: 'number', defaultValue: 17, required: true, min: 1 }
    ],
    outputs: [
      { id: 'result', label: 'Classification', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The number {val_a} is: <strong>{result}</strong></p>
      </div>
    `
  },
  {
    id: 'fraction-to-decimal',
    version: '1.0.0',
    name: 'Fraction to Decimal Calculator',
    category: 'math',
    desc: 'Convert any fraction to its decimal equivalent.',
    formulaType: 'function',
    inputs: [
      { id: 'frac-n', label: 'Numerator', type: 'number', defaultValue: 3, required: true },
      { id: 'frac-d', label: 'Denominator', type: 'number', defaultValue: 4, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Decimal Value', primary: true, format: 'number', decimals: 4 }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The fraction {frac-n} / {frac-d} is equal to <strong>{result}</strong>.</p>
      </div>
    `
  },
  {
    id: 'decimal-to-fraction',
    version: '1.0.0',
    name: 'Decimal to Fraction Calculator',
    category: 'math',
    desc: 'Convert any decimal value to a simplified fraction.',
    formulaType: 'function',
    inputs: [
      { id: 'dec-val', label: 'Decimal Value', type: 'number', defaultValue: 0.75, required: true }
    ],
    outputs: [
      { id: 'result', label: 'Simplified Fraction', primary: true, format: 'string' }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The decimal value {dec-val} is equal to <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default mathRegistry;
