/**
 * Universal Calculator Engine - Rendering Layer
 * Coordinates DOM updates, dynamic components rendering, and theme updates.
 */
import { container } from './container.js';

export class UceRenderer {
  constructor() {
    this.components = null; // Dynamically resolved component factory
  }

  /**
   * Lazily resolve HTML component builders
   */
  getComponents() {
    if (!this.components) {
      try {
        this.components = container.get('Components');
      } catch (err) {
        console.warn('Components not registered in DI container. Falling back to simple renderer.', err);
      }
    }
    return this.components;
  }

  /**
   * Render dynamic input form fields
   */
  renderForm(containerEl, inputs, onChangeCallback) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    const comp = this.getComponents();
    if (!comp) {
      containerEl.innerHTML = `<div class="alert alert-error">Components module not found.</div>`;
      return;
    }

    inputs.forEach(input => {
      let fieldHtml = '';
      switch (input.type) {
        case 'dropdown':
        case 'select':
          fieldHtml = comp.Dropdown(input);
          break;
        case 'checkbox':
          fieldHtml = comp.Checkbox(input);
          break;
        case 'radio':
          fieldHtml = comp.Radio(input);
          break;
        case 'slider':
        case 'range':
          fieldHtml = comp.Slider(input);
          break;
        case 'toggle':
          fieldHtml = comp.Toggle(input);
          break;
        case 'date':
          fieldHtml = comp.DatePicker(input);
          break;
        case 'currency':
          fieldHtml = comp.CurrencyInput(input);
          break;
        case 'percentage':
          fieldHtml = comp.PercentageInput(input);
          break;
        default:
          fieldHtml = comp.NumberInput(input);
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = fieldHtml;
      const child = tempDiv.firstElementChild;
      containerEl.appendChild(child);
    });

    // Attach slider value listener and bubble change events up
    const sliders = containerEl.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
      const displayId = `${slider.id}-val`;
      const displayEl = containerEl.querySelector(`#${displayId}`);
      slider.addEventListener('input', () => {
        if (displayEl) displayEl.innerText = slider.value;
        if (onChangeCallback) onChangeCallback();
      });
    });

    // Attach regular inputs change event listeners
    const fields = containerEl.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      if (field.type !== 'range') {
        field.addEventListener('input', () => {
          if (onChangeCallback) onChangeCallback();
        });
      }
    });
  }

  /**
   * Render outputs / results panel
   */
  renderResults(containerEl, resultsObj, calculatorConfig) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    const comp = this.getComponents();
    if (!comp) return;

    // Render results cards and tables based on the output keys
    let resultsHtml = '';
    
    // Check if the resultsObj has structured keys or just a raw result
    if (typeof resultsObj.formattedResult === 'object') {
      resultsHtml = comp.ResultCard(resultsObj, calculatorConfig);
    } else {
      resultsHtml = `
        <div style="text-align: center; padding: 2rem 0;">
          <div style="font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 600;">CALCULATED RESULT</div>
          <div id="result-val" style="font-size: 3rem; font-weight: 800; color: var(--color-primary); margin-top: 0.5rem;">
            ${resultsObj.formattedResult}
          </div>
          ${resultsObj.unit ? `<p style="font-size: 1.1rem; font-weight: 700; margin-top: 0.5rem;">${resultsObj.unit}</p>` : ''}
        </div>
      `;
    }

    containerEl.innerHTML = resultsHtml;
  }

  /**
   * Render dynamic explanations
   */
  renderExplanation(containerEl, explanationHtml) {
    if (!containerEl) return;
    if (!explanationHtml) {
      containerEl.style.display = 'none';
      return;
    }
    containerEl.style.display = 'block';
    containerEl.innerHTML = explanationHtml;
  }

  /**
   * Render custom validation / formula error notifications
   */
  renderError(containerEl, message) {
    if (!containerEl) return;
    if (!message) {
      containerEl.innerHTML = '';
      return;
    }
    const comp = this.getComponents();
    containerEl.innerHTML = comp ? comp.ErrorBanner(message) : `<div class="alert alert-error">${message}</div>`;
  }

  /**
   * Render loading skeletons or transitions
   */
  renderLoading(containerEl, isLoading) {
    if (!containerEl) return;
    if (isLoading) {
      const comp = this.getComponents();
      containerEl.innerHTML = comp ? comp.LoadingSkeleton() : `<div style="text-align:center; padding:2rem;">Loading Calculation...</div>`;
    }
  }

  /**
   * Render the developer debug panel
   */
  renderDevPanel(containerEl, debugData) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    const panel = document.createElement('div');
    panel.className = 'dev-panel card';
    panel.style.cssText = 'margin-top: 3rem; border: 1.5px dashed var(--color-primary); padding: 1.5rem; background: var(--color-bg-base); font-size: 0.85rem; font-family: monospace;';

    let stepsList = (debugData.steps || []).map(step => `<li>${step}</li>`).join('');

    panel.innerHTML = `
      <h3 style="margin-bottom: 0.75rem; color: var(--color-primary); display: flex; justify-content: space-between;">
        <span>🛠️ UCE Developer Diagnostics</span>
        <span style="font-size: 0.75rem; color: var(--color-text-secondary);">${debugData.timestamp}</span>
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <strong>Calculator ID:</strong> ${debugData.calculatorId}<br>
          <strong>Config Version:</strong> v${debugData.version || '1.0.0'}<br>
          <strong>Formula Strategy:</strong> ${debugData.formulaType || 'Declarative'}<br>
          <strong>Calculation Time:</strong> ${debugData.calcTimeMs.toFixed(2)}ms
        </div>
        <div>
          <strong>Cache Status:</strong> ${debugData.cacheHit ? '🟢 CACHE HIT' : '⚪ CACHE MISS'}<br>
          <strong>Memory Cache Key:</strong> ${debugData.cacheKey || 'N/A'}<br>
          <strong>Validation:</strong> ${debugData.validationPassed ? '✅ Passed' : '❌ Failed'}
        </div>
      </div>
      <div>
        <strong>Pipeline Steps Executed:</strong>
        <ol style="margin-left: 1.25rem; padding-top: 0.25rem;">
          ${stepsList}
        </ol>
      </div>
    `;
    containerEl.appendChild(panel);
  }
}

export const uceRenderer = new UceRenderer();
