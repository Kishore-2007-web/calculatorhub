/**
 * UCE 2.1 Verification & Math Unit Tests
 */
import { FdlCompiler } from '../js/engine/utils/fdl.js';
import { dateFormulas } from '../js/engine/formulas/date.js';
import { healthFormulas } from '../js/engine/formulas/health.js';
import { financeFormulas } from '../js/engine/formulas/finance.js';
import { mathFormulas } from '../js/engine/formulas/math.js';
import { uceValidator } from '../js/engine/validation/index.js';
import { uceConverter } from '../js/engine/conversion/index.js';
import { uceFormatter } from '../js/engine/formatting/index.js';
import { uceExplanationGenerator } from '../js/engine/explanation/index.js';
import fs from 'fs';
import path from 'path';

// Load registries for configuration tests
import { healthRegistry } from '../js/engine/registry/health.js';
import { financeRegistry } from '../js/engine/registry/finance.js';
import { mathRegistry } from '../js/engine/registry/math.js';
import { dateRegistry } from '../js/engine/registry/date.js';

let failedTestsCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    failedTestsCount++;
  } else {
    console.log(`  ✅ PASS: ${message}`);
  }
}

async function runTests() {
  console.log('🧪 Running UCE 2.1 Math & Schema Test Suite...\n');

  // --- 1. FDL COMPILER TESTS ---
  console.log('1. FDL Parser Tests:');
  try {
    const sum = FdlCompiler.evaluate('val_a + val_b', { 'val_a': 25, 'val_b': 5 });
    assert(sum === 30, `FDL basic addition (25 + 5 = ${sum})`);

    const average = FdlCompiler.evaluate('(a + b) / 2', { a: 10, b: 20 });
    assert(average === 15, `FDL parenthesized average ((10 + 20)/2 = ${average})`);

    const complex = FdlCompiler.evaluate('sqrt(a * b)', { a: 4, b: 9 });
    assert(complex === 6, `FDL math function evaluation (sqrt(4 * 9) = ${complex})`);

    const power = FdlCompiler.evaluate('pow(a, b)', { a: 2, b: 3 });
    assert(power === 8, `FDL exponent pow() evaluation (pow(2, 3) = ${power})`);
  } catch (err) {
    console.error('❌ Crash in FDL Tests:', err);
    failedTestsCount++;
  }

  // --- 2. DATE FORMULA TESTS ---
  console.log('\n2. Date Formula Tests:');
  try {
    const age = dateFormulas['age-calculator']({
      'birth-date': '1995-06-15',
      'target-date': '2026-07-15'
    });
    assert(age.years === 31, `Age years calculation (Expected 31, got ${age.years})`);
    assert(age['months-remain'] === 1, `Age remaining months (Expected 1, got ${age['months-remain']})`);
    assert(age['days-remain'] === 0, `Age remaining days (Expected 0, got ${age['days-remain']})`);
    assert(age.months === 373, `Age total months (Expected 373, got ${age.months})`);
  } catch (err) {
    console.error('❌ Crash in Date Formula Tests:', err);
    failedTestsCount++;
  }

  // --- 3. HEALTH FORMULA TESTS ---
  console.log('\n3. Health Formula Tests:');
  try {
    const bmi = healthFormulas['bmi-calculator']({
      'bmi-weight': 70, // kg
      'bmi-height': 1.75 // m
    });
    const roundedBmi = parseFloat(bmi.toFixed(1));
    assert(roundedBmi === 22.9, `BMI calculation (Expected 22.9, got ${roundedBmi})`);

    const bmr = healthFormulas['bmr-calculator']({
      'bmr-gender': 'male',
      'bmr-weight': 70,
      'bmr-height': 175,
      'bmr-age': 25
    });
    assert(bmr === 1673.75, `BMR Male Mifflin-St Jeor (Expected 1673.75, got ${bmr})`);
  } catch (err) {
    console.error('❌ Crash in Health Formula Tests:', err);
    failedTestsCount++;
  }

  // --- 4. FINANCE FORMULA TESTS ---
  console.log('\n4. Finance Formula Tests:');
  try {
    const emi = financeFormulas['emi-calculator']({
      'emi-amount': 10000,
      'emi-rate': 7.5,
      'emi-tenure': 5
    });
    const roundedEmi = parseFloat(emi.emi.toFixed(2));
    assert(roundedEmi === 200.38, `EMI monthly payment (Expected 200.38, got ${roundedEmi})`);
    assert(parseFloat(emi.interest.toFixed(2)) === 2022.77, `EMI total interest (Expected 2022.77, got ${emi.interest.toFixed(2)})`);

    const gstAdd = financeFormulas['gst-calculator']({
      'gst-amount': 1000,
      'gst-rate': 18,
      'gst-action': 'add'
    });
    assert(gstAdd.tax === 180, `GST tax added (Expected 180, got ${gstAdd.tax})`);
    assert(gstAdd.gross === 1180, `GST gross total added (Expected 1180, got ${gstAdd.gross})`);

    const gstRemove = financeFormulas['gst-calculator']({
      'gst-amount': 1180,
      'gst-rate': 18,
      'gst-action': 'remove'
    });
    assert(Math.round(gstRemove.net) === 1000, `GST net removed (Expected 1000, got ${gstRemove.net})`);
  } catch (err) {
    console.error('❌ Crash in Finance Formula Tests:', err);
    failedTestsCount++;
  }

  // --- 5. MATH FORMULA TESTS ---
  console.log('\n5. Math Formula Tests:');
  try {
    const pctOf = mathFormulas['percentage-calculator']({
      'pct-type': 'of',
      'pct-x': 20,
      'pct-y': 150
    });
    assert(pctOf === 30, `Percentage of (20% of 150 = 30)`);

    const pctIs = mathFormulas['percentage-calculator']({
      'pct-type': 'is',
      'pct-x': 30,
      'pct-y': 150
    });
    assert(pctIs === 20, `Percentage is (30 is 20% of 150)`);

    const pctChange = mathFormulas['percentage-calculator']({
      'pct-type': 'change',
      'pct-x': 100,
      'pct-y': 150
    });
    assert(pctChange === 50, `Percentage change (100 to 150 = 50% increase)`);

    const simpleVal = mathFormulas['simple-calculator']({ expression: '25 + 5 * 2' });
    assert(simpleVal === 35, `Pocket Simple Calculator evaluation (25 + 5 * 2 = ${simpleVal})`);

    const sciVal = mathFormulas['scientific-calculator']({ expression: 'sqrt(64) + sin(0) + pow(2, 3)' });
    assert(sciVal === 16, `Pocket Scientific Calculator evaluation (sqrt(64) + sin(0) + pow(2, 3) = ${sciVal})`);

    const fallbackSqrt = mathFormulas._fallback('square-root-calculator', { val_a: 9 });
    assert(fallbackSqrt === 3, `Fallback square root calculator (Expected 3, got ${fallbackSqrt})`);

    const fallbackGcd = mathFormulas._fallback('gcd-calculator', { val_a: 12, val_b: 8 });
    assert(fallbackGcd === 4, `Fallback GCD calculator (Expected 4, got ${fallbackGcd})`);

    const fallbackPrime = mathFormulas._fallback('prime-number-checker', { val_a: 7 });
    assert(fallbackPrime === 1, `Fallback prime checker (Expected 1, got ${fallbackPrime})`);

    // Added Math Calculator Tests
    const fractionResult = mathFormulas['fraction-calculator']({
      'frac-op': '+', 'frac-n1': 1, 'frac-d1': 2, 'frac-n2': 1, 'frac-d2': 3
    });
    assert(fractionResult.result === '5/6', `Fraction addition (1/2 + 1/3 = ${fractionResult.result})`);

    const matrixResult = mathFormulas['matrix-calculator']({
      'matrix-op': 'add', a11: 1, a12: 2, a21: 3, a22: 4, b11: 5, b12: 6, b21: 7, b22: 8
    });
    assert(matrixResult.result.includes('[ 6.00, 8.00 ]'), `Matrix addition (1,2;3,4 + 5,6;7,8 = ${matrixResult.result})`);

    const pctDiff = mathFormulas['percentage-difference-calculator']({ val_a: 10, val_b: 15 });
    assert(Math.abs(pctDiff - 40) < 0.01, `Percentage Difference (10 & 15 = ${pctDiff}%)`);

    const pctInc = mathFormulas['percentage-increase-calculator']({ val_a: 10, val_b: 15 });
    assert(pctInc === 50, `Percentage Increase (10 to 15 = ${pctInc}%)`);

    const pctDec = mathFormulas['percentage-decrease-calculator']({ val_a: 15, val_b: 10 });
    assert(Math.abs(pctDec - 33.33) < 0.01, `Percentage Decrease (15 to 10 = ${pctDec}%)`);

    // Added more Math tests
    const algebraVal = mathFormulas['algebra-calculator']({ expression: '3 * x + 5', 'x-val': 4 });
    assert(algebraVal === 17, `Algebra evaluation (3x+5 at x=4 = ${algebraVal})`);

    const quadraticResult = mathFormulas['quadratic-equation-solver']({ 'eq-a': 1, 'eq-b': -5, 'eq-c': 6 });
    assert(quadraticResult.result.includes('x1 = 3.0000'), `Quadratic root x1 is 3 (Result: ${quadraticResult.result})`);

    const logVal = mathFormulas['logarithm-calculator']({ val_a: 100, 'log-base': '10' });
    assert(logVal === 2, `Logarithm base 10 of 100 is 2 (Result: ${logVal})`);

    const antilogVal = mathFormulas['antilogarithm-calculator']({ val_a: 3, 'log-base': '10' });
    assert(antilogVal === 1000, `Antilogarithm base 10 of 3 is 1000 (Result: ${antilogVal})`);

    const binVal = mathFormulas['binary-converter']({ 'num-val': '10', 'conv-dir': 'dec-to-bin' });
    assert(binVal.result === '1010', `Binary converter 10 is 1010 (Result: ${binVal.result})`);

    const hexVal = mathFormulas['hex-converter']({ 'num-val': '255', 'conv-dir': 'dec-to-hex' });
    assert(hexVal.result === 'FF', `Hex converter 255 is FF (Result: ${hexVal.result})`);

    const baseVal = mathFormulas['base-converter']({ 'num-val': 'A', 'from-base': 16, 'to-base': 10 });
    assert(baseVal.result === '10', `Base converter A (16) to 10 is 10 (Result: ${baseVal.result})`);

    const fibVal = mathFormulas['fibonacci-calculator']({ val_a: 6 });
    assert(fibVal.result === 8, `Fibonacci index 6 is 8 (Result: ${fibVal.result})`);

    // Added Batch 3 tests
    const trigVal = mathFormulas['trigonometry-calculator']({ val_a: 30, 'trig-func': 'sin', 'angle-unit': 'degrees' });
    assert(Math.abs(trigVal - 0.5) < 0.01, `Trig sin(30 deg) is 0.5 (Result: ${trigVal})`);

    const sinVal = mathFormulas['sine-calculator']({ val_a: 30, 'angle-unit': 'degrees' });
    assert(Math.abs(sinVal - 0.5) < 0.01, `Sine 30 deg is 0.5 (Result: ${sinVal})`);

    const cosVal = mathFormulas['cosine-calculator']({ val_a: 60, 'angle-unit': 'degrees' });
    assert(Math.abs(cosVal - 0.5) < 0.01, `Cosine 60 deg is 0.5 (Result: ${cosVal})`);

    const tanVal = mathFormulas['tangent-calculator']({ val_a: 45, 'angle-unit': 'degrees' });
    assert(Math.abs(tanVal - 1.0) < 0.01, `Tangent 45 deg is 1.0 (Result: ${tanVal})`);

    const divVal = mathFormulas['division-calculator']({ val_a: 10, val_b: 3 });
    assert(divVal.remainder === 1, `Division 10/3 remainder is 1 (Result: ${divVal.remainder})`);

    const expVal = mathFormulas['exponent-calculator']({ val_a: 2, val_b: 3 });
    assert(expVal === 8, `Exponent 2^3 is 8 (Result: ${expVal})`);

    const sqrtVal = mathFormulas['square-root-calculator']({ val_a: 16 });
    assert(sqrtVal === 4, `Square Root of 16 is 4 (Result: ${sqrtVal})`);

    const cbrtVal = mathFormulas['cube-root-calculator']({ val_a: 27 });
    assert(cbrtVal === 3, `Cube Root of 27 is 3 (Result: ${cbrtVal})`);

    const piVal = mathFormulas['pi-calculator']({ digits: 5 });
    assert(piVal.result === '3.14159', `Pi to 5 digits is 3.14159 (Result: ${piVal.result})`);

    const primeVal = mathFormulas['prime-number-checker']({ val_a: 17 });
    assert(primeVal === 'Prime Number', `Prime checker 17 is Prime (Result: ${primeVal})`);

    const fracToDecVal = mathFormulas['fraction-to-decimal']({ 'frac-n': 3, 'frac-d': 4 });
    assert(fracToDecVal === 0.75, `Fraction to decimal 3/4 is 0.75 (Result: ${fracToDecVal})`);

    const decToFracVal = mathFormulas['decimal-to-fraction']({ 'dec-val': 0.75 });
    assert(decToFracVal.result === '3/4', `Decimal to fraction 0.75 is 3/4 (Result: ${decToFracVal.result})`);
  } catch (err) {
    console.error('❌ Crash in Math Formula Tests:', err);
    failedTestsCount++;
  }

  // --- 6. REGISTRY SCHEMA VALIDATION TESTS ---
  console.log('\n6. Registry Config Schema Tests:');
  try {
    const allRegistries = [...healthRegistry, ...financeRegistry, ...mathRegistry, ...dateRegistry];
    allRegistries.forEach(config => {
      assert(config.id !== undefined, `Config has id: ${config.id}`);
      assert(config.version !== undefined, `Config ${config.id} has version v${config.version}`);
      assert(Array.isArray(config.inputs), `Config ${config.id} has inputs array`);
      assert(Array.isArray(config.outputs), `Config ${config.id} has outputs array`);
      assert(['fdl', 'function', 'advanced'].includes(config.formulaType), `Config ${config.id} has valid formulaType`);
    });
  } catch (err) {
    console.error('❌ Crash in Registry Schema Tests:', err);
    failedTestsCount++;
  }

  // --- 7. UNIT NORMALIZATION TESTS ---
  console.log('\n7. Unit Normalization Tests:');
  try {
    // Convert 10 lbs weight to kg
    const kg = uceConverter.convertToBase(10, 'weight', 'lb');
    assert(Math.abs(kg - 4.5359) < 0.001, `Converted 10 lbs to kg (Expected 4.5359, got ${kg})`);

    // Convert 12 inches length to meters
    const m = uceConverter.convertToBase(12, 'length', 'inch');
    assert(Math.abs(m - 0.3048) < 0.001, `Converted 12 inches to meters (Expected 0.3048, got ${m})`);

    // Convert 32 Fahrenheit to Celsius
    const c = uceConverter.convertToBase(32, 'temperature', 'fahrenheit');
    assert(c === 0, `Converted 32F to Celsius (Expected 0, got ${c})`);
  } catch (err) {
    console.error('❌ Crash in Unit Normalization Tests:', err);
    failedTestsCount++;
  }

  // --- Summary ---
  console.log('\n=============================');
  console.log(`TEST EXECUTION SUMMARY`);
  console.log(`Failed Tests: ${failedTestsCount}`);
  if (failedTestsCount === 0) {
    console.log(`Result: SUCCESS 🎉`);
  } else {
    console.error(`Result: FAILED ❌`);
    process.exit(1);
  }
  console.log('=============================');
}

runTests().catch(err => {
  console.error('Tests runner crashed: ', err);
  process.exit(1);
});
