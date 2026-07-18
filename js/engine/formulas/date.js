/**
 * Date category formulas
 */
export const dateFormulas = {
  /**
   * Age Calculator formula logic
   */
  'age-calculator'(inputs) {
    const birthDateInput = inputs['birth-date'];
    const targetDateInput = inputs['target-date'];

    if (!birthDateInput || !targetDateInput) {
      throw new Error('Missing input dates.');
    }

    const birthDate = new Date(birthDateInput);
    const targetDate = new Date(targetDateInput);

    if (birthDate > targetDate) {
      throw new Error('Birth date cannot be after target age calculation date.');
    }

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

    const totalMs = targetDate - birthDate;
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (targetDate.getFullYear() - birthDate.getFullYear()) * 12 + (targetDate.getMonth() - birthDate.getMonth());
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

    return {
      years,
      'months-remain': months,
      'days-remain': days,
      months: totalMonths,
      weeks: totalWeeks,
      days: totalDays,
      hours: totalHours
    };
  },

  /**
   * General fallback date difference calculator
   */
  'date-difference-calculator'(inputs) {
    const startInput = inputs['val-a'] || inputs['start-date'];
    const endInput = inputs['val-b'] || inputs['end-date'];
    if (!startInput || !endInput) return 0;

    const diffMs = Math.abs(new Date(endInput) - new Date(startInput));
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
};

export default dateFormulas;
