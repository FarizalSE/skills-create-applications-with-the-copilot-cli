const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { describe, it } = require('node:test');
const { calculate, modulo, power, squareRoot } = require('../calculator.js');

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

  it('calculates modulo and exponentiation', () => {
    assert.equal(modulo(5, 2), 1);
    assert.equal(power(2, 3), 8);
    assert.equal(calculate(5, '%', 2), 1);
    assert.equal(calculate(2, '^', 3), 8);
  });

  it('calculates square roots', () => {
    assert.equal(squareRoot(16), 4);
    assert.equal(squareRoot(0), 0);
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

  it('rejects modulo by zero', () => {
    assert.throws(() => modulo(10, 0), {
      name: 'RangeError',
      message: 'Cannot calculate modulo by zero.',
    });
  });

  it('rejects square roots of negative numbers', () => {
    assert.throws(() => squareRoot(-1), {
      name: 'RangeError',
      message: 'Cannot calculate the square root of a negative number.',
    });
  });

  it('rejects unsupported operators', () => {
    assert.throws(() => calculate(2, '?', 3), {
      message: 'Unsupported operator "?". Use +, -, *, /, %, ^, or sqrt.',
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

  it('supports square root with one operand', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '16', 'sqrt'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '4\n');
    assert.equal(result.stderr, '');
  });

  it('supports modulo and exponentiation operators', () => {
    const moduloResult = spawnSync(
      process.execPath,
      [calculatorPath, '5', '%', '2'],
      { encoding: 'utf8' },
    );
    const powerResult = spawnSync(
      process.execPath,
      [calculatorPath, '2', '^', '3'],
      { encoding: 'utf8' },
    );

    assert.equal(moduloResult.status, 0);
    assert.equal(moduloResult.stdout, '1\n');
    assert.equal(moduloResult.stderr, '');
    assert.equal(powerResult.status, 0);
    assert.equal(powerResult.stdout, '8\n');
    assert.equal(powerResult.stderr, '');
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

  it('reports negative square root input', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '-1', 'sqrt'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /square root of a negative number/);
  });
});
