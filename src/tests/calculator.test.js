const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { describe, it } = require('node:test');
const { calculate } = require('../calculator.js');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');

describe('calculate', () => {
  it('adds the example values', () => {
    assert.equal(calculate(2, '+', 3), 5);
  });

  it('subtracts the example values', () => {
    assert.equal(calculate(10, '-', 4), 6);
  });

  it('multiplies the example values', () => {
    assert.equal(calculate(45, '*', 2), 90);
  });

  it('divides the example values', () => {
    assert.equal(calculate(20, '/', 5), 4);
  });

  it('supports negative and fractional values', () => {
    assert.equal(calculate(-1.5, '+', 0.5), -1);
    assert.equal(calculate(-3, '*', 2), -6);
  });

  it('returns zero for zero-valued calculations', () => {
    assert.equal(calculate(0, '+', 0), 0);
    assert.equal(calculate(0, '*', 12), 0);
  });

  it('rejects division by zero', () => {
    assert.throws(() => calculate(10, '/', 0), {
      name: 'RangeError',
      message: 'Cannot divide by zero.',
    });
  });

  it('rejects unsupported operators', () => {
    assert.throws(() => calculate(2, '%', 3), {
      message: 'Unsupported operator "%". Use +, -, *, or /.',
    });
  });
});

describe('calculator CLI', () => {
  it('prints the result for a valid calculation', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '2', '+', '3'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '5\n');
    assert.equal(result.stderr, '');
  });

  it('shows usage when arguments are missing', () => {
    const result = spawnSync(process.execPath, [calculatorPath], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /^Usage: node src\/calculator\.js/);
  });

  it('reports invalid operands', () => {
    const result = spawnSync(process.execPath, [calculatorPath, 'abc', '+', '1'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Operands must be valid finite numbers/);
  });

  it('reports division by zero', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '10', '/', '0'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Cannot divide by zero/);
  });
});
