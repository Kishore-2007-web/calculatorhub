/**
 * Universal Calculator Engine - Unit Conversion Layer
 * Automatically normalizes different parameter units before performing calculations.
 */
import { Utils } from '../utils/index.js';

const UNIT_MAPS = {
  length: {
    base: 'm',
    rates: {
      m: 1,
      cm: 0.01,
      mm: 0.001,
      inch: 0.0254,
      inches: 0.0254,
      foot: 0.3048,
      feet: 0.3048,
      yard: 0.9144,
      km: 1000,
      mile: 1609.344
    }
  },
  temperature: {
    base: 'celsius',
    rates: {} // Special offset logic in convertToBase
  },
  weight: {
    base: 'kg',
    rates: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      lbs: 0.45359237,
      oz: 0.028349523,
      stone: 6.35029318
    }
  },
  volume: {
    base: 'l',
    rates: {
      l: 1,
      liter: 1,
      ml: 0.001,
      m3: 1000,
      gallon: 3.78541,
      cup: 0.236588,
      quart: 0.946353
    }
  },
  speed: {
    base: 'mps',
    rates: {
      mps: 1,
      kmh: 0.277778,
      mph: 0.44704,
      knot: 0.514444
    }
  },
  area: {
    base: 'sqm',
    rates: {
      sqm: 1,
      sqcm: 0.0001,
      sqft: 0.092903,
      sqin: 0.00064516,
      acre: 4046.86,
      hectare: 10000
    }
  },
  storage: {
    base: 'bytes',
    rates: {
      bytes: 1,
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024,
      tb: 1024 * 1024 * 1024 * 1024
    }
  },
  energy: {
    base: 'joule',
    rates: {
      joule: 1,
      j: 1,
      kj: 1000,
      calorie: 4.184,
      cal: 4.184,
      kcal: 4184,
      wh: 3600,
      kwh: 3600000
    }
  },
  pressure: {
    base: 'pascal',
    rates: {
      pascal: 1,
      pa: 1,
      kpa: 1000,
      psi: 6894.76,
      bar: 100000,
      atm: 101325
    }
  },
  time: {
    base: 'second',
    rates: {
      second: 1,
      seconds: 1,
      minute: 60,
      minutes: 60,
      hour: 3600,
      hours: 3600,
      day: 86400,
      days: 86400,
      week: 604800,
      weeks: 604800,
      month: 2629746, // average seconds in a month
      year: 31556952  // average seconds in a year
    }
  },
  currency: {
    base: 'USD',
    rates: {
      USD: 1,
      INR: 83.5, // Reference exchange rates
      EUR: 0.92,
      GBP: 0.78,
      CAD: 1.37,
      AUD: 1.51
    }
  }
};

export class UceConverter {
  /**
   * Normalize input values into their base units before the calculation
   * @param {Object} calculator UceCalculator config
   * @param {Object} rawInputs raw form inputs
   * @returns {Object} normalized input values
   */
  normalizeInputs(calculator, rawInputs) {
    const normalized = {};
    const inputsConfig = calculator.inputs || [];
    
    // Check if the calculator defines a general unit toggler (like bmi-units: metric/imperial)
    const unitSelectorId = calculator.units?.selectorId;
    const activeUnitSystem = unitSelectorId ? rawInputs[unitSelectorId] : null;

    inputsConfig.forEach(input => {
      let rawVal = rawInputs[input.id];
      if (rawVal === undefined) {
        rawVal = input.defaultValue !== undefined ? input.defaultValue : '';
      }

      let val = rawVal;
      const numericTypes = ['number', 'currency', 'percentage', 'slider', 'range'];

      if (numericTypes.includes(input.type)) {
        val = Utils.parseFloat(rawVal, typeof input.defaultValue === 'number' ? input.defaultValue : 0);

        // Determine units based on current system
        let unit = input.unit;
        if (activeUnitSystem && input.unitSystem) {
          unit = input.unitSystem[activeUnitSystem];
        }

        if (unit && input.unitType) {
          val = this.convertToBase(val, input.unitType, unit);
        }
      }

      normalized[input.id] = val;
    });

    // If unit selector is present, keep it in inputs list
    if (unitSelectorId) {
      normalized[unitSelectorId] = rawInputs[unitSelectorId];
    }

    return normalized;
  }

  /**
   * Convert value from input unit to standard base unit
   */
  convertToBase(value, type, unit) {
    const map = UNIT_MAPS[type];
    if (!map) return value;

    // Special handling for Temperature offsets
    if (type === 'temperature') {
      if (unit === 'fahrenheit' || unit === 'F') {
        return (value - 32) * 5/9;
      }
      if (unit === 'kelvin' || unit === 'K') {
        return value - 273.15;
      }
      return value; // Celsius is base
    }

    const rate = map.rates[unit] || 1;
    return value * rate;
  }

  /**
   * Convert value from base unit to output unit
   */
  convertFromBase(value, type, targetUnit) {
    const map = UNIT_MAPS[type];
    if (!map) return value;

    // Special handling for Temperature offsets
    if (type === 'temperature') {
      if (targetUnit === 'fahrenheit' || targetUnit === 'F') {
        return (value * 9/5) + 32;
      }
      if (targetUnit === 'kelvin' || targetUnit === 'K') {
        return value + 273.15;
      }
      return value;
    }

    const rate = map.rates[targetUnit] || 1;
    return value / rate;
  }
}

export const uceConverter = new UceConverter();
export default uceConverter;
