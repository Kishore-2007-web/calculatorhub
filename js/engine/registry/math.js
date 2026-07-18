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
    version: '1.0.0',
    name: 'Simple Calculator',
    category: 'math',
    desc: 'Perform basic math additions.',
    formulaType: 'fdl',
    formula: 'val_a + val_b',
    inputs: [
      {
        id: 'val_a',
        label: 'Input Value A',
        type: 'number',
        defaultValue: 25,
        required: true
      },
      {
        id: 'val_b',
        label: 'Input Value B',
        type: 'number',
        defaultValue: 5,
        required: true
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Calculated Sum',
        primary: true,
        format: 'number',
        decimals: 2
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The sum of <strong>{input_val_a}</strong> and <strong>{input_val_b}</strong> is <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default mathRegistry;
