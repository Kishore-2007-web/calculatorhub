/**
 * Scientific category formulas
 */
export const scientificFormulas = {
  'scientific-calculator'(inputs) {
    const a = inputs['val_a'] !== undefined ? inputs['val_a'] : 10;
    const b = inputs['val_b'] !== undefined ? inputs['val_b'] : 5;
    return a + b;
  }
};
export default scientificFormulas;
