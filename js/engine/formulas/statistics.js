/**
 * Statistics category formulas
 */
export const statisticsFormulas = {
  'standard-deviation-calculator'(inputs) {
    const a = inputs['val_a'] || 10;
    const b = inputs['val_b'] || 5;
    return (a + b) / 2;
  }
};
export default statisticsFormulas;
