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
  ELSE_STATEMENT,
  EMPTY_STATE,
  EQUALITY_OPERATOR,
  EXPRESSION_STATEMENT,
  IDENTIFIER,
  IF_STATEMENT,
  LET,
  LINE_TERMINATOR,
  MULTIPLICATION_OPERATOR,
  NUMERIC_LITERAL,
  OPEN_BLOCK,
  OPEN_PARENTHESIS,
  PROGRAM,
  RELATIONAL_OPERATOR,
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
      case IF_STATEMENT:
        return this.ifStatement();
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
   * ifStatement:
   * : IF OPEN_PARENTHESIS Expression CLOSE_PARENTHESIS Statement
   * | IF OPEN_PARENTHESIS Expression CLOSE_PARENTHESIS Statement ELSE Statement
   * ;
   */
  ifStatement(): Token {
    this._eat(IF_STATEMENT);
    this._eat(OPEN_PARENTHESIS);
    const condition = this.assignmentExpression();
    this._eat(CLOSE_PARENTHESIS);
    const consequent = this.statement();
    const alternate = this.elseStatement();
    return {
      type: IF_STATEMENT,
      test: condition,
      consequent: consequent,
      alternate: alternate,
    };
  }

  /**
   * elseStatement:
   * : ELSE Statement
   * ;
   */
  elseStatement(): Token | null {
    if (this._lookahead.type === ELSE_STATEMENT) {
      this._eat(ELSE_STATEMENT);
      return this.statement();
    }
    return null;
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
    const identifier = this.identifier();
    let value = null;
    if (this._lookahead.type === SIMPLE_ASSIGNMENT) {
      this._eat(SIMPLE_ASSIGNMENT);
      value = this.expression();
    }
    return {
      type: VARIABLE_DECLARATOR,
      id: identifier,
      init: value,
    };
  }

  /**
   * identifier:
   * : IDENTIFIER
   * ;
   */
  identifier(): Token {
    return {
      type: IDENTIFIER,
      name: this._eat(IDENTIFIER).value,
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
    const left = this.equalityExpression();
    if (!this.isAssignmentOperator()) {
      return left;
    }
    const operator = this.getAssignmentOperator();
    return {
      type: ASSIGNMENT_EXPRESSION,
      operator: operator,
      left: left,
      right: this.assignmentExpression(),
    };
  }

  /**
   * isAssignmentOperator:
   * : ASSIGNOP
   * ;
   */
  isAssignmentOperator(): boolean {
    return (
      this._lookahead.type === SIMPLE_ASSIGNMENT ||
      this._lookahead.type === COMPLEX_ASSIGNMENT
    );
  }

  /**
   * getAssignmentOperator:
   * : ASSIGNOP
   * ;
   */
  getAssignmentOperator(): string {
    return this._lookahead.type === SIMPLE_ASSIGNMENT
      ? this._eat(SIMPLE_ASSIGNMENT).value
      : this._eat(COMPLEX_ASSIGNMENT).value;
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
   * equalityExpression:
   * : equalityExpression
   * | equalityExpression RELOP binaryExpression
   * ;
   */
  equalityExpression(): Token {
    return this.binaryExpression(
      EQUALITY_OPERATOR,
      this.relationalExpression.bind(this)
    );
  }

  /**
   * relationalExpression:
   * : binaryExpression
   * | binaryExpression RELOP binaryExpression
   * ;
   */
  relationalExpression(): Token {
    return this.binaryExpression(
      RELATIONAL_OPERATOR,
      this.additiveExpression.bind(this)
    );
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
      this.primaryExpression.bind(this)
    );
  }

  /**
   * primaryExpression:
   * : Literal
   * | IDENTIFIER
   * | OPEN_PARENTHESIS Expression CLOSE_PARENTHESIS
   * ;
   */
  primaryExpression(): Token {
    if (this._lookahead.type === IDENTIFIER) {
      return this.identifier();
    } else if (this._lookahead.type === OPEN_PARENTHESIS) {
      return this.parenthesisExpression();
    } else {
      return this.literal();
    }
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
