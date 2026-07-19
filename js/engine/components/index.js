/**
 * UCE Dynamic Components Library
 * Returns HTML markup strings for form controls and output result cards.
 */
export const Components = {
  /**
   * Render Standard Number Field
   */
  NumberInput(input) {
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label for="${input.id}">
          ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
          ${input.tooltip ? `<span class="tooltip-trigger" title="${input.tooltip}" style="cursor:help; margin-left:4px;">ℹ️</span>` : ''}
        </label>
        <input type="number" id="${input.id}" class="input-control" 
          placeholder="${input.placeholder || ''}" 
          value="${input.defaultValue !== undefined ? input.defaultValue : (input.default || '')}"
          ${input.min !== undefined ? `min="${input.min}"` : ''}
          ${input.max !== undefined ? `max="${input.max}"` : ''}
          ${input.step !== undefined ? `step="${input.step}"` : 'step="any"'}
          ${input.required ? 'required' : ''}>
        ${input.helpText ? `<p style="font-size: 0.8rem; color: var(--color-text-secondary); margin: 0.25rem 0 0;">${input.helpText}</p>` : ''}
      </div>
    `;
  },

  /**
   * Render Currency Field
   */
  CurrencyInput(input) {
    const symbol = input.unit || '$';
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label for="${input.id}">
          ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
          ${input.tooltip ? `<span class="tooltip-trigger" title="${input.tooltip}" style="cursor:help; margin-left:4px;">ℹ️</span>` : ''}
        </label>
        <div style="position: relative; display: flex; align-items: center; width: 100%;">
          <span style="position: absolute; left: 1rem; font-weight: 600; color: var(--color-text-secondary); user-select: none;">${symbol}</span>
          <input type="number" id="${input.id}" class="input-control" style="padding-left: 2rem;"
            placeholder="${input.placeholder || ''}" 
            value="${input.defaultValue !== undefined ? input.defaultValue : (input.default || '')}"
            ${input.min !== undefined ? `min="${input.min}"` : ''}
            ${input.max !== undefined ? `max="${input.max}"` : ''}
            ${input.step !== undefined ? `step="${input.step}"` : 'step="any"'}
            ${input.required ? 'required' : ''}>
        </div>
        ${input.helpText ? `<p style="font-size: 0.8rem; color: var(--color-text-secondary); margin: 0.25rem 0 0;">${input.helpText}</p>` : ''}
      </div>
    `;
  },

  /**
   * Render Percentage Field
   */
  PercentageInput(input) {
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label for="${input.id}">
          ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
          ${input.tooltip ? `<span class="tooltip-trigger" title="${input.tooltip}" style="cursor:help; margin-left:4px;">ℹ️</span>` : ''}
        </label>
        <div style="position: relative; display: flex; align-items: center; width: 100%;">
          <input type="number" id="${input.id}" class="input-control" style="padding-right: 2.2rem;"
            placeholder="${input.placeholder || ''}" 
            value="${input.defaultValue !== undefined ? input.defaultValue : (input.default || '')}"
            ${input.min !== undefined ? `min="${input.min}"` : ''}
            ${input.max !== undefined ? `max="${input.max}"` : ''}
            ${input.step !== undefined ? `step="${input.step}"` : 'step="any"'}
            ${input.required ? 'required' : ''}>
          <span style="position: absolute; right: 1rem; font-weight: 600; color: var(--color-text-secondary); user-select: none;">%</span>
        </div>
        ${input.helpText ? `<p style="font-size: 0.8rem; color: var(--color-text-secondary); margin: 0.25rem 0 0;">${input.helpText}</p>` : ''}
      </div>
    `;
  },

  /**
   * Render Range / Slider Field
   */
  Slider(input) {
    const val = input.defaultValue !== undefined ? input.defaultValue : (input.default || 0);
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <div class="flex justify-between items-center" style="margin-bottom: 0.25rem;">
          <label for="${input.id}" style="margin: 0;">
            ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
          </label>
          <strong id="${input.id}-val" style="font-size: 0.95rem; color: var(--color-primary);">${val}</strong>
        </div>
        <input type="range" id="${input.id}" style="width: 100%; height: 6px; border-radius: var(--radius-full); accent-color: var(--color-primary); cursor: pointer;"
          min="${input.min !== undefined ? input.min : 0}"
          max="${input.max !== undefined ? input.max : 100}"
          step="${input.step !== undefined ? input.step : 1}"
          value="${val}">
      </div>
    `;
  },

  /**
   * Render Toggle Switch Field
   */
  Toggle(input) {
    const isChecked = input.defaultValue === true || input.default === true;
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}" style="flex-direction: row; align-items: center; justify-content: space-between;">
        <label for="${input.id}" style="margin: 0; cursor: pointer;">
          ${input.label}
          ${input.tooltip ? `<span class="tooltip-trigger" title="${input.tooltip}" style="cursor:help; margin-left:4px;">ℹ️</span>` : ''}
        </label>
        <label class="theme-switch" style="width: 46px; height: 24px; margin: 0;">
          <input type="checkbox" id="${input.id}" ${isChecked ? 'checked' : ''}>
          <span class="theme-slider" style="border-radius: 34px; before: {width: 18px; height: 18px; left: 3px; bottom: 3px;}"></span>
        </label>
      </div>
    `;
  },

  /**
   * Render Date Picker Field
   */
  DatePicker(input) {
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label for="${input.id}">
          ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
        </label>
        <input type="date" id="${input.id}" class="input-control"
          value="${input.defaultValue || input.default || ''}"
          ${input.min ? `min="${input.min}"` : ''}
          ${input.max ? `max="${input.max}"` : ''}
          ${input.required ? 'required' : ''}>
      </div>
    `;
  },

  /**
   * Render Dropdown Selector Field
   */
  Dropdown(input) {
    const optionsHtml = (input.options || []).map(opt => `
      <option value="${opt.value}" ${opt.value === (input.defaultValue || input.default) ? 'selected' : ''}>${opt.label}</option>
    `).join('');

    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label for="${input.id}">
          ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
        </label>
        <select id="${input.id}" class="input-control">
          ${optionsHtml}
        </select>
      </div>
    `;
  },

  /**
   * Render Checkbox Field
   */
  Checkbox(input) {
    const isChecked = input.defaultValue === true || input.default === true;
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}" style="flex-direction: row; align-items: center; gap: 0.5rem;">
        <input type="checkbox" id="${input.id}" style="width: 18px; height: 18px; accent-color: var(--color-primary); cursor: pointer;" ${isChecked ? 'checked' : ''}>
        <label for="${input.id}" style="margin: 0; cursor: pointer; font-weight: 500;">
          ${input.label}
        </label>
      </div>
    `;
  },

  /**
   * Render Radio Fields Group
   */
  Radio(input) {
    const radioItems = (input.options || []).map(opt => `
      <label style="display: flex; align-items: center; gap: 0.45rem; cursor: pointer; font-weight: 500; font-size: 0.95rem;">
        <input type="radio" name="${input.id}" value="${opt.value}" ${opt.value === (input.defaultValue || input.default) ? 'checked' : ''} style="accent-color: var(--color-primary); width: 16px; height: 16px;">
        ${opt.label}
      </label>
    `).join('');

    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label>${input.label}</label>
        <div class="flex" style="gap: 1.25rem; flex-wrap: wrap; margin-top: 0.25rem;">
          ${radioItems}
        </div>
      </div>
    `;
  },

  /**
   * Render Complex Key-Value Outcomes Card
   */
  ResultCard(resultsObj, calculatorConfig) {
    const outputs = calculatorConfig.outputs || [];
    const formattedMap = resultsObj.formattedResult || {};

    const itemsHtml = Object.entries(formattedMap).map(([key, val]) => {
      const outputField = outputs.find(o => o.id === key) || {};
      const label = outputField.label || key;

      // Special styling highlight for primary outcome results
      const isPrimary = outputField.primary === true;
      const valStyle = isPrimary ? 'font-size: 2.25rem; color: var(--color-primary); font-weight: 800;' : 'font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary);';

      if (isPrimary) {
        return `
          <div style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border);">
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${label}</div>
            <div id="result-${key}" style="${valStyle}">${val}</div>
          </div>
        `;
      }

      return `
        <div class="flex justify-between items-center" style="border-bottom: 1px solid var(--color-border); padding: 0.65rem 0;">
          <span style="color: var(--color-text-secondary); font-size: 0.95rem;">${label}:</span>
          <strong id="result-${key}" style="${valStyle}">${val}</strong>
        </div>
      `;
    }).join('');

    return `<div style="padding: 0.5rem 0; width: 100%;">${itemsHtml}</div>`;
  },

  /**
   * Render Error Alert Blocks
   */
  ErrorBanner(message) {
    return `
      <div class="alert alert-error animate-fade-in" style="margin-top: 1rem; border-left: 4px solid var(--color-error);">
        <div style="display: flex; flex-direction: column; gap: 0.15rem;">
          <strong style="font-size: 0.95rem;">Error Alert</strong>
          <span style="font-size: 0.9rem;">${message}</span>
        </div>
      </div>
    `;
  },

  /**
   * Render loading blocks skeleton mockup
   */
  LoadingSkeleton() {
    return `
      <div style="padding: 1.5rem; text-align: center; width: 100%;">
        <div style="height: 18px; background: var(--color-border); border-radius: var(--radius-xs); width: 60%; margin: 0 auto 1.25rem; animation: pulse 1.5s infinite ease-in-out;"></div>
        <div style="height: 48px; background: var(--color-border); border-radius: var(--radius-xs); width: 45%; margin: 0 auto 1.5rem; animation: pulse 1.5s infinite ease-in-out;"></div>
        <div style="height: 14px; background: var(--color-border); border-radius: var(--radius-xs); width: 80%; margin: 0 auto; animation: pulse 1.5s infinite ease-in-out;"></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      </style>
    `;
  },

  /**
   * Render Standard Text Input Field
   */
  TextInput(input) {
    return `
      <div class="form-group animate-fade-in" id="group-${input.id}">
        <label for="${input.id}">
          ${input.label} ${input.required ? '<span style="color: var(--color-error);">*</span>' : ''}
          ${input.tooltip ? `<span class="tooltip-trigger" title="${input.tooltip}" style="cursor:help; margin-left:4px;">ℹ️</span>` : ''}
        </label>
        <input type="text" id="${input.id}" class="input-control" 
          placeholder="${input.placeholder || ''}" 
          value="${input.defaultValue !== undefined ? input.defaultValue : (input.default || '')}"
          ${input.required ? 'required' : ''}>
        ${input.helpText ? `<p style="font-size: 0.8rem; color: var(--color-text-secondary); margin: 0.25rem 0 0;">${input.helpText}</p>` : ''}
      </div>
    `;
  }
};

export default Components;
