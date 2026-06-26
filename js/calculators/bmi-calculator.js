/**
 * BMI Calculator Logic
 */
import { Utils } from '../app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  const alertContainer = document.getElementById('calculator-alert');
  const unitSelect = document.getElementById('bmi-units');
  const weightLabel = document.getElementById('weight-label');
  const heightLabel = document.getElementById('height-label');

  if (!form) return;

  // Handles metric vs imperial unit label updating
  if (unitSelect) {
    unitSelect.addEventListener('change', () => {
      if (unitSelect.value === 'metric') {
        weightLabel.innerText = 'Weight (kg)';
        heightLabel.innerText = 'Height (cm)';
      } else {
        weightLabel.innerText = 'Weight (lbs)';
        heightLabel.innerText = 'Height (inches)';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Utils.clearAlert(alertContainer);

    const units = unitSelect.value;
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      Utils.showAlert(alertContainer, 'error', 'Please enter valid positive values.');
      return;
    }

    let bmi = 0;
    if (units === 'metric') {
      // Metric: BMI = kg / (m^2)
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      // Imperial: BMI = (lbs * 703) / (inches^2)
      bmi = (weight * 703) / (height * height);
    }

    // Determine category
    let category = '';
    let categoryColor = 'var(--color-success)';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'var(--color-warning)';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal Weight';
      categoryColor = 'var(--color-success)';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      categoryColor = 'var(--color-warning)';
    } else {
      category = 'Obese';
      categoryColor = 'var(--color-error)';
    }

    // Render results
    const bmiResult = document.getElementById('result-bmi');
    const catResult = document.getElementById('result-bmi-cat');

    if (bmiResult && catResult) {
      bmiResult.innerText = Utils.formatNumber(bmi, 1);
      catResult.innerText = category;
      catResult.style.color = categoryColor;
    }
  });
});
