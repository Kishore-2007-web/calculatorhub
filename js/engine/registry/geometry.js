/**
 * Geometry category registry configurations
 */
export const geometryRegistry = [
  {
    id: 'geometry-calculator',
    version: '1.0.0',
    name: 'Geometry Calculator',
    category: 'geometry',
    desc: 'Calculate geometric properties of rectangles, circles, triangles, spheres, and cylinders.',
    formulaType: 'function',
    inputs: [
      {
        id: 'geom-shape',
        label: 'Shape',
        type: 'dropdown',
        defaultValue: 'rectangle',
        required: true,
        options: [
          { label: 'Rectangle', value: 'rectangle' },
          { label: 'Circle', value: 'circle' },
          { label: 'Triangle', value: 'triangle' },
          { label: 'Sphere', value: 'sphere' },
          { label: 'Cylinder', value: 'cylinder' }
        ]
      },
      {
        id: 'val_a',
        label: 'Width / Radius / Base',
        type: 'number',
        defaultValue: 10,
        required: true
      },
      {
        id: 'val_b',
        label: 'Height / Length (Optional)',
        type: 'number',
        defaultValue: 5
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Calculated Value',
        primary: true,
        format: 'number',
        decimals: 4
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The calculated outcome for {geom-shape} is <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default geometryRegistry;
