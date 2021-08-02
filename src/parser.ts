import { Token, Tokenizer } from "./tokenizer";
import { NUMERIC_LITERAL, PROGRAM, STRING_LITERAL } from "./types";

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
      body: this.literal(),
    };
  }

  /**
   * Literal:
   * : NumericLiteral
   * : StringLiteral
   * ;
   */
  literal(): any {
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
  numericLiteral(): any {
    const token = this._eat(NUMERIC_LITERAL);
    return { type: NUMERIC_LITERAL, value: Number(token.value) };
  }

  /**
   * StringLiteral
   * : STRING
   *
   */
  stringLiteral(): any {
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

    // Advance to the next token
    this._lookahead = this._tokenizer.next();
    return token;
  }
}
