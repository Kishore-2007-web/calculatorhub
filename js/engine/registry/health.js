/**
 * Health category registry configurations
 */
export const healthRegistry = [
  {
    id: 'bmi-calculator',
    version: '1.0.1',
    name: 'BMI Calculator',
    category: 'health-fitness',
    desc: 'Calculate your Body Mass Index (BMI) using metric or imperial values.',
    formulaType: 'function',
    inputs: [
      {
        id: 'bmi-units',
        label: 'Unit System',
        type: 'dropdown',
        defaultValue: 'metric',
        required: true,
        options: [
          { label: 'Metric (kg / cm)', value: 'metric' },
          { label: 'Imperial (lbs / inches)', value: 'imperial' }
        ]
      },
      {
        id: 'bmi-weight',
        label: 'Weight',
        type: 'number',
        defaultValue: 70,
        required: true,
        min: 1,
        max: 500,
        unitType: 'weight',
        unitSystem: {
          metric: 'kg',
          imperial: 'lb'
        },
        helpText: 'Enter your current body weight.'
      },
      {
        id: 'bmi-height',
        label: 'Height',
        type: 'number',
        defaultValue: 175,
        required: true,
        min: 1,
        max: 300,
        unitType: 'length',
        unitSystem: {
          metric: 'cm',
          imperial: 'inch'
        },
        helpText: 'Enter your standing height.'
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Body Mass Index (BMI)',
        primary: true,
        format: 'number',
        decimals: 1
      }
    ],
    units: {
      selectorId: 'bmi-units',
      default: 'metric'
    },
    interpretation: [
      {
        max: 18.5,
        category: 'Underweight',
        color: 'var(--color-warning)',
        warnings: ['Your BMI indicates you are underweight. Consider speaking with a doctor.'],
        suggestions: ['Focus on calorie-dense, nutritious foods.', 'Include resistance strength training.']
      },
      {
        min: 18.5,
        max: 25,
        category: 'Normal Weight',
        color: 'var(--color-success)',
        warnings: [],
        suggestions: ['Maintain your active lifestyle.', 'Eat a balanced whole-foods diet.']
      },
      {
        min: 25,
        max: 30,
        category: 'Overweight',
        color: 'var(--color-warning)',
        warnings: ['Your BMI falls within the overweight range.'],
        suggestions: ['Incorporate moderate physical activity.', 'Monitor portion sizes.']
      },
      {
        min: 30,
        category: 'Obese',
        color: 'var(--color-error)',
        warnings: ['Your BMI indicates obesity, which increases health risks.'],
        suggestions: ['Consult a primary healthcare provider.', 'Adopt low-impact workouts.']
      }
    ],
    explanation: `
      <div style="margin-top: 1.5rem; text-align: left;">
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-primary);">BMI Classification: {category}</h4>
        <p style="font-size: 0.95rem; margin-bottom: 0.75rem;">Your calculated Body Mass Index is <strong>{result}</strong>.</p>
        <div style="font-size: 0.85rem; color: var(--color-text-secondary); background: var(--color-bg-base); padding: 0.75rem 1rem; border-radius: var(--radius-md);">
          <strong>Standard Scales:</strong><br>
          &bull; Underweight: &lt; 18.5<br>
          &bull; Normal weight: 18.5 - 24.9<br>
          &bull; Overweight: 25.0 - 29.9<br>
          &bull; Obese: &ge; 30.0
        </div>
      </div>
    `
  },
  {
    id: 'bmr-calculator',
    version: '1.0.0',
    name: 'BMR Calculator',
    category: 'health-fitness',
    desc: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.',
    formulaType: 'function',
    inputs: [
      {
        id: 'bmr-gender',
        label: 'Gender',
        type: 'radio',
        defaultValue: 'male',
        required: true,
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      },
      {
        id: 'bmr-weight',
        label: 'Weight (kg)',
        type: 'number',
        defaultValue: 70,
        required: true,
        min: 1
      },
      {
        id: 'bmr-height',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 175,
        required: true,
        min: 1
      },
      {
        id: 'bmr-age',
        label: 'Age (years)',
        type: 'number',
        defaultValue: 25,
        required: true,
        min: 1
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Basal Metabolic Rate (BMR)',
        primary: true,
        format: 'number',
        decimals: 0,
        unit: 'calories/day'
      }
    ],
    explanation: `
      <div style="margin-top: 1rem; text-align: left;">
        <p>Your Basal Metabolic Rate is <strong>{result}</strong>. This is the minimum energy required to survive at rest.</p>
      </div>
    `
  }
];

export default healthRegistry;
