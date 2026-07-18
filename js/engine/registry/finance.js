/**
 * Finance category registry configurations
 */
export const financeRegistry = [
  {
    id: 'emi-calculator',
    version: '1.0.0',
    name: 'EMI Calculator',
    category: 'finance',
    desc: 'Calculate Equated Monthly Installments (EMI) for home, auto, or personal loans.',
    formulaType: 'function',
    inputs: [
      {
        id: 'emi-amount',
        label: 'Loan Amount ($)',
        type: 'currency',
        defaultValue: 10000,
        required: true,
        min: 1,
        helpText: 'Enter the total loan amount requested.'
      },
      {
        id: 'emi-rate',
        label: 'Annual Interest Rate (%)',
        type: 'percentage',
        defaultValue: 7.5,
        required: true,
        min: 0.1,
        max: 99,
        step: 0.01,
        helpText: 'Enter the annual base percentage rate.'
      },
      {
        id: 'emi-tenure',
        label: 'Loan Tenure (Years)',
        type: 'number',
        defaultValue: 5,
        required: true,
        min: 1,
        max: 40,
        helpText: 'Enter the loan term duration in years.'
      }
    ],
    outputs: [
      {
        id: 'emi',
        label: 'Monthly EMI Payable',
        primary: true,
        format: 'currency'
      },
      {
        id: 'principal',
        label: 'Principal Amount',
        format: 'currency'
      },
      {
        id: 'interest',
        label: 'Total Interest Payable',
        format: 'currency'
      },
      {
        id: 'total',
        label: 'Total Amount Payable',
        format: 'currency'
      }
    ],
    explanation: `
      <div style="padding: 0.5rem 0; font-size: 0.95rem;">
        <p>For a loan principal of <strong>{input_emi-amount}</strong> at an annual rate of <strong>{input_emi-rate}%</strong> over <strong>{input_emi-tenure} years</strong>:</p>
        <ul style="margin: 0.5rem 0 0 1rem; display: flex; flex-direction: column; gap: 0.25rem;">
          <li>Your monthly payment is <strong>{result_emi}</strong>.</li>
          <li>Total interest paid over the term is <strong>{result_interest}</strong>.</li>
          <li>The complete payback amount is <strong>{result_total}</strong>.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'gst-calculator',
    version: '1.0.0',
    name: 'GST Calculator',
    category: 'finance',
    desc: 'Calculate Goods and Services Tax (GST) easily by adding or removing tax values.',
    formulaType: 'function',
    inputs: [
      {
        id: 'gst-amount',
        label: 'Amount ($)',
        type: 'currency',
        defaultValue: 1000,
        required: true,
        min: 0.01,
        step: 0.01
      },
      {
        id: 'gst-rate',
        label: 'GST Rate (%)',
        type: 'percentage',
        defaultValue: 18,
        required: true,
        min: 0,
        max: 100,
        step: 0.1
      },
      {
        id: 'gst-action',
        label: 'Tax Calculation',
        type: 'dropdown',
        defaultValue: 'add',
        required: true,
        options: [
          { label: 'Add GST (+)', value: 'add' },
          { label: 'Remove GST (-)', value: 'remove' }
        ]
      }
    ],
    outputs: [
      {
        id: 'net',
        label: 'Net Amount (Before Tax)',
        format: 'currency'
      },
      {
        id: 'tax',
        label: 'Tax Amount (GST)',
        format: 'currency'
      },
      {
        id: 'gross',
        label: 'Gross Amount (Inclusive)',
        primary: true,
        format: 'currency'
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>Base calculation details:</p>
        <ul style="margin: 0.5rem 0 0 1rem; display: flex; flex-direction: column; gap: 0.25rem;">
          <li>Net base amount is <strong>{result_net}</strong>.</li>
          <li>GST Tax amount (at {input_gst-rate}%) is <strong>{result_tax}</strong>.</li>
          <li>Gross total amount is <strong>{result_gross}</strong>.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'compound-interest-calculator',
    version: '1.0.0',
    name: 'Compound Interest Calculator',
    category: 'finance',
    desc: 'Determine the growth of investments under compound interest schedules.',
    formulaType: 'function',
    inputs: [
      {
        id: 'compound-principal',
        label: 'Principal Amount ($)',
        type: 'currency',
        defaultValue: 1000,
        required: true,
        min: 1
      },
      {
        id: 'compound-rate',
        label: 'Annual Rate (%)',
        type: 'percentage',
        defaultValue: 10,
        required: true,
        min: 0.1
      },
      {
        id: 'compound-term',
        label: 'Term (Years)',
        type: 'number',
        defaultValue: 5,
        required: true,
        min: 1
      },
      {
        id: 'compound-frequency',
        label: 'Compounding Cycle',
        type: 'dropdown',
        defaultValue: '12',
        required: true,
        options: [
          { label: 'Monthly', value: '12' },
          { label: 'Quarterly', value: '4' },
          { label: 'Annually', value: '1' }
        ]
      }
    ],
    outputs: [
      {
        id: 'result',
        label: 'Future Value',
        primary: true,
        format: 'currency'
      },
      {
        id: 'accrued',
        label: 'Accrued Interest',
        format: 'currency'
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>After <strong>{input_compound-term} years</strong>, your initial deposit of <strong>{input_compound-principal}</strong> grows to <strong>{result_result}</strong>, earning <strong>{result_accrued}</strong> in interest.</p>
      </div>
    `
  }
];

export default financeRegistry;
