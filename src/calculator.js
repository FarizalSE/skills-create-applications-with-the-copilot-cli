const USAGE = 'Usage: node src/calculator.js <number> <operator> [number]\nSupported operators: +, -, *, /, %, ^, sqrt (sqrt uses one number)';

function modulo(a, b) {
  if (b === 0) {
    throw new RangeError('Cannot calculate modulo by zero.');
  }
  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new RangeError('Cannot calculate the square root of a negative number.');
  }
  return Math.sqrt(n);
}

function calculate(left, operator, right) {
  switch (operator) {
    // Addition combines two numbers.
    case '+':
      return left + right;
    // Subtraction finds the difference between two numbers.
    case '-':
      return left - right;
    // Multiplication scales one number by another.
    case '*':
      return left * right;
    // Division splits one number by another.
    case '/':
      if (right === 0) {
        throw new RangeError('Cannot divide by zero.');
      }
      return left / right;
    case '%':
      return modulo(left, right);
    case '^':
      return power(left, right);
    default:
      throw new Error(`Unsupported operator "${operator}". Use +, -, *, /, %, ^, or sqrt.`);
  }
}

function parseOperand(value) {
  if (value.trim() === '') {
    throw new Error('Operands must be valid finite numbers.');
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error('Operands must be valid finite numbers.');
  }
  return number;
}

function main(args) {
  const isSquareRoot = args.length === 2 && args[1] === 'sqrt';
  if (args.length !== 3 && !isSquareRoot) {
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  try {
    const [leftValue, operator, rightValue] = args;
    const left = parseOperand(leftValue);
    const result = isSquareRoot
      ? squareRoot(left)
      : calculate(left, operator, parseOperand(rightValue));
    console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate, modulo, power, squareRoot };
