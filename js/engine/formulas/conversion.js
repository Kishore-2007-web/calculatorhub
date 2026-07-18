/**
 * Conversion category formulas
 */
export const conversionFormulas = {
  'length-converter'(inputs) {
    const val = inputs['conv-value'] !== undefined ? inputs['conv-value'] : 10;
    return val;
  }
};
export default conversionFormulas;
