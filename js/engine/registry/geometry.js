/**
 * Geometry category registry configurations
 */
export const geometryRegistry = [
  {
    id: 'geometry-calculator',
    version: '1.0.0',
    name: 'Geometry Calculator',
    category: 'geometry',
    desc: 'Calculate geometric properties of rectangles.',
    formulaType: 'fdl',
    formula: 'val_a * val_b',
    inputs: [
      {
        id: 'val_a',
        label: 'Width',
        type: 'number',
        defaultValue: 10,
        required: true
      },
      {
        id: 'val_b',
        label: 'Height',
        type: 'number',
        defaultValue: 5,
        required: true
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Calculated Area',
        primary: true,
        format: 'number',
        decimals: 2
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The rectangle area is <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default geometryRegistry;
