/**
 * UCE Pipeline Coordinator
 * Executes sequentially: validation, normalization, pre-calculate hooks, formulas,
 * post-calculate hooks, precision rounding, formatting, and explanation building.
 */
import { container } from './container.js';
import { eventBus } from './event-bus.js';
import { hooks } from './hooks.js';

export async function runPipeline(calculator, rawInputs) {
  const startTime = performance.now();
  const steps = [];
  const statusObj = {
    status: 'success',
    calculatorId: calculator.id,
    version: calculator.version,
    inputs: { ...rawInputs },
    rawResult: null,
    formattedResult: null,
    unit: calculator.units ? calculator.units.default : '',
    steps: steps,
    warnings: [],
    suggestions: [],
    explanation: '',
    timestamp: Date.now(),
    calcTimeMs: 0
  };

  try {
    // Publish pipeline launch event
    eventBus.emit('CalculationStarted', { calculatorId: calculator.id, inputs: rawInputs });

    // 1. INPUT VALIDATION
    steps.push('Validation Engine');
    const validator = container.get('Validator');
    const validationResult = validator.validate(calculator, rawInputs);
    
    if (!validationResult.valid) {
      eventBus.emit('ValidationFailed', { calculatorId: calculator.id, errors: validationResult.errors });
      return {
        ...statusObj,
        status: 'error',
        message: validationResult.errors.join(' '),
        errors: validationResult.errors,
        calcTimeMs: performance.now() - startTime
      };
    }

    // 2. INPUT NORMALIZATION / CONVERSION
    steps.push('Normalization Engine');
    const converter = container.get('Converter');
    const normalizedInputs = converter.normalizeInputs(calculator, rawInputs);

    // 3. PRE-PROCESSING HOOKS (Plugin hooks)
    steps.push('Pre-processing Hooks');
    const hookedInputs = await hooks.run('beforeCalculate', { calculator, inputs: normalizedInputs });
    const finalInputs = hookedInputs.inputs || hookedInputs;

    // 4. FORMULA ENGINE
    steps.push('Formula Engine');
    const formulaEngine = container.get('FormulaEngine');
    const rawResult = await formulaEngine.execute(calculator, finalInputs);
    statusObj.rawResult = rawResult;

    // 5. POST-PROCESSING HOOKS (Plugin hooks)
    steps.push('Post-processing Hooks');
    const hookedResult = await hooks.run('afterCalculate', { calculator, result: rawResult });
    const finalResult = hookedResult.result !== undefined ? hookedResult.result : hookedResult;

    // 6. PRECISION & FORMATTING ENGINES
    steps.push('Precision & Formatting Engine');
    const formatter = container.get('Formatter');
    const formattedResult = formatter.format(calculator, finalResult);
    statusObj.formattedResult = formattedResult;

    // 7. EXPLANATION GENERATOR
    steps.push('Explanation Engine');
    const explanationGen = container.get('ExplanationGenerator');
    const explanationHtml = explanationGen.generate(calculator, rawInputs, finalResult, formattedResult);
    statusObj.explanation = explanationHtml;

    // Finish pipeline stats
    statusObj.calcTimeMs = performance.now() - startTime;
    
    // Check interpretation brackets to populate warnings/suggestions if present
    if (calculator.interpretation) {
      const interpreter = container.get('ExplanationGenerator');
      const interpreted = interpreter.interpret(calculator, finalResult);
      statusObj.warnings = interpreted.warnings || [];
      statusObj.suggestions = interpreted.suggestions || [];
    }

    eventBus.emit('ResultGenerated', statusObj);
    eventBus.emit('CalculationFinished', statusObj);
    
    return statusObj;
  } catch (err) {
    console.error(`[UcePipeline] Error calculating for ${calculator.id}:`, err);
    eventBus.emit('CalculationFailed', { calculatorId: calculator.id, error: err.message });
    return {
      ...statusObj,
      status: 'error',
      message: err.message || 'An arithmetic parsing error occurred.',
      calcTimeMs: performance.now() - startTime
    };
  }
}
