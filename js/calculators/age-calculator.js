/**
 * Age Calculator Logic
 */
import { Utils } from '../app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  const alertContainer = document.getElementById('calculator-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Utils.clearAlert(alertContainer);

    const birthDateInput = document.getElementById('birth-date').value;
    const targetDateInput = document.getElementById('target-date').value;

    if (!birthDateInput || !targetDateInput) {
      Utils.showAlert(alertContainer, 'error', 'Please fill in both date fields.');
      return;
    }

    const birthDate = new Date(birthDateInput);
    const targetDate = new Date(targetDateInput);

    if (birthDate > targetDate) {
      Utils.showAlert(alertContainer, 'error', 'Birth date cannot be after the target age calculation date.');
      return;
    }

    // Exact Age Calculation
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Find days in previous month
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total counts
    const totalMs = targetDate - birthDate;
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (targetDate.getFullYear() - birthDate.getFullYear()) * 12 + (targetDate.getMonth() - birthDate.getMonth());
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

    // Update UI elements
    document.getElementById('result-years').innerText = years;
    document.getElementById('result-months-remain').innerText = months;
    document.getElementById('result-days-remain').innerText = days;

    document.getElementById('result-months').innerText = Utils.formatNumber(totalMonths, 0);
    document.getElementById('result-weeks').innerText = Utils.formatNumber(totalWeeks, 0);
    document.getElementById('result-days').innerText = Utils.formatNumber(totalDays, 0);
    document.getElementById('result-hours').innerText = Utils.formatNumber(totalHours, 0);
  });
});
