/**
 * Percentage Calculator Logic
 */
import { Utils } from '../app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  const alertContainer = document.getElementById('calculator-alert');
  const typeSelect = document.getElementById('pct-type');
  const labelX = document.getElementById('label-x');
  const labelY = document.getElementById('label-y');

  if (!form) return;

  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      const mode = typeSelect.value;
      if (mode === 'of') {
        labelX.innerText = 'Percentage (X%)';
        labelY.innerText = 'Total Value (Y)';
      } else if (mode === 'is') {
        labelX.innerText = 'Part Value (X)';
        labelY.innerText = 'Whole Value (Y)';
      } else {
        labelX.innerText = 'Initial Value (X)';
        labelY.innerText = 'Final Value (Y)';
      }
    });
    // Trigger initial label text
    typeSelect.dispatchEvent(new Event('change'));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Utils.clearAlert(alertContainer);

    const mode = typeSelect.value;
    const x = parseFloat(document.getElementById('pct-x').value);
    const y = parseFloat(document.getElementById('pct-y').value);

    if (isNaN(x) || isNaN(y)) {
      Utils.showAlert(alertContainer, 'error', 'Please enter valid numbers.');
      return;
    }

    let result = 0;
    let description = '';

    if (mode === 'of') {
      // What is X% of Y?
      result = (x / 100) * y;
      description = `${Utils.formatNumber(x)}% of ${Utils.formatNumber(y)} is ${Utils.formatNumber(result)}.`;
    } else if (mode === 'is') {
      // X is what percent of Y?
      if (y === 0) {
        Utils.showAlert(alertContainer, 'error', 'Cannot divide by zero (Value Y).');
        return;
      }
      result = (x / y) * 100;
      description = `${Utils.formatNumber(x)} is ${Utils.formatNumber(result)}% of ${Utils.formatNumber(y)}.`;
    } else {
      // Percentage change from X to Y
      if (x === 0) {
        Utils.showAlert(alertContainer, 'error', 'Cannot calculate percentage change from initial value of zero.');
        return;
      }
      result = ((y - x) / x) * 100;
      const direction = result >= 0 ? 'increase' : 'decrease';
      description = `The change from ${Utils.formatNumber(x)} to ${Utils.formatNumber(y)} is a ${Utils.formatNumber(Math.abs(result))}% ${direction}.`;
    }

    const resultDisplay = document.getElementById('result-pct');
    const descDisplay = document.getElementById('pct-description');

    if (resultDisplay && descDisplay) {
      resultDisplay.innerText = Utils.formatNumber(result, 2) + (mode !== 'of' ? '%' : '');
      descDisplay.innerText = description;
    }
  });
});
