/**
 * Universal Calculator Engine - Formula Engine Coordinator
 * Executes equations using three strategies:
 * 1. Declarative Formula Definition Language (FDL)
 * 2. Reusable category formulas (e.g. BMI, GST)
 * 3. Advanced Calculation Modules (e.g. Age Calculator, EMI Schedule)
 */
import { FdlCompiler } from '../utils/fdl.js';

export class UceFormulaEngine {
  /**
   * Execute the formula configuration mapping
   * @param {Object} calculator UceCalculator model
   * @param {Object} inputs normalized input variables
   * @returns {Promise<any>} raw output values (number or output dictionary)
   */
  async execute(calculator, inputs) {
    const type = calculator.formulaType || 'fdl';

    // STRATEGY 1: Declarative Formula Definition Language
    if (type === 'fdl') {
      const expression = calculator.formula;
      if (!expression) {
        throw new Error(`FDL mathematical expression not configured for calculator ID: ${calculator.id}`);
      }
      return FdlCompiler.evaluate(expression, inputs);
    }

    // STRATEGY 2 & 3: Reusable Formulas & Advanced Calculation Modules
    // Dynamic import resolves formulas relative to the current module folder (js/engine/formulas/)
    const categoryId = calculator.category;
    try {
      const formulaModule = await import(`./${categoryId}.js`);
      const formulas = formulaModule.default || formulaModule;

      const formulaFn = formulas[calculator.id];
      if (typeof formulaFn !== 'function') {
        throw new Error(`Formula execution script [${calculator.id}] not found in formulas category [${categoryId}].`);
      }

      return formulaFn(inputs);
    } catch (err) {
      console.error(`[FormulaEngine] Error executing calculation module for ${calculator.id}:`, err);
      throw err;
    }
  }
}

export const uceFormulaEngine = new UceFormulaEngine();
export default uceFormulaEngine;
