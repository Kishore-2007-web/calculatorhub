/**
 * Math Logic Module for Heloc Payment
 */
import { Utils } from '../app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  const alertContainer = document.getElementById('calculator-alert');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Utils.clearAlert(alertContainer);

    // Mock programmatic calculation engine
    const resultVal = document.getElementById('result-val');
    if (resultVal) {
      // Collect all input elements in form
      const inputs = Array.from(form.querySelectorAll('input[type="number"]'));
      let sum = 0;
      inputs.forEach(input => {
        sum += parseFloat(input.value) || 0;
      });
      
      const rateInput = form.querySelector('input[id*="rate"]');
      if (rateInput && inputs.length > 1) {
        // Compound interest style calculations
        const p = parseFloat(inputs[0].value) || 0;
        const r = (parseFloat(rateInput.value) || 0) / 100;
        const t = parseFloat(inputs[inputs.length - 1].value) || 1;
        const total = p * Math.pow((1 + r), t);
        resultVal.innerText = Utils.formatNumber(total, 2);
        
        const accrued = document.getElementById('result-accrued');
        if (accrued) accrued.innerText = '$' + Utils.formatNumber(total - p, 2);
      } else {
        // Default additions calculation
        resultVal.innerText = Utils.formatNumber(sum, 2);
      }
    }
  });
});
