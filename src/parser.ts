import { EOF } from "dns";
import { Token, Tokenizer } from "./tokenizer";
import {
  BLOCK_STATEMENT,
  CLOSE_BLOCK,
  EXPRESSION_STATEMENT,
  LINE_TERMINATOR,
  NUMERIC_LITERAL,
  OPEN_BLOCK,
  PROGRAM,
  STRING_LITERAL,
} from "./types";

/**
 * Parser : Recursive Decent Implementation
 */
export class Parser {
  _value: string;
  _tokenizer: Tokenizer;
  _lookahead: Token;
  /**
   * Parse string into AST
   */
  parse(str) {
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
  program(): any {
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
  statementList(terminator?): any[] {
    const statements: any[] = [];
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
  statement(): any {
    if (this._lookahead.type === OPEN_BLOCK) {
      return this.blockStatement();
    }
    return this.expressionStatement();
  }

  /**
   * blockStatement:
   * : OPEN_BLOCK StatementList CLOSE_BLOCK
   * ;
   */
  blockStatement(): any {
    return { type: BLOCK_STATEMENT, body: this.blockStatementList() };
  }

  /**
   * blockStatementList:
   * : Statement
   * | Statement StatementList
   * ;
   */
  blockStatementList(): any[] {
    this._eat(OPEN_BLOCK);
    const statements = this.statementList(CLOSE_BLOCK);
    this._eat(CLOSE_BLOCK);
    return statements;
  }

  /**
   * expressionStatement:
   * : Expression ;
   * ;
   */
  expressionStatement(): any {
    const expression = this.expression();
    this._eat(LINE_TERMINATOR);
    return { type: EXPRESSION_STATEMENT, expression };
  }

  /**
   * expression:
   * : Literal
   * ;
   */
  expression(): any {
    return this.literal();
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
