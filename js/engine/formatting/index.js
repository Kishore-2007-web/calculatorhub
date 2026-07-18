/**
 * Universal Calculator Engine - Precision & Formatting Engine
 * Handles numeric precision, scientific notation, currencies, and percentages.
 */
import { Utils } from '../utils/index.js';

export class UceFormatter {
  /**
   * Format calculated result(s) according to formatting parameters
   * @param {Object} calculator UceCalculator config
   * @param {any} rawResult Numeric value or key-value dictionary of numeric values
   * @returns {string|Object} Formatted outputs
   */
  format(calculator, rawResult) {
    const outputsConfig = calculator.outputs || [];
    const formatterConfig = calculator.formatter || {};
    const defaultDecimals = formatterConfig.decimals !== undefined ? formatterConfig.decimals : 2;

    // Handle multiple key-value structured outputs
    if (rawResult && typeof rawResult === 'object') {
      const formatted = {};
      Object.entries(rawResult).forEach(([key, val]) => {
        const outputField = outputsConfig.find(o => o.id === key) || {};
        const decimals = outputField.decimals !== undefined ? outputField.decimals : defaultDecimals;
        const formatType = outputField.format || formatterConfig.format;
        const unit = outputField.unit || calculator.units?.default;

        formatted[key] = this.formatSingleValue(val, formatType, decimals, unit);
      });
      return formatted;
    }

    // Handle single output value
    const primaryOutput = outputsConfig[0] || {};
    const decimals = primaryOutput.decimals !== undefined ? primaryOutput.decimals : defaultDecimals;
    const formatType = primaryOutput.format || formatterConfig.format;
    const unit = primaryOutput.unit || calculator.units?.default;

    return this.formatSingleValue(rawResult, formatType, decimals, unit);
  }

  /**
   * Format a single numeric value based on its format settings
   */
  formatSingleValue(value, formatType, decimals, unit) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    if (typeof value !== 'number') {
      return value.toString();
    }

    const num = Utils.parseFloat(value);

    // Dynamic fallback to scientific notation for extremely large or micro decimal numbers
    if (formatType === 'scientific' || Math.abs(num) > 1e12 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(decimals);
    }

    let formattedResult = '';

    if (formatType === 'currency') {
      // Localized Currency Formatting
      const currencyCode = unit || 'USD';
      formattedResult = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
      }).format(num);
    } else if (formatType === 'percentage' || formatType === 'percent') {
      // Localized Percentage Formatting
      formattedResult = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
      }).format(num) + '%';
    } else {
      // Standard Numeric Formatting
      formattedResult = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
      }).format(num);

      if (unit && unit !== 'none') {
        formattedResult += ` ${unit}`;
      }
    }

    return formattedResult;
  }
}

export const uceFormatter = new UceFormatter();
export default uceFormatter;
