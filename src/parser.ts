import { EOF } from "dns";
import { CallExpression, MemberExpression, Token } from "./token";
import { Tokenizer } from "./tokenizer";
import {
  ADD_OPERATOR,
  ASSIGNMENT_EXPRESSION,
  BINARY_EXPRESSION,
  BLOCK_STATEMENT,
  BOOLEAN_LITERAL,
  CALL_EXPRESSION,
  CLOSE_BLOCK,
  CLOSE_PARENTHESIS,
  COMMA,
  COMPLEX_ASSIGNMENT,
  DO_STATEMENT,
  ELSE_STATEMENT,
  EMPTY_STATE,
  EQUALITY_OPERATOR,
  EXPRESSION_STATEMENT,
  FOR_STATEMENT,
  FUNCTION_DECLARATION,
  IDENTIFIER,
  IF_STATEMENT,
  LAMBDA_EXPRESSION,
  LET,
  LINE_TERMINATOR,
  LOGICAL_AND_OPERATOR,
  LOGICAL_NOT,
  LOGICAL_OR_OPERATOR,
  MEMBER_EXPRESSION,
  MEMBER_OPERATOR,
  MINUS_OPERATOR,
  MULTIPLICATION_OPERATOR,
  NULL_LITERAL,
  NUMERIC_LITERAL,
  OPEN_BLOCK,
  OPEN_PARENTHESIS,
  PLUS_OPERATOR,
  PROGRAM,
  RELATIONAL_OPERATOR,
  RETURN_STATEMENT,
  SIMPLE_ASSIGNMENT,
  STRING_LITERAL,
  TRUE,
  UNARY_EXPRESSION,
  VAR,
  VARIABLE_DECLARATION,
  VARIABLE_DECLARATOR,
  WHILE_STATEMENT,
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
   * | declarationStatement
   * | ifStatement
   * | iteration
   * | emptyStatement
   * | functionDeclaration
   * ;
   */
  statement(): Token {
    switch (this._lookahead.type) {
      case OPEN_BLOCK:
        return this.blockStatement();
      case LINE_TERMINATOR:
        return this.emptyStatement();
      case LET:
      case VAR:
        return this.declarationStatement(this._lookahead.type);
      case IF_STATEMENT:
        return this.ifStatement();
      case WHILE_STATEMENT:
      case DO_STATEMENT:
      case FOR_STATEMENT:
        return this.iteration();
      case FUNCTION_DECLARATION:
        return this.functionDeclaration();
      case RETURN_STATEMENT:
        return this.returnStatement();
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
   * returnStatement:
   * : RETURN Expression
   * ;
   */
  returnStatement(): Token {
    this._eat(RETURN_STATEMENT);
    const expression =
      this._lookahead.type !== LINE_TERMINATOR ? this.expression() : null;
    this._eat(LINE_TERMINATOR);
    return { type: RETURN_STATEMENT, argument: expression };
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
   * iteration:
   * : WHILE ( Expression ) StatementBlock
   * | DO StatementBlock WHILE { Expression }
   * | FOR ( ForInit ForExpr ForIncr ForEnd ) StatementBlock
   * ;
   */
  iteration(): Token {
    const type = this._lookahead.type;

    if (type === WHILE_STATEMENT) {
      return this.whileStatement();
    } else if (type === DO_STATEMENT) {
      return this.doStatement();
    } else {
      return this.forStatement();
    }
  }

  /**
   * functionDeclaration:
   * : function IDENTIFIER ( ParameterList ) Block
   * ; function IDENTIFIER ( ) Block
   * ;
   */
  functionDeclaration(): Token {
    this._eat(FUNCTION_DECLARATION);
    const id = this.identifier();
    const params = this.parameterList();
    const body = this.blockStatement();
    return {
      type: FUNCTION_DECLARATION,
      id,
      params,
      body,
      expression: false,
      generator: false,
      async: false,
    };
  }

  /**
   * parameterList:
   * : OPEN_PARENTHESIS Parameter ( COMMA Parameter ) * CLOSE_PARENTHESIS
   * ;
   */
  parameterList(): Token[] {
    this._eat(OPEN_PARENTHESIS);
    const params: Token[] = [];
    while (this._lookahead.type !== CLOSE_PARENTHESIS) {
      params.push(this.identifier());
      if (this._lookahead.type === COMMA) {
        this._eat(COMMA);
      }
    }
    this._eat(CLOSE_PARENTHESIS);
    return params;
  }
  /**
   * whileStatement:
   * : while ( assignmentExpression ) statement
   * ;
   */
  whileStatement(): Token {
    this._eat(WHILE_STATEMENT);
    this._eat(OPEN_PARENTHESIS);
    const condition = this.assignmentExpression();
    this._eat(CLOSE_PARENTHESIS);
    const body = this.statement();
    return {
      type: WHILE_STATEMENT,
      test: condition,
      body: body,
    };
  }

  /**
   * doStatement:
   * : DO statement WHILE { assignmentExpression }
   * ;
   */
  doStatement(): Token {
    this._eat(DO_STATEMENT);
    const body = this.statement();
    this._eat(WHILE_STATEMENT);
    this._eat(OPEN_PARENTHESIS);
    const condition = this.assignmentExpression();
    this._eat(CLOSE_PARENTHESIS);
    this._eat(LINE_TERMINATOR);

    return {
      type: DO_STATEMENT,
      test: condition,
      body: body,
    };
  }

  /**
   * forStatement:
   * : FOR ( ForInit ForExpr ForIncr ForEnd ) StatementBlock
   * ;
   */
  forStatement(): Token {
    this._eat(FOR_STATEMENT);
    this._eat(OPEN_PARENTHESIS);
    let init = this.forInitializer();
    const condition = this.forTest();
    const update = this.forUpdater();
    const body = this.statement();
    return {
      type: FOR_STATEMENT,
      init: init,
      test: condition,
      update: update,
      body: body,
    };
  }

  /**
   * forInitializer:
   * : VariableDeclarationList
   * | null
   * ;
   */
  forInitializer(): Token | null {
    if (this._lookahead.type !== LINE_TERMINATOR) {
      return this.declarationStatement(this._lookahead.type);
    }
    this._eat(LINE_TERMINATOR);
    return null;
  }

  /**
   * forTest:
   * : condition
   * | null
   * ;
   */
  forTest(): Token | null {
    let condition = null;
    if (this._lookahead.type !== LINE_TERMINATOR) {
      condition = this.expression();
    }
    this._eat(LINE_TERMINATOR);
    return condition;
  }

  /**
   * forUpdater:
   * : expression
   * | null
   * ;
   */
  forUpdater(): Token | null {
    let updater = null;
    if (this._lookahead.type !== CLOSE_PARENTHESIS) {
      updater = this.expression();
    }
    this._eat(CLOSE_PARENTHESIS);
    return updater;
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
    const left = this.logicalORExpression();
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
   * logicalORExpression:
   * : logicalORExpression
   * | logicalORExpression OR logicalORExpression
   * ;
   */
  logicalORExpression(): Token {
    return this.binaryExpression(
      LOGICAL_OR_OPERATOR,
      this.logicalAndExpression.bind(this)
    );
  }

  /**
   * logicalAndExpression:
   * : logicalAndExpression
   * | logicalAndExpression && logicalORExpression
   * ;
   */
  logicalAndExpression(): Token {
    return this.binaryExpression(
      LOGICAL_AND_OPERATOR,
      this.equalityExpression.bind(this)
    );
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
   * | multiplicativeExpression OPERATOR unaryExpression
   * ;
   */
  multiplicativeExpression(): Token {
    return this.binaryExpression(
      MULTIPLICATION_OPERATOR,
      this.unaryExpression.bind(this)
    );
  }

  /**
   * unaryExpression:
   * : unaryExpression
   * | ! unaryExpression
   * | - unaryExpression
   * | + unaryExpression
   * ;
   */
  unaryExpression(): Token {
    let operator;
    switch (this._lookahead.type) {
      case LOGICAL_NOT:
        operator = this._eat(LOGICAL_NOT);
        break;
      case ADD_OPERATOR:
        operator = this._eat(ADD_OPERATOR);
        break;
    }

    if (operator) {
      return {
        type: UNARY_EXPRESSION,
        operator: operator.value,
        argument: this.unaryExpression(),
      };
    }
    return this.leftHandSideExpression();
  }

  /**
   * lefthandsideExpression:
   * : leftHandSideExpression
   * ;
   */
  leftHandSideExpression(): Token {
    return this.callMemberExpression();
  }

  /**
   * callMemberExpression:
   * : memberExpression
   * | callExpression arguments
   * ;
   */
  callMemberExpression(): Token {
    const memberExpression = this.memberExpression();
    if (this._lookahead.type === OPEN_PARENTHESIS) {
      return this.callExpression(memberExpression);
    }
    return memberExpression;
  }

  /**
   * lambdaExpression:
   * : ( ) => { functionBody}
   * | ( parameterList ) => { functionBody }
   * | paranthesisExpression
   * ;
   */
  lambdaExpression(params: Token[]): Token {
    while (this._lookahead.type !== CLOSE_PARENTHESIS) {
      params.push(this.expression());
      if (this._lookahead.type === COMMA) {
        this._eat(COMMA);
      }
    }

    this._eat(CLOSE_PARENTHESIS);
    this._eat(LAMBDA_EXPRESSION);
    const body = this.blockStatement();
    return {
      type: LAMBDA_EXPRESSION,
      params,
      body,
      id: null,
      async: false,
      expression: false,
      generator: false,
    };
  }

  /**
   * callExpression:
   * : callExpression
   * | callExpression OPEN_PARENTHESIS arguments CLOSE_PARENTHESIS
   * ;
   */
  callExpression(callee: Token): Token {
    let _callExpression: CallExpression = {
      type: CALL_EXPRESSION,
      callee,
      arguments: this.arguments(),
      optional: false,
    };
    if (this._lookahead.type === OPEN_PARENTHESIS) {
      _callExpression = {
        type: CALL_EXPRESSION,
        callee: _callExpression,
        arguments: this.arguments(),
        optional: false,
      };
    }
    return _callExpression;
  }

  /**
   * arguments:
   * :
   * | ( expression, expression, expression ...)
   * ;
   */
  arguments(): Token[] {
    const args = [];
    this._eat(OPEN_PARENTHESIS);
    do {
      args.push(this.expression());
    } while (this._lookahead.type === COMMA && this._eat(COMMA));
    this._eat(CLOSE_PARENTHESIS);
    return args;
  }

  /**
   * memberExpression:
   * : memberExpression [ Expression ]
   * | memberExpression . Identifier
   * | primaryExpression
   * ;
   */
  memberExpression(): Token {
    let primary = this.primaryExpression();
    while (this._lookahead.value === "." || this._lookahead.value === "[") {
      primary =
        this._lookahead.value === "."
          ? this.nonComputedProperty(primary)
          : this.computedProperty(primary);
    }
    return primary;
  }

  /**
   * computedProperty:
   * : [ Expression ]
   * ;
   */
  computedProperty(object: Token): MemberExpression {
    this._eat(MEMBER_OPERATOR);
    const property = this.expression();
    this._eat(MEMBER_OPERATOR);
    return {
      type: MEMBER_EXPRESSION,
      object,
      property,
      computed: true,
      optional: false,
    };
  }

  /**
   * nonComputedProperty:
   * : Identifier
   * | Literal
   * ;
   */
  nonComputedProperty(object: Token): MemberExpression {
    this._eat(MEMBER_OPERATOR);
    const property = this.identifier();
    return {
      type: MEMBER_EXPRESSION,
      object,
      property,
      computed: false,
      optional: false,
    };
  }

  /**
   * primaryExpression:
   * : Literal
   * | IDENTIFIER
   * | OPEN_PARENTHESIS Expression CLOSE_PARENTHESIS
   * ;
   */
  primaryExpression(): Token {
    switch (this._lookahead.type) {
      case IDENTIFIER:
        return this.identifier();
      case OPEN_PARENTHESIS:
        return this.rightHandSideExpression();
      default:
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
      case BOOLEAN_LITERAL:
        type = this.booleanLiteral();
        break;
      case NULL_LITERAL:
        type = this.nullLiteral();
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
   * booleanLiteral:
   * : TRUE
   * | FALSE
   * ;
   */
  booleanLiteral(): Token {
    const token = this._eat(BOOLEAN_LITERAL);
    return { type: BOOLEAN_LITERAL, value: token.value === TRUE };
  }

  /**
   * nullLiteral:
   * : NULL
   * ;
   */
  nullLiteral(): Token {
    const token = this._eat(NULL_LITERAL);
    return { type: NULL_LITERAL, value: null };
  }

  /**
   * rightHandSideExpression:
   * : lamdaExpression
   * | paranethesisExpression
   * ;
   */
  rightHandSideExpression(): Token {
    let expression = this.parenthesisExpression();
    if (!!expression && this._lookahead.type !== COMMA) {
      return expression;
    }
    if (this._lookahead.type === COMMA) {
      this._eat(COMMA);
    }
    return this.lambdaExpression(!!expression ? [expression] : []);
  }

  /**
   * parenthesisExpression:
   * : OPEN_PARENTHESIS expression CLOSE_PARENTHESIS
   * ;
   */
  parenthesisExpression(): Token | null {
    this._eat(OPEN_PARENTHESIS);
    if (this._lookahead.type === CLOSE_PARENTHESIS) {
      return null;
    }
    const expression = this.expression();
    if (this._lookahead.type === COMMA) {
      return expression;
    }
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
      throw new Error(
        `unexpected EOF, expected '${type}' received '${token.value}'`
      );
    }

    // Advance to the next token
    this._lookahead = this._tokenizer.next();
    return token;
  }
}

// export module simpleparser {
//   export function parse(code: string): any {
//     return JSON.stringify(new Parser().parse(code), null, 2);
//   }
// }

// console.log(simpleparser.parse(process.argv[2]));
