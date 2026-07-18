/**
 * Universal Calculator Engine - Explanation Engine
 * Evaluates step-by-step breakdown text templates and output interpretation ranges.
 */
import { Utils } from '../utils/index.js';

export class UceExplanationGenerator {
  /**
   * Interpolate variable placeholders in formula step templates
   * @param {Object} calculator UceCalculator model
   * @param {Object} rawInputs inputs key-value map
   * @param {any} rawResult numeric or object raw outcome
   * @param {any} formattedResult formatted string or object outcome
   * @returns {string} explanation HTML
   */
  generate(calculator, rawInputs, rawResult, formattedResult) {
    const template = calculator.explanation || '';
    if (!template) return '';

    let explanationHtml = template;

    // Combine all inputs and results into a placeholder map
    const vars = {};
    
    // Map inputs
    Object.entries(rawInputs).forEach(([key, val]) => {
      vars[`input_${key}`] = val;
    });

    // Map raw results
    if (rawResult && typeof rawResult === 'object') {
      Object.entries(rawResult).forEach(([key, val]) => {
        vars[`raw_result_${key}`] = typeof val === 'number' ? val.toFixed(4) : val;
      });
    } else {
      vars.raw_result = typeof rawResult === 'number' ? rawResult.toFixed(4) : rawResult;
    }

    // Map formatted results
    if (formattedResult && typeof formattedResult === 'object') {
      Object.entries(formattedResult).forEach(([key, val]) => {
        vars[`result_${key}`] = val;
      });
    } else {
      vars.result = formattedResult;
    }

    // Map calculator metadata
    vars.title = calculator.title;
    vars.formula = calculator.formula || 'Custom Algorithmic Steps';

    // Loop and replace all {variable} tokens
    Object.entries(vars).forEach(([token, value]) => {
      explanationHtml = explanationHtml.replace(new RegExp(`{${token}}`, 'g'), value);
    });

    return explanationHtml;
  }

  /**
   * Evaluate metric outcome ranges and return category, warnings, and tips
   * @param {Object} calculator UceCalculator model
   * @param {number} value numeric result
   * @returns {Object} { category: string, warnings: string[], suggestions: string[] }
   */
  interpret(calculator, value) {
    const brackets = calculator.interpretation || [];
    const val = Utils.parseFloat(value);

    const match = brackets.find(bracket => {
      const min = bracket.min !== undefined ? bracket.min : -Infinity;
      const max = bracket.max !== undefined ? bracket.max : Infinity;
      return val >= min && val < max;
    });

    if (match) {
      return {
        category: match.category || '',
        warnings: match.warnings || [],
        suggestions: match.suggestions || [],
        color: match.color || 'var(--color-primary)'
      };
    }

    return {
      category: '',
      warnings: [],
      suggestions: []
    };
  }
}

export const uceExplanationGenerator = new UceExplanationGenerator();
export default uceExplanationGenerator;
