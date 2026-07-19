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
  }
];

export default mathRegistry;
