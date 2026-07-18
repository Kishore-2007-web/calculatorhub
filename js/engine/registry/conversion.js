/**
 * Conversion category registry configurations
 */
export const conversionRegistry = [
  {
    id: 'length-converter',
    version: '1.0.0',
    name: 'Length Converter',
    category: 'conversion',
    desc: 'Convert length dimensions.',
    formulaType: 'function',
    inputs: [
      {
        id: 'conv-value',
        label: 'Value to Convert',
        type: 'number',
        defaultValue: 10,
        required: true
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Converted Value',
        primary: true,
        format: 'number',
        decimals: 2
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The converted value is <strong>{result}</strong>.</p>
      </div>
    `
  }
];

export default conversionRegistry;
