/**
 * Date category registry configurations
 */
export const dateRegistry = [
  {
    id: 'age-calculator',
    version: '1.0.0',
    name: 'Age Calculator',
    category: 'date',
    desc: 'Calculate your exact age in years, months, weeks, days, and hours.',
    formulaType: 'function',
    inputs: [
      {
        id: 'birth-date',
        label: 'Date of Birth',
        type: 'date',
        defaultValue: '1995-01-01',
        required: true
      },
      {
        id: 'target-date',
        label: 'Calculate Age At',
        type: 'date',
        defaultValue: new Date().toISOString().split('T')[0],
        required: true
      }
    ],
    outputs: [
      {
        id: 'years',
        label: 'Years',
        primary: true,
        format: 'number',
        decimals: 0
      },
      {
        id: 'months-remain',
        label: 'Months',
        format: 'number',
        decimals: 0
      },
      {
        id: 'days-remain',
        label: 'Days',
        format: 'number',
        decimals: 0
      },
      {
        id: 'months',
        label: 'Total Months',
        format: 'number',
        decimals: 0
      },
      {
        id: 'weeks',
        label: 'Total Weeks',
        format: 'number',
        decimals: 0
      },
      {
        id: 'days',
        label: 'Total Days',
        format: 'number',
        decimals: 0
      },
      {
        id: 'hours',
        label: 'Total Hours',
        format: 'number',
        decimals: 0
      }
    ],
    validation: {
      dateRange: {
        startId: 'birth-date',
        endId: 'target-date'
      }
    },
    explanation: `
      <div style="font-size: 0.95rem; text-align: left;">
        <p>Your calculated exact age is <strong>{result_years} years</strong>, <strong>{result_months-remain} months</strong>, and <strong>{result_days-remain} days</strong>.</p>
        <p style="margin-top: 0.5rem;">Alternatively, this corresponds to:</p>
        <ul style="margin: 0.25rem 0 0 1rem; display: flex; flex-direction: column; gap: 0.25rem;">
          <li>Total Months: <strong>{result_months}</strong></li>
          <li>Total Weeks: <strong>{result_weeks}</strong></li>
          <li>Total Days: <strong>{result_days}</strong></li>
          <li>Total Hours: <strong>{result_hours}</strong></li>
        </ul>
      </div>
    `
  }
];

export default dateRegistry;
