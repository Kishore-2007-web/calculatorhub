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
  renderForm(containerEl, inputs, onChangeCallback, calculator) {
    if (!containerEl) return;

    // Check if pocket calculator style is requested
    if (calculator && (calculator.id === 'simple-calculator' || calculator.id === 'scientific-calculator')) {
      this.renderPocketCalculator(containerEl, calculator, onChangeCallback);
      return;
    }

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
        case 'text':
        case 'string':
          fieldHtml = comp.TextInput(input);
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
   * Render pocket calculator keypad interface
   */
  renderPocketCalculator(containerEl, calculator, onChangeCallback) {
    containerEl.innerHTML = '';
    
    const isSci = calculator.id === 'scientific-calculator';
    const gridCols = isSci ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)';
    
    let buttons = [];
    if (isSci) {
      buttons = [
        { label: 'sin', action: 'func', value: 'sin(' },
        { label: 'cos', action: 'func', value: 'cos(' },
        { label: 'tan', action: 'func', value: 'tan(' },
        { label: 'C', action: 'clear', class: 'btn-danger' },
        { label: '⌫', action: 'backspace', class: 'btn-warning' },

        { label: 'log', action: 'func', value: 'log(' },
        { label: 'ln', action: 'func', value: 'ln(' },
        { label: 'sqrt', action: 'func', value: 'sqrt(' },
        { label: '(', action: 'append', value: '(' },
        { label: ')', action: 'append', value: ')' },

        { label: '7', action: 'append', value: '7', class: 'btn-num' },
        { label: '8', action: 'append', value: '8', class: 'btn-num' },
        { label: '9', action: 'append', value: '9', class: 'btn-num' },
        { label: '^', action: 'append', value: '^' },
        { label: '/', action: 'append', value: '/' },

        { label: '4', action: 'append', value: '4', class: 'btn-num' },
        { label: '5', action: 'append', value: '5', class: 'btn-num' },
        { label: '6', action: 'append', value: '6', class: 'btn-num' },
        { label: 'π', action: 'append', value: 'pi' },
        { label: '*', action: 'append', value: '*' },

        { label: '1', action: 'append', value: '1', class: 'btn-num' },
        { label: '2', action: 'append', value: '2', class: 'btn-num' },
        { label: '3', action: 'append', value: '3', class: 'btn-num' },
        { label: 'e', action: 'append', value: 'e' },
        { label: '-', action: 'append', value: '-' },

        { label: '0', action: 'append', value: '0', class: 'btn-num' },
        { label: '.', action: 'append', value: '.' },
        { label: 'exp', action: 'func', value: 'exp(' },
        { label: '=', action: 'calculate', class: 'btn-success' },
        { label: '+', action: 'append', value: '+' }
      ];
    } else {
      buttons = [
        { label: 'C', action: 'clear', class: 'btn-danger' },
        { label: '(', action: 'append', value: '(' },
        { label: ')', action: 'append', value: ')' },
        { label: '⌫', action: 'backspace', class: 'btn-warning' },

        { label: '7', action: 'append', value: '7', class: 'btn-num' },
        { label: '8', action: 'append', value: '8', class: 'btn-num' },
        { label: '9', action: 'append', value: '9', class: 'btn-num' },
        { label: '/', action: 'append', value: '/' },

        { label: '4', action: 'append', value: '4', class: 'btn-num' },
        { label: '5', action: 'append', value: '5', class: 'btn-num' },
        { label: '6', action: 'append', value: '6', class: 'btn-num' },
        { label: '*', action: 'append', value: '*' },

        { label: '1', action: 'append', value: '1', class: 'btn-num' },
        { label: '2', action: 'append', value: '2', class: 'btn-num' },
        { label: '3', action: 'append', value: '3', class: 'btn-num' },
        { label: '-', action: 'append', value: '-' },

        { label: '0', action: 'append', value: '0', class: 'btn-num' },
        { label: '.', action: 'append', value: '.' },
        { label: '=', action: 'calculate', class: 'btn-success' },
        { label: '+', action: 'append', value: '+' }
      ];
    }

    const calcWrapper = document.createElement('div');
    calcWrapper.className = 'pocket-calc-wrapper animate-fade-in';
    calcWrapper.style.cssText = `
      width: 100%;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      box-shadow: var(--shadow-lg);
      margin: 0 auto;
    `;

    // Display
    const display = document.createElement('div');
    display.className = 'pocket-calc-display';
    display.style.cssText = `
      background: #0f172a;
      color: #f8fafc;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      text-align: right;
      margin-bottom: 1.25rem;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(255,255,255,0.05);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    `;

    const exprDiv = document.createElement('div');
    exprDiv.className = 'pocket-calc-expr';
    exprDiv.style.cssText = `
      font-size: 0.95rem;
      color: #94a3b8;
      font-family: monospace;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
    `;
    exprDiv.innerText = '';

    const currentDiv = document.createElement('div');
    currentDiv.className = 'calc-current';
    currentDiv.style.cssText = `
      font-size: 2.15rem;
      font-weight: 700;
      font-family: monospace;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
    `;
    currentDiv.setAttribute('data-expression', '0');
    currentDiv.innerText = '0';

    display.appendChild(exprDiv);
    display.appendChild(currentDiv);
    calcWrapper.appendChild(display);

    // Keypad grid
    const keypad = document.createElement('div');
    keypad.style.cssText = `
      display: grid;
      grid-template-columns: ${gridCols};
      gap: 0.65rem;
    `;

    // Help function to update display
    let currentExpression = '0';
    let displayExpression = '0';
    let isResultDisplayed = false;

    const updateDisplay = () => {
      exprDiv.innerText = isResultDisplayed ? '' : (displayExpression === '0' ? '' : displayExpression);
      currentDiv.innerText = displayExpression;
      currentDiv.setAttribute('data-expression', currentExpression);
      
      exprDiv.scrollLeft = exprDiv.scrollWidth;
      currentDiv.scrollLeft = currentDiv.scrollWidth;
    };

    buttons.forEach(btn => {
      const bEl = document.createElement('button');
      bEl.type = 'button';
      bEl.innerText = btn.label;
      
      let bgStyle = 'background: var(--color-bg-base); color: var(--color-text-primary); border: 1px solid var(--color-border);';
      if (btn.class === 'btn-danger') {
        bgStyle = 'background: #ef4444; color: #fff; border: 1px solid #dc2626;';
      } else if (btn.class === 'btn-warning') {
        bgStyle = 'background: #f97316; color: #fff; border: 1px solid #ea580c;';
      } else if (btn.class === 'btn-success') {
        bgStyle = 'background: #10b981; color: #fff; border: 1px solid #059669;';
      } else if (!btn.class && ['/', '*', '-', '+', '^'].includes(btn.value)) {
        bgStyle = 'background: rgba(var(--color-primary-rgb), 0.15); color: var(--color-primary); border: 1px solid var(--color-border-hover);';
      }

      bEl.style.cssText = `
        ${bgStyle}
        font-size: 1.15rem;
        font-weight: 700;
        padding: 0.75rem 0;
        border-radius: var(--radius-md);
        cursor: pointer;
        user-select: none;
        transition: transform 0.1s ease, filter 0.15s ease;
      `;

      bEl.addEventListener('mousedown', () => {
        bEl.style.transform = 'scale(0.95)';
      });
      bEl.addEventListener('mouseup', () => {
        bEl.style.transform = 'scale(1)';
      });
      bEl.addEventListener('mouseleave', () => {
        bEl.style.transform = 'scale(1)';
      });

      bEl.addEventListener('click', () => {
        if (btn.action === 'clear') {
          currentExpression = '0';
          displayExpression = '0';
          isResultDisplayed = false;
          updateDisplay();
        } else if (btn.action === 'backspace') {
          if (isResultDisplayed) {
            currentExpression = '0';
            displayExpression = '0';
            isResultDisplayed = false;
          } else {
            if (currentExpression.length <= 1) {
              currentExpression = '0';
              displayExpression = '0';
            } else {
              currentExpression = currentExpression.slice(0, -1);
              displayExpression = displayExpression.slice(0, -1);
            }
          }
          updateDisplay();
        } else if (btn.action === 'append' || btn.action === 'func') {
          if (isResultDisplayed) {
            if (btn.action === 'func' || ['/', '*', '-', '+', '^'].includes(btn.value)) {
              isResultDisplayed = false;
            } else {
              currentExpression = '0';
              displayExpression = '0';
              isResultDisplayed = false;
            }
          }

          const val = btn.value;
          const label = btn.label;

          if (currentExpression === '0' && !['/', '*', '-', '+', '^', '.'].includes(val)) {
            currentExpression = val;
            displayExpression = label;
          } else {
            currentExpression += val;
            displayExpression += label;
          }
          updateDisplay();
        } else if (btn.action === 'calculate') {
          if (onChangeCallback) onChangeCallback();
          isResultDisplayed = true;
        }
      });

      keypad.appendChild(bEl);
    });

    const handleKeyPress = (e) => {
      const key = e.key;
      let targetBtn = null;
      if (key >= '0' && key <= '9') {
        targetBtn = buttons.find(b => b.label === key);
      } else if (key === '+') {
        targetBtn = buttons.find(b => b.value === '+');
      } else if (key === '-') {
        targetBtn = buttons.find(b => b.value === '-');
      } else if (key === '*') {
        targetBtn = buttons.find(b => b.value === '*');
      } else if (key === '/') {
        targetBtn = buttons.find(b => b.value === '/');
      } else if (key === '.') {
        targetBtn = buttons.find(b => b.value === '.');
      } else if (key === '(') {
        targetBtn = buttons.find(b => b.value === '(');
      } else if (key === ')') {
        targetBtn = buttons.find(b => b.value === ')');
      } else if (key === '^') {
        targetBtn = buttons.find(b => b.value === '^');
      } else if (key === 'Backspace') {
        targetBtn = buttons.find(b => b.action === 'backspace');
      } else if (key === 'Enter' || key === '=') {
        targetBtn = buttons.find(b => b.action === 'calculate');
      } else if (key === 'Escape') {
        targetBtn = buttons.find(b => b.action === 'clear');
      }

      if (targetBtn) {
        e.preventDefault();
        const matchedBtn = Array.from(keypad.children).find(el => el.innerText === targetBtn.label);
        if (matchedBtn) {
          matchedBtn.click();
          matchedBtn.style.transform = 'scale(0.9)';
          setTimeout(() => { matchedBtn.style.transform = 'scale(1)'; }, 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    const observer = new MutationObserver((mutations, obs) => {
      if (!document.contains(calcWrapper)) {
        window.removeEventListener('keydown', handleKeyPress);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    calcWrapper.appendChild(keypad);
    containerEl.appendChild(calcWrapper);
  }

  /**
   * Helper function to convert decimals to Roman Numerals
   */
  toRoman(num) {
    const val = Math.floor(num);
    if (val <= 0 || val >= 4000) return 'N/A';
    const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    let n = val;
    for (let i in lookup) {
      while (n >= lookup[i]) {
        roman += i;
        n -= lookup[i];
      }
    }
    return roman;
  }

  /**
   * Render outputs / results panel
   */
  renderResults(containerEl, resultsObj, calculatorConfig) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    // Handle interactive pocket calculators results overlay
    if (calculatorConfig && (calculatorConfig.id === 'simple-calculator' || calculatorConfig.id === 'scientific-calculator')) {
      const calcCurrent = document.querySelector('.calc-current');
      if (calcCurrent) {
        calcCurrent.innerText = resultsObj.formattedResult;
        calcCurrent.setAttribute('data-expression', resultsObj.rawResult !== undefined ? resultsObj.rawResult.toString() : '0');
      }

      const val = parseFloat(resultsObj.rawResult);
      let resultsHtml = '';
      if (isNaN(val)) {
        resultsHtml = `
          <div style="text-align: center; padding: 2rem 0; color: var(--color-text-secondary);">
            Invalid expression format.
          </div>
        `;
      } else {
        const roman = this.toRoman(val);
        const isInteger = Number.isInteger(val);
        const binary = isInteger ? val.toString(2) : 'N/A';
        const hex = isInteger ? '0x' + val.toString(16).toUpperCase() : 'N/A';
        const octal = isInteger ? '0o' + val.toString(8) : 'N/A';
        const sci = val.toExponential(4);

        resultsHtml = `
          <div style="padding: 0.5rem 0; width: 100%;">
            <div style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border);">
              <div style="font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Decimal Outcome</div>
              <div style="font-size: 2.25rem; color: var(--color-primary); font-weight: 800; word-break: break-all;">${resultsObj.formattedResult}</div>
            </div>
            <div class="flex justify-between items-center" style="border-bottom: 1px solid var(--color-border); padding: 0.65rem 0; gap: 1rem;">
              <span style="color: var(--color-text-secondary); font-size: 0.95rem;">Scientific Notation:</span>
              <strong style="color: var(--color-text-primary); font-family: monospace; word-break: break-all;">${sci}</strong>
            </div>
            <div class="flex justify-between items-center" style="border-bottom: 1px solid var(--color-border); padding: 0.65rem 0; gap: 1rem;">
              <span style="color: var(--color-text-secondary); font-size: 0.95rem;">Binary (Base 2):</span>
              <strong style="color: var(--color-text-primary); font-family: monospace; word-break: break-all;">${binary}</strong>
            </div>
            <div class="flex justify-between items-center" style="border-bottom: 1px solid var(--color-border); padding: 0.65rem 0; gap: 1rem;">
              <span style="color: var(--color-text-secondary); font-size: 0.95rem;">Hexadecimal (Base 16):</span>
              <strong style="color: var(--color-text-primary); font-family: monospace; word-break: break-all;">${hex}</strong>
            </div>
            <div class="flex justify-between items-center" style="border-bottom: 1px solid var(--color-border); padding: 0.65rem 0; gap: 1rem;">
              <span style="color: var(--color-text-secondary); font-size: 0.95rem;">Octal (Base 8):</span>
              <strong style="color: var(--color-text-primary); font-family: monospace; word-break: break-all;">${octal}</strong>
            </div>
            <div class="flex justify-between items-center" style="border-bottom: 1px solid var(--color-border); padding: 0.65rem 0; gap: 1rem;">
              <span style="color: var(--color-text-secondary); font-size: 0.95rem;">Roman Numeral:</span>
              <strong style="color: var(--color-text-primary); font-family: monospace; word-break: break-all;">${roman}</strong>
            </div>
          </div>
        `;
      }
      containerEl.innerHTML = resultsHtml;
      return;
    }

    const comp = this.getComponents();
    if (!comp) return;

    let resultsHtml = '';
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
