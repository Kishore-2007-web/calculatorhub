/**
 * EMI Calculator Logic
 */
import { Utils } from '../app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  const alertContainer = document.getElementById('calculator-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Utils.clearAlert(alertContainer);

    const principal = parseFloat(document.getElementById('emi-amount').value);
    const annualRate = parseFloat(document.getElementById('emi-rate').value);
    const years = parseFloat(document.getElementById('emi-tenure').value);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
      Utils.showAlert(alertContainer, 'error', 'Please enter positive values for all parameters.');
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    let emi = 0;
    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    // Render results
    const emiDisplay = document.getElementById('result-emi');
    const principalDisplay = document.getElementById('result-emi-principal');
    const interestDisplay = document.getElementById('result-emi-interest');
    const totalDisplay = document.getElementById('result-emi-total');

    if (emiDisplay && principalDisplay && interestDisplay && totalDisplay) {
      emiDisplay.innerText = '$' + Utils.formatNumber(emi, 2);
      principalDisplay.innerText = '$' + Utils.formatNumber(principal, 2);
      interestDisplay.innerText = '$' + Utils.formatNumber(totalInterest, 2);
      totalDisplay.innerText = '$' + Utils.formatNumber(totalPayment, 2);
    }
  });
});
