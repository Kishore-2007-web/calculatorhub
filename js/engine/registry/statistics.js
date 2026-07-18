/**
 * Statistics category registry configurations
 */
export const statisticsRegistry = [
  {
    id: 'standard-deviation-calculator',
    version: '1.0.0',
    name: 'Standard Deviation Calculator',
    category: 'statistics',
    desc: 'Calculate basic statistics aggregates.',
    formulaType: 'fdl',
    formula: '(val_a + val_b) / 2',
    inputs: [
      {
        id: 'val_a',
        label: 'Value A',
        type: 'number',
        defaultValue: 10,
        required: true
      },
      {
        id: 'val_b',
        label: 'Value B',
        type: 'number',
        defaultValue: 5,
        required: true
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Average Mean',
        primary: true,
        format: 'number',
        decimals: 2
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The statistical mean average is <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default statisticsRegistry;
