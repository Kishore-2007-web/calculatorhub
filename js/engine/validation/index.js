/**
 * Universal Calculator Engine - Validation Layer
 * Runs validation checks against parameters using registered localized rules.
 */
import { translator } from '../lang/index.js';

export class UceValidator {
  /**
   * Validate all form inputs against calculator configuration constraints
   * @param {Object} calculator UceCalculator model
   * @param {Object} rawInputs raw form values map
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate(calculator, rawInputs) {
    const errors = [];
    const inputsConfig = calculator.inputs || [];

    inputsConfig.forEach(input => {
      const value = rawInputs[input.id];
      const label = input.label || input.id;

      // 1. REQUIRED FIELD CHECK
      const isEmpty = value === undefined || value === null || value.toString().trim() === '';
      if (input.required && isEmpty) {
        errors.push(translator.t('errRequired', { label }));
        return; // Skip further checks if empty
      }

      if (isEmpty) return; // Optional field is empty, skip validation

      // 2. NUMBER TYPE VALIDATION
      if (['number', 'decimal', 'currency', 'percentage', 'slider', 'range'].includes(input.type)) {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) {
          errors.push(translator.t('errNumber', { label }));
          return;
        }

        // 3. MIN LIMIT CHECK
        if (input.min !== undefined && numVal < input.min) {
          errors.push(translator.t('errMin', { label, min: input.min }));
        }

        // 4. MAX LIMIT CHECK
        if (input.max !== undefined && numVal > input.max) {
          errors.push(translator.t('errMax', { label, max: input.max }));
        }

        // 5. NEGATIVE RESTRICTIONS CHECK
        const rules = input.validationRules || {};
        if (rules.nonNegative && numVal < 0) {
          errors.push(translator.t('errNegative', { label }));
        }

        // 6. DECIMAL PRECISION CHECK
        if (rules.maxDecimals !== undefined) {
          const parts = value.toString().split('.');
          if (parts.length > 1 && parts[1].length > rules.maxDecimals) {
            errors.push(translator.t('errPrecision', { label, precision: rules.maxDecimals }));
          }
        }
      }

      // 7. DATE VALIDATION
      if (input.type === 'date') {
        const dateVal = new Date(value);
        if (isNaN(dateVal.getTime())) {
          errors.push(translator.t('errDate', { label }));
        }
      }
    });

    // Custom multi-field date range comparison check
    if (calculator.validation && calculator.validation.dateRange) {
      const { startId, endId } = calculator.validation.dateRange;
      const startVal = rawInputs[startId];
      const endVal = rawInputs[endId];
      if (startVal && endVal) {
        const startDate = new Date(startVal);
        const endDate = new Date(endVal);
        if (startDate > endDate) {
          errors.push(translator.t('errDateComparison'));
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const uceValidator = new UceValidator();
export default uceValidator;
