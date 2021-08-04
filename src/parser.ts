import { EOF } from "dns";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import {
  ADD_OPERATOR,
  BINARY_EXPRESSION,
  BLOCK_STATEMENT,
  CLOSE_BLOCK,
  CLOSE_PARENTHESIS,
  EMPTY_STATE,
  EXPRESSION_STATEMENT,
  LINE_TERMINATOR,
  MULTIPLICATION_OPERATOR,
  NUMERIC_LITERAL,
  OPEN_BLOCK,
  OPEN_PARENTHESIS,
  PROGRAM,
  STRING_LITERAL,
} from "./types";

/**
 * Parser : Recursive Decent Implementation
 */
export class Parser {
  _value!: string;
  _tokenizer!: Tokenizer;
  _lookahead!: Token;
  /**
   * Parse string into AST
   */
  parse(str: string): Token {
    this._value = str;
    this._tokenizer = new Tokenizer(str);

    // Prime the first token for predictive parsing
    this._lookahead = this._tokenizer.next();

    return this.program();
  }

  /**
   * Program:
   *  :NumericLiteral
   *  ;
   */
  program(): Token {
    return {
      type: PROGRAM,
      body: this.statementList(),
    };
  }

  /**
   * StatementList:
   * : Statement
   * | Statement StatementList
   * ;
   */
  statementList(terminator?: string): Token[] {
    const statements: Token[] = [];
    while (
      this._lookahead.type !== EOF &&
      (!terminator || this._lookahead.type !== terminator)
    ) {
      statements.push(this.statement());
    }
    return statements;
  }

  /**
   * statement:
   * : ExpressionStatement
   * | BlockStatement
   * ;
   */
  statement(): Token {
    switch (this._lookahead.type) {
      case OPEN_BLOCK:
        return this.blockStatement();
      case LINE_TERMINATOR:
        return this.emptyStatement();
      default:
        return this.expressionStatement();
    }
  }

  /**
   * emptyStatement:
   * : ;
   * ;
   */
  emptyStatement(): Token {
    this._eat(LINE_TERMINATOR);
    return { type: EMPTY_STATE };
  }
  /**
   * blockStatement:
   * : OPEN_BLOCK StatementList CLOSE_BLOCK
   * ;
   */
  blockStatement(): Token {
    this._eat(OPEN_BLOCK);
    const statements = this.statementList(CLOSE_BLOCK);
    this._eat(CLOSE_BLOCK);
    return { type: BLOCK_STATEMENT, body: statements };
  }

  /**
   * expressionStatement:
   * : Expression ;
   * ;
   */
  expressionStatement(): Token {
    const expression = this.expression();
    this._eat(LINE_TERMINATOR);
    return { type: EXPRESSION_STATEMENT, expression };
  }

  /**
   * expression:
   * : Literal
   * ;
   */
  expression(): Token {
    return this.binaryAdditiveExpression();
  }

  /**
   * binaryExpression:
   * : multiplicativeExpression
   * | multiplicativeExpression OPERATOR Literal
   * ;
   */
  binaryAdditiveExpression(): Token {
    let left = this.multiplicativeExpression();

    while (this._lookahead.type === ADD_OPERATOR) {
      const operator = this._eat(ADD_OPERATOR);
      const right = this.multiplicativeExpression();

      left = {
        type: BINARY_EXPRESSION,
        operator: operator.value,
        left,
        right,
      };
    }
    return left;
  }

  /**
   * binaryExpremultiplicativeExpressionssion:
   * : multiplicativeExpression
   * | multiplicativeExpression OPERATOR Literal
   * ;
   */
  multiplicativeExpression(): Token {
    let left = this.literal();

    while (this._lookahead.type === MULTIPLICATION_OPERATOR) {
      const operator = this._eat(MULTIPLICATION_OPERATOR);
      const right = this.literal();

      left = {
        type: BINARY_EXPRESSION,
        operator: operator.value,
        left,
        right,
      };
    }
    return left;
  }

  /**
   * Literal:
   * : NumericLiteral
   * : StringLiteral
   * ;
   */
  literal(): Token {
    const token = this._lookahead;
    let type = null;

    switch (token.type) {
      case NUMERIC_LITERAL:
        type = this.numericLiteral();
        break;
      case STRING_LITERAL:
        type = this.stringLiteral();
        break;
      case OPEN_PARENTHESIS:
        type = this.parenthesisExpression();
        break;
      default:
        throw new Error(`unexpected token '${token.value}'`);
    }
    return type;
  }

  /**
   * NumericLiteral
   *  :Number
   *  ;
   */
  numericLiteral(): Token {
    const token = this._eat(NUMERIC_LITERAL);
    return { type: NUMERIC_LITERAL, value: Number(token.value) };
  }

  /**
   * StringLiteral
   * : STRING
   *
   */
  stringLiteral(): Token {
    const token = this._eat(STRING_LITERAL);
    return { type: STRING_LITERAL, value: token.value };
  }

  /**
   * parenthesisExpression:
   * : OPEN_PARENTHESIS expression CLOSE_PARENTHESIS
   * ;
   */
  parenthesisExpression(): Token {
    this._eat(OPEN_PARENTHESIS);
    const expression = this.expression();
    this._eat(CLOSE_PARENTHESIS);
    return expression;
  }

  /**
   * _eat:
   * : return token and fetch next token
   * ;
   */
  _eat(type: string): Token {
    const token = this._lookahead;

    if (!token || token.type !== type) {
      throw new Error(`unexpected EOF, expected '${type}'`);
    }

    // Advance to the next token
    this._lookahead = this._tokenizer.next();
    return token;
  }
}
