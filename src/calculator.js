const USAGE = 'Usage: node src/calculator.js <number> <operator> <number>\nSupported operators: +, -, *, /';

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
    default:
      throw new Error(`Unsupported operator "${operator}". Use +, -, *, or /.`);
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
  if (args.length !== 3) {
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  try {
    const [leftValue, operator, rightValue] = args;
    const result = calculate(
      parseOperand(leftValue),
      operator,
      parseOperand(rightValue),
    );
    console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate };
