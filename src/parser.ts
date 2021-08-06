import { EOF } from "dns";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import {
  ADD_OPERATOR,
  ASSIGNMENT_EXPRESSION,
  BINARY_EXPRESSION,
  BLOCK_STATEMENT,
  CLOSE_BLOCK,
  CLOSE_PARENTHESIS,
  COMMA,
  COMPLEX_ASSIGNMENT,
  EMPTY_STATE,
  EXPRESSION_STATEMENT,
  IDENTIFIER,
  LET,
  LINE_TERMINATOR,
  MULTIPLICATION_OPERATOR,
  NUMERIC_LITERAL,
  OPEN_BLOCK,
  OPEN_PARENTHESIS,
  PROGRAM,
  SIMPLE_ASSIGNMENT,
  STRING_LITERAL,
  VAR,
  VARIABLE_DECLARATION,
  VARIABLE_DECLARATOR,
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
      case LET:
        return this.declarationStatement(LET);
      case VAR:
        return this.declarationStatement(VAR);
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
   * declarationStatement:
   * : LET IDENTIFIER
   * : LET IDENTIFIER ASSIGNMENT_EXPRESSION
   * ;
   */
  declarationStatement(kind: string): Token {
    const declarationList = this.declarationList(kind);
    return {
      type: VARIABLE_DECLARATION,
      kind: kind,
      declarations: declarationList,
    };
  }

  /**
   * declarationList:
   * : VariableDeclaration
   * | VariableDeclaration COMMA declarationList
   * ;
   */
  declarationList(kind: string): Token[] {
    const declarations: Token[] = [];
    this._eat(kind);
    declarations.push(this.variableDeclaration());
    while (this._lookahead.type === COMMA) {
      this._eat(COMMA);
      declarations.push(this.variableDeclaration());
    }
    this._eat(LINE_TERMINATOR);
    return declarations;
  }

  /**
   * variableDeclaration:
   * : LET IDENTIFIER
   * ;
   */
  variableDeclaration(): Token {
    const identifier = this._eat(IDENTIFIER).value;
    let value = null;
    if (this._lookahead.type === SIMPLE_ASSIGNMENT) {
      this._eat(SIMPLE_ASSIGNMENT);
      value = this.literal();
    }
    return {
      type: VARIABLE_DECLARATOR,
      id: {
        type: IDENTIFIER,
        name: identifier,
      },
      init: value,
    };
  }

  /**
   * expression:
   * : Literal
   * ;
   */
  expression(): Token {
    return this.assignmentExpression();
  }

  /**
   * assignmentExpression:
   * : leftHandSideExpression
   * | leftHandSideExpression ASSIGNOP expression
   * ;
   */
  assignmentExpression(): Token {
    if (this._lookahead.type === IDENTIFIER) {
      const identifier = this._eat(IDENTIFIER).value;
      const operator = this.getAssignmentOperator();
      return {
        type: ASSIGNMENT_EXPRESSION,
        operator: operator,
        left: {
          type: IDENTIFIER,
          name: identifier,
        },
        right: this.expression(),
      };
    }

    return this.additiveExpression();
  }

  /**
   * getAssignmentOperator:
   * : ASSIGNOP
   * ;
   */
  getAssignmentOperator(): string | any {
    if (this._lookahead.type === SIMPLE_ASSIGNMENT) {
      return this._eat(SIMPLE_ASSIGNMENT).value;
    } else {
      return this._eat(COMPLEX_ASSIGNMENT).value;
    }
  }

  /**
   * binaryExpression:
   * : multiplicativeExpression
   * : additiveExpression
   * ;
   */
  binaryExpression(type: string, consumes: () => Token): Token {
    let left = consumes();

    while (this._lookahead.type === type) {
      const operator = this._eat(type);
      const right = consumes();

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
   * additiveExpression:
   * : multiplicativeExpression
   * | multiplicativeExpression OPERATOR Literal
   * ;
   */
  additiveExpression(): Token {
    return this.binaryExpression(
      ADD_OPERATOR,
      this.multiplicativeExpression.bind(this)
    );
  }

  /**
   * binaryExpremultiplicativeExpressionssion:
   * : multiplicativeExpression
   * | multiplicativeExpression OPERATOR Literal
   * ;
   */
  multiplicativeExpression(): Token {
    return this.binaryExpression(
      MULTIPLICATION_OPERATOR,
      this.literal.bind(this)
    );
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
