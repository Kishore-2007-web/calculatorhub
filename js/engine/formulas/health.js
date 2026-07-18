/**
 * Health category formulas
 */
export const healthFormulas = {
  /**
   * BMI Calculator formula logic
   * Receives pre-normalized variables: weight (kg) and height (m)
   */
  'bmi-calculator'(inputs) {
    const weight = inputs['bmi-weight']; // Normalized to kg
    const height = inputs['bmi-height']; // Normalized to m

    if (weight <= 0 || height <= 0) {
      throw new Error('Weight and height must be positive values.');
    }

    // BMI = kg / (m^2)
    return weight / (height * height);
  },

  /**
   * BMR Calculator formula logic (Mifflin-St Jeor)
   */
  'bmr-calculator'(inputs) {
    const weight = inputs['bmr-weight'] || inputs['val-principal']; // kg
    const height = inputs['bmr-height'] || inputs['val-rate']; // cm
    const age = inputs['bmr-age'] || inputs['val-term']; // years
    const gender = inputs['bmr-gender'] || 'male';

    if (weight <= 0 || height <= 0 || age <= 0) {
      throw new Error('Inputs must be positive values.');
    }

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    return bmr;
  }
};

export default healthFormulas;
