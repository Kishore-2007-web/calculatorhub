/**
 * Geometry category formulas
 */
export const geometryFormulas = {
  'geometry-calculator'(inputs) {
    const shape = inputs['geom-shape'] || 'rectangle';
    const a = Number(inputs['val_a'] !== undefined ? inputs['val_a'] : 10);
    const b = Number(inputs['val_b'] !== undefined ? inputs['val_b'] : 5);

    switch (shape) {
      case 'rectangle':
        return a * b;
      case 'circle':
        return Math.PI * a * a;
      case 'triangle':
        return 0.5 * a * b;
      case 'sphere':
        return (4 / 3) * Math.PI * Math.pow(a, 3);
      case 'cylinder':
        return Math.PI * a * a * b;
      default:
        return 0;
    }
  }
};
export default geometryFormulas;
