/**
 * Universal Calculator Engine - Main Bootstrap Module
 * Handles service container registration, dynamic lifecycle management,
 * cache lookups, and developer mode telemetry.
 */
import { container } from './container.js';
import { eventBus } from './event-bus.js';
import { loadConfig } from './registry-loader.js';
import { UceCalculator } from './calculator.js';
import { runPipeline } from './pipeline.js';

// Import services for DI registration
import { uceValidator } from '../validation/index.js';
import { uceFormatter } from '../formatting/index.js';
import { uceConverter } from '../conversion/index.js';
import { uceCache } from '../cache/index.js';
import { uceHistory } from '../history/index.js';
import { uceRenderer } from './renderer.js';
import { uceExplanationGenerator } from '../explanation/index.js';
import { Components } from '../components/index.js';
import { uceFormulaEngine } from '../formulas/index.js';

export class UceEngine {
  constructor() {
    this.calculator = null;
    this.form = null;
    this.inputsContainer = null;
    this.resultsContainer = null;
    this.explanationContainer = null;
    this.alertContainer = null;
  }

  /**
   * Register core services in the DI Container
   */
  registerServices() {
    container.register('Validator', uceValidator);
    container.register('Formatter', uceFormatter);
    container.register('Converter', uceConverter);
    container.register('Cache', uceCache);
    container.register('History', uceHistory);
    container.register('Renderer', uceRenderer);
    container.register('ExplanationGenerator', uceExplanationGenerator);
    container.register('Components', Components);
    container.register('FormulaEngine', uceFormulaEngine);
  }

  /**
   * Initialize the UCE on page load
   */
  async init() {
    this.registerServices();

    // Bind event bus logs
    eventBus.on('*', ({ eventName, data }) => {
      console.log(`[EventBus] Event: ${eventName}`, data);
    });

    const calcId = window.CURRENT_CALCULATOR_ID;
    const categoryId = window.CURRENT_CALCULATOR_CATEGORY;

    if (!calcId || !categoryId) {
      console.warn('[UCE Engine] Missing CURRENT_CALCULATOR_ID or CURRENT_CALCULATOR_CATEGORY on page. Skipping dynamic init.');
      return;
    }

    // Resolve target container elements in DOM
    this.form = document.getElementById('calculator-form');
    this.inputsContainer = document.getElementById('dynamic-inputs-container');
    this.resultsContainer = document.getElementById('dynamic-outputs-container') || document.getElementById('calculator-results');
    this.explanationContainer = document.getElementById('dynamic-explanation-container');
    this.alertContainer = document.getElementById('calculator-alert');

    if (!this.form || !this.inputsContainer) {
      console.warn('[UCE Engine] Form or dynamic inputs container not found in DOM.');
      return;
    }

    try {
      // 1. DYNAMIC CONFIG LOAD
      const rawConfig = await loadConfig(calcId, categoryId);
      this.calculator = new UceCalculator(rawConfig);
      
      eventBus.emit('CalculatorLoaded', this.calculator);

      // 2. RENDER DYNAMIC FORM
      const renderer = container.get('Renderer');
      renderer.renderForm(this.inputsContainer, this.calculator.inputs, () => {
        eventBus.emit('InputChanged', { calculatorId: this.calculator.id });
      }, this.calculator);

      // 3. WARM UP CACHE WITH DEFAULT INPUTS OR URL QUERY PARAMETERS
      const historyManager = container.get('History');
      const sharedInputs = historyManager.parseShareLink();
      const defaultInputs = this.calculator.getDefaultInputs();

      // Merge defaults with url parameters
      const initialInputs = { ...defaultInputs, ...sharedInputs };
      this.populateFormFields(initialInputs);

      // Bind dynamic form submit handler
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.calculate();
      });

      // If URL parameters exist, trigger calculation immediately on load
      if (Object.keys(sharedInputs).length > 0) {
        this.calculate();
      }

      // Hook global resets
      const resetBtn = document.getElementById('reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.form.reset();
          renderer.renderError(this.alertContainer, null);
          renderer.renderExplanation(this.explanationContainer, null);
          this.populateFormFields(defaultInputs);
          
          // Reset slider labels
          this.calculator.inputs.forEach(input => {
            if (input.type === 'slider' || input.type === 'range') {
              const display = document.getElementById(`${input.id}-val`);
              if (display) display.innerText = input.defaultValue || 0;
            }
          });
        });
      }

    } catch (err) {
      console.error('[UCE Engine] Bootstrap failed:', err);
    }
  }

  /**
   * Gather form variables from DOM inputs
   */
  gatherInputs() {
    const inputs = {};

    // Check if pocket calculator style is running
    if (this.calculator.id === 'simple-calculator' || this.calculator.id === 'scientific-calculator') {
      const calcCurrent = document.querySelector('.calc-current');
      inputs.expression = calcCurrent ? calcCurrent.getAttribute('data-expression') || '0' : '0';
      return inputs;
    }

    this.calculator.inputs.forEach(input => {
      const el = document.getElementById(input.id);
      if (!el) {
        // Look for radio buttons group
        if (input.type === 'radio') {
          const selected = this.form.querySelector(`input[name="${input.id}"]:checked`);
          inputs[input.id] = selected ? selected.value : '';
        } else if (input.type === 'checkbox') {
          inputs[input.id] = false;
        }
        return;
      }

      if (el.type === 'checkbox') {
        inputs[input.id] = el.checked;
      } else {
        inputs[input.id] = el.value;
      }
    });
    return inputs;
  }

  /**
   * Write input values back into DOM form fields
   */
  populateFormFields(inputsMap) {
    Object.entries(inputsMap).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (!el) {
        // Try radio button
        const radio = this.form.querySelector(`input[name="${id}"][value="${val}"]`);
        if (radio) radio.checked = true;
        return;
      }

      if (el.type === 'checkbox') {
        el.checked = val === 'true' || val === true;
      } else {
        el.value = val;
      }

      // Update range slider counter label
      const rangeVal = document.getElementById(`${id}-val`);
      if (rangeVal) rangeVal.innerText = val;
    });
  }

  /**
   * Run the calculation pipeline, handling cache hits and dev overlay statistics
   */
  async calculate() {
    const rawInputs = this.gatherInputs();
    const renderer = container.get('Renderer');
    const cache = container.get('Cache');
    const history = container.get('History');

    renderer.renderError(this.alertContainer, null);
    renderer.renderLoading(this.resultsContainer, true);

    // 1. CHECK TIERED CACHE BEFORE COMPUTATION
    const cachedResult = cache.get(this.calculator, rawInputs);
    if (cachedResult) {
      eventBus.emit('CacheHit', { calculatorId: this.calculator.id, inputs: rawInputs });
      
      // Render output directly
      renderer.renderResults(this.resultsContainer, cachedResult, this.calculator);
      renderer.renderExplanation(this.explanationContainer, cachedResult.explanation);

      // Render Dev Overlay if enabled
      if (localStorage.getItem('uce_dev') === 'true') {
        renderer.renderDevPanel(document.getElementById('calculator-alert'), {
          calculatorId: this.calculator.id,
          version: this.calculator.version,
          formulaType: this.calculator.formulaType,
          calcTimeMs: 0,
          cacheHit: true,
          cacheKey: cache.getCacheKey(this.calculator.id, rawInputs),
          validationPassed: true,
          steps: ['Cache lookup', 'Format views rendered'],
          timestamp: new Date().toLocaleTimeString()
        });
      }
      return;
    }

    eventBus.emit('CacheMiss', { calculatorId: this.calculator.id, inputs: rawInputs });

    // 2. RUN PIPELINE
    const output = await runPipeline(this.calculator, rawInputs);

    if (output.status === 'error') {
      renderer.renderResults(this.resultsContainer, `
        <div style="text-align: center; padding: 2rem 0; color: var(--color-text-secondary);">
          Validation Failed.
        </div>
      `, this.calculator);
      renderer.renderError(this.alertContainer, output.message);
      return;
    }

    // 3. STORE IN CACHE
    cache.set(this.calculator, rawInputs, output, 'session');

    // 4. LOG TO OPTIONAL HISTORY
    history.save(this.calculator.id, rawInputs, output);

    // 5. UPDATE DOM VIEWS
    renderer.renderResults(this.resultsContainer, output, this.calculator);
    renderer.renderExplanation(this.explanationContainer, output.explanation);

    // 6. RENDER DEV OVERLAY (If LocalStorage 'uce_dev' is active)
    if (localStorage.getItem('uce_dev') === 'true') {
      renderer.renderDevPanel(this.alertContainer, {
        calculatorId: this.calculator.id,
        version: this.calculator.version,
        formulaType: this.calculator.formulaType,
        calcTimeMs: output.calcTimeMs,
        cacheHit: false,
        cacheKey: cache.getCacheKey(this.calculator.id, rawInputs),
        validationPassed: true,
        steps: output.steps,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }
}

export const uceEngine = new UceEngine();
export default uceEngine;
