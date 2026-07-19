/**
 * Formula Definition Language (FDL) Parser & Compiler
 * Compiles mathematical formulas into an Abstract Syntax Tree (AST) and evaluates them.
 * Supports unary operations, exponents, decimals, scientific notation, nested brackets, and custom functions.
 */

const MATH_FUNCTIONS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  log: Math.log10, // log(x) is base-10
  ln: Math.log,    // ln(x) is natural log
  exp: Math.exp,
  pow: Math.pow,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  max: Math.max,
  min: Math.min
};

const FUNCTION_ARG_COUNTS = {
  sqrt: 1,
  abs: 1,
  sin: 1,
  cos: 1,
  tan: 1,
  asin: 1,
  acos: 1,
  atan: 1,
  log: 1,
  ln: 1,
  exp: 1,
  pow: 2,
  round: 1,
  floor: 1,
  ceil: 1,
  max: [1, 2, 3, 4, 5],
  min: [1, 2, 3, 4, 5]
};

/**
 * Tokenize formula string
 */
export function tokenize(formula) {
  const regex = /\s*(?:([0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)|([A-Za-z_][A-Za-z0-9_]*)|([\+\-\*\/\^\(\),]))/g;
  const tokens = [];
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(formula)) !== null) {
    const gap = formula.substring(lastIndex, match.index).trim();
    if (gap.length > 0) {
      throw new Error(`FDL_001: Invalid token/character "${gap}" at position ${lastIndex}`);
    }
    const token = match[1] || match[2] || match[3];
    if (token) tokens.push(token);
    lastIndex = regex.lastIndex;
  }

  const remaining = formula.substring(lastIndex).trim();
  if (remaining.length > 0) {
    throw new Error(`FDL_001: Invalid token/character "${remaining}" at position ${lastIndex}`);
  }

  return tokens;
}

/**
 * AST Recursive Descent Parser
 */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  next() {
    return this.pos < this.tokens.length ? this.tokens[this.pos++] : null;
  }

  parse() {
    if (this.tokens.length === 0) {
      throw new Error('FDL_001: Empty expression');
    }
    const node = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error(`FDL_001: Unexpected trailing token "${this.peek()}" at index ${this.pos}`);
    }
    return node;
  }

  parseExpression() {
    return this.parseAdditive();
  }

  parseAdditive() {
    let node = this.parseMultiplicative();
    while (true) {
      const token = this.peek();
      if (token === '+' || token === '-') {
        this.next();
        const right = this.parseMultiplicative();
        node = { type: 'Binary', operator: token, left: node, right: right };
      } else {
        break;
      }
    }
    return node;
  }

  parseMultiplicative() {
    let node = this.parseExponent();
    while (true) {
      const token = this.peek();
      if (token === '*' || token === '/') {
        this.next();
        const right = this.parseExponent();
        node = { type: 'Binary', operator: token, left: node, right: right };
      } else {
        break;
      }
    }
    return node;
  }

  parseExponent() {
    let node = this.parseUnary();
    if (this.peek() === '^') {
      this.next();
      const right = this.parseExponent(); // Right-associative exponentiation
      node = { type: 'Binary', operator: '^', left: node, right: right };
    }
    return node;
  }

  parseUnary() {
    const token = this.peek();
    if (token === '+' || token === '-') {
      this.next();
      const arg = this.parseUnary();
      return { type: 'Unary', operator: token, argument: arg };
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.next();
    if (!token) {
      throw new Error('FDL_003: Unexpected end of expression');
    }

    if (token === '(') {
      const node = this.parseExpression();
      if (this.next() !== ')') {
        throw new Error('FDL_003: Missing closing parenthesis ")"');
      }
      return node;
    }

    // Number constant check
    if (!isNaN(parseFloat(token))) {
      return { type: 'Number', value: parseFloat(token) };
    }

    // Function check
    const lowerToken = token.toLowerCase();
    if (MATH_FUNCTIONS[lowerToken]) {
      if (this.next() !== '(') {
        throw new Error(`FDL_003: Expected open parenthesis "(" after function name "${token}"`);
      }
      const args = [];
      if (this.peek() !== ')') {
        args.push(this.parseExpression());
        while (this.peek() === ',') {
          this.next(); // Consume ','
          args.push(this.parseExpression());
        }
      }
      if (this.next() !== ')') {
        throw new Error(`FDL_003: Missing closing parenthesis in function call to "${token}"`);
      }

      // Assert parameter validation bounds
      const expectedArgs = FUNCTION_ARG_COUNTS[lowerToken];
      if (expectedArgs !== undefined) {
        if (Array.isArray(expectedArgs)) {
          if (!expectedArgs.includes(args.length)) {
            throw new Error(`FDL_002: Incorrect argument count for "${token}". Expected ${expectedArgs.join(' or ')} but got ${args.length}`);
          }
        } else if (args.length !== expectedArgs) {
          throw new Error(`FDL_002: Incorrect argument count for "${token}". Expected ${expectedArgs} but got ${args.length}`);
        }
      }

      return { type: 'Function', name: lowerToken, args };
    }

    // Numeric constants values
    if (lowerToken === 'pi') {
      return { type: 'Number', value: Math.PI };
    }
    if (lowerToken === 'e') {
      return { type: 'Number', value: Math.E };
    }

    // Identifiers (Variables)
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
      return { type: 'Variable', name: token };
    }

    throw new Error(`FDL_001: Invalid token or character "${token}"`);
  }
}

/**
 * Compile expression to AST
 */
export function compile(formula) {
  const tokens = tokenize(formula);
  const parser = new Parser(tokens);
  return parser.parse();
}

/**
 * Evaluate Compiled AST against context variables
 */
function evaluateAST(node, context) {
  switch (node.type) {
    case 'Number':
      return node.value;
    case 'Variable':
      if (context && context[node.name] !== undefined) {
        return parseFloat(context[node.name]);
      }
      throw new Error(`MATH_001: Undefined variable "${node.name}" in execution context`);
    case 'Unary': {
      const val = evaluateAST(node.argument, context);
      return node.operator === '-' ? -val : val;
    }
    case 'Binary': {
      const left = evaluateAST(node.left, context);
      const right = evaluateAST(node.right, context);
      switch (node.operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/':
          if (right === 0) throw new Error('MATH_001: Division by zero');
          return left / right;
        case '^': return Math.pow(left, right);
        default:
          throw new Error(`FDL_001: Unknown binary operator "${node.operator}"`);
      }
    }
    case 'Function': {
      const argsEvaluated = node.args.map(arg => evaluateAST(arg, context));
      const fn = MATH_FUNCTIONS[node.name];
      if (typeof fn !== 'function') {
        throw new Error(`FDL_002: Unknown function "${node.name}"`);
      }
      return fn(...argsEvaluated);
    }
    default:
      throw new Error(`FDL_001: Unknown AST node type "${node.type}"`);
  }
}

/**
 * Standard evaluate interface
 */
export function evaluateFdl(formula, context) {
  if (!formula) return 0;
  const ast = compile(formula);
  return evaluateAST(ast, context);
}

export const FdlCompiler = {
  compile,
  evaluate: evaluateFdl,
  evaluateAST,
  tokenize
};
