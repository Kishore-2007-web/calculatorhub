/**
 * Formula Definition Language (FDL) Parser
 * Tokenizes, compiles, and evaluates infix algebraic expressions safely without eval()
 */

// Supported math functions mapping
const MATH_FUNCTIONS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log,
  exp: Math.exp,
  pow: Math.pow,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil
};

/**
 * Tokenize formula string
 * @param {string} formula 
 * @returns {string[]} tokens
 */
function tokenize(formula) {
  const regex = /\s*([A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+|[\+\-\*\/\^\(\),])\s*/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(formula)) !== null) {
    if (match[1]) tokens.push(match[1]);
  }
  return tokens;
}

/**
 * Convert Infix notation to Postfix (Shunting-yard algorithm)
 * @param {string[]} tokens 
 * @returns {string[]} postfix
 */
function shuntingYard(tokens) {
  const outputQueue = [];
  const operatorStack = [];
  
  const precedence = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3
  };

  const associativity = {
    '+': 'L', '-': 'L',
    '*': 'L', '/': 'L',
    '^': 'R'
  };

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      // Numbers
      outputQueue.push(token);
    } else if (MATH_FUNCTIONS[token]) {
      // Math functions
      operatorStack.push(token);
    } else if (token === ',') {
      // Function argument separator
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
    } else if (precedence[token]) {
      // Operators
      const op1 = token;
      let op2 = operatorStack.length ? operatorStack[operatorStack.length - 1] : null;

      while (
        op2 && precedence[op2] &&
        ((associativity[op1] === 'L' && precedence[op1] <= precedence[op2]) ||
         (associativity[op1] === 'R' && precedence[op1] < precedence[op2]))
      ) {
        outputQueue.push(operatorStack.pop());
        op2 = operatorStack.length ? operatorStack[operatorStack.length - 1] : null;
      }
      operatorStack.push(op1);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop(); // Pop '('
      
      // If function is top of stack
      if (operatorStack.length && MATH_FUNCTIONS[operatorStack[operatorStack.length - 1]]) {
        outputQueue.push(operatorStack.pop());
      }
    } else {
      // Variable names
      outputQueue.push(token);
    }
  }

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  return outputQueue;
}

/**
 * Evaluate Postfix Expression
 * @param {string[]} postfix 
 * @param {Object} context variable values
 * @returns {number} calculation result
 */
function evaluatePostfix(postfix, context) {
  const stack = [];

  for (const token of postfix) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else if (context && context[token] !== undefined) {
      stack.push(parseFloat(context[token]));
    } else if (MATH_FUNCTIONS[token]) {
      const func = MATH_FUNCTIONS[token];
      // Note: All functions here assume 1 arg except pow (which maps to operator '^' or custom math functions)
      if (token === 'pow') {
        const y = stack.pop();
        const x = stack.pop();
        stack.push(Math.pow(x, y));
      } else {
        const x = stack.pop();
        stack.push(func(x));
      }
    } else {
      // Operators
      const b = stack.pop();
      const a = stack.pop();

      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': 
          if (b === 0) throw new Error('Division by zero error in formula.');
          stack.push(a / b); 
          break;
        case '^': stack.push(Math.pow(a, b)); break;
        default:
          throw new Error(`Unknown operator/token: ${token}`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid formula expression state.');
  }

  return stack[0];
}

/**
 * Compile and run FDL formula
 * @param {string} formula 
 * @param {Object} context variables
 * @returns {number}
 */
export function evaluateFdl(formula, context) {
  if (!formula) return 0;
  const tokens = tokenize(formula);
  const postfix = shuntingYard(tokens);
  return evaluatePostfix(postfix, context);
}

export const FdlCompiler = {
  evaluate: evaluateFdl,
  tokenize,
  shuntingYard
};
