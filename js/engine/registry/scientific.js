/**
 * Scientific category registry configurations
 */
export const scientificRegistry = [
  {
    id: 'scientific-calculator',
    version: '1.0.0',
    name: 'Scientific Calculator',
    category: 'scientific',
    desc: 'Advanced scientific operations.',
    formulaType: 'fdl',
    formula: 'val_a + val_b',
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
        label: 'Output Value',
        primary: true,
        format: 'number',
        decimals: 2
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The output value is <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default scientificRegistry;
