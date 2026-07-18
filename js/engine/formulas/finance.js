/**
 * Finance category formulas
 */
export const financeFormulas = {
  /**
   * EMI Calculator formula logic
   */
  'emi-calculator'(inputs) {
    const principal = inputs['emi-amount'];
    const annualRate = inputs['emi-rate'];
    const years = inputs['emi-tenure'];

    if (principal <= 0 || annualRate < 0 || years <= 0) {
      throw new Error('Principal, interest rate, and term must be positive values.');
    }

    // Monthly interest rate
    const r = (annualRate / 12) / 100;
    // Total months tenure
    const n = years * 12;

    let emi = 0;
    if (r === 0) {
      emi = principal / n;
    } else {
      emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayable = emi * n;
    const totalInterest = totalPayable - principal;

    return {
      emi,
      principal,
      interest: totalInterest,
      total: totalPayable
    };
  },

  /**
   * GST Calculator formula logic
   */
  'gst-calculator'(inputs) {
    const amount = inputs['gst-amount'];
    const rate = inputs['gst-rate'];
    const action = inputs['gst-action'] || 'add';

    if (amount <= 0 || rate < 0) {
      throw new Error('Amount and tax rate must be positive values.');
    }

    let net = 0;
    let tax = 0;
    let gross = 0;

    if (action === 'add') {
      net = amount;
      tax = amount * (rate / 100);
      gross = amount + tax;
    } else {
      gross = amount;
      net = amount / (1 + rate / 100);
      tax = amount - net;
    }

    return {
      net,
      tax,
      gross
    };
  },

  /**
   * Reusable Compound Interest Calculator formula logic
   */
  'compound-interest-calculator'(inputs) {
    const principal = inputs['val-principal'] || inputs['compound-principal'] || 1000;
    const annualRate = inputs['val-rate'] || inputs['compound-rate'] || 10;
    const years = inputs['val-term'] || inputs['compound-term'] || 5;
    const compoundFrequency = inputs['compound-frequency'] || 12; // monthly default

    if (principal <= 0 || annualRate < 0 || years <= 0) {
      throw new Error('Inputs must be positive values.');
    }

    const r = annualRate / 100;
    const n = compoundFrequency;
    const t = years;

    const total = principal * Math.pow(1 + r/n, n * t);
    const interest = total - principal;

    return {
      accrued: interest,
      result: total
    };
  }
};

export default financeFormulas;
