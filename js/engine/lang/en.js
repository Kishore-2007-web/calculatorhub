/**
 * English Localization Keys
 */
export const en = {
  // Common UI labels
  calculate: 'Calculate',
  reset: 'Reset',
  results: 'Results',
  parameters: 'Parameters',
  formulaUsed: 'Formula Used',
  steps: 'Calculation Steps',
  interpretation: 'Interpretation',
  warnings: 'Warnings',
  suggestions: 'Suggestions',
  
  // Validation errors
  errRequired: 'The field "{label}" is required.',
  errNumber: 'The field "{label}" must be a valid number.',
  errMin: 'The field "{label}" must be greater than or equal to {min}.',
  errMax: 'The field "{label}" must be less than or equal to {max}.',
  errNegative: 'The field "{label}" cannot be negative.',
  errPrecision: 'The field "{label}" can have at most {precision} decimal places.',
  errDate: 'The field "{label}" must be a valid date.',
  errDateComparison: 'The start date cannot be after the end date.',

  // System errors
  errDivZero: 'Division by zero is mathematically undefined.',
  errGeneric: 'An arithmetic calculation error occurred.',
  errConfig: 'Calculator configuration error.',

  // Interpretations
  bmiUnderweight: 'Underweight',
  bmiNormal: 'Normal Weight',
  bmiOverweight: 'Overweight',
  bmiObese: 'Obese'
};
export default en;
