/**
 * GST Calculator Logic
 */
import { Utils } from '../app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  const alertContainer = document.getElementById('calculator-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Utils.clearAlert(alertContainer);

    const amount = parseFloat(document.getElementById('gst-amount').value);
    const rate = parseFloat(document.getElementById('gst-rate').value);
    const action = document.getElementById('gst-action').value;

    if (isNaN(amount) || isNaN(rate) || amount <= 0 || rate < 0) {
      Utils.showAlert(alertContainer, 'error', 'Please enter valid positive values.');
      return;
    }

    let netAmount = 0;
    let taxAmount = 0;
    let grossAmount = 0;

    if (action === 'add') {
      netAmount = amount;
      taxAmount = amount * (rate / 100);
      grossAmount = amount + taxAmount;
    } else {
      grossAmount = amount;
      netAmount = amount / (1 + rate / 100);
      taxAmount = amount - netAmount;
    }

    // Render results
    const netDisplay = document.getElementById('result-gst-net');
    const taxDisplay = document.getElementById('result-gst-tax');
    const grossDisplay = document.getElementById('result-gst-gross');

    if (netDisplay && taxDisplay && grossDisplay) {
      netDisplay.innerText = '$' + Utils.formatNumber(netAmount, 2);
      taxDisplay.innerText = '$' + Utils.formatNumber(taxAmount, 2);
      grossDisplay.innerText = '$' + Utils.formatNumber(grossAmount, 2);
    }
  });
});
