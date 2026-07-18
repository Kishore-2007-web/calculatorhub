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
  }
];

export default mathRegistry;
