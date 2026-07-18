/**
 * Geometry category formulas
 */
export const geometryFormulas = {
  'geometry-calculator'(inputs) {
    const a = inputs['val_a'] || 10;
    const b = inputs['val_b'] || 5;
    return a * b;
  }
};
export default geometryFormulas;
