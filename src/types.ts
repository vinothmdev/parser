export const PROGRAM = "Program";
export const NUMERIC_LITERAL = "NumericLiteral";
export const STRING_LITERAL = "StringLiteral";
export const BLOCK_STATEMENT = "BlockStatement";
export const EXPRESSION_STATEMENT = "ExpressionStatement";
export const EMPTY_STATE = "EmptyStatement";
export const BINARY_EXPRESSION = "BinaryExpression";
export const ASSIGNMENT_EXPRESSION = "AssignmentExpression";
export const VARIABLE_DECLARATOR = "VariableDeclarator";
export const VARIABLE_DECLARATION = "VariableDeclaration";
export const IF_STATEMENT = "IfStatement";
export const ELSE_STATEMENT = "ElseStatement";

export const SKIP = null;
export const WHITE_SPACE = SKIP;
export const COMMENTS = SKIP;
export const EMPTY_LINE = SKIP;
export const EOF = SKIP;
export const LINE_TERMINATOR = ";";
export const COMMA = ",";
export const OPEN_BLOCK = "{";
export const CLOSE_BLOCK = "}";
export const ADD_OPERATOR = "ADD_OPERATOR";
export const MULTIPLICATION_OPERATOR = "MULTIPLICATION_OPERATOR";
export const OPEN_PARENTHESIS = "(";
export const CLOSE_PARENTHESIS = ")";
export const SIMPLE_ASSIGNMENT = "SIMPLE_ASSIGNMENT";
export const COMPLEX_ASSIGNMENT = "COMPLEX_ASSIGNMENT";
export const IDENTIFIER = "Identifier";
export const RELATIONAL_OPERATOR = "RELATIONAL_OPERATOR";
export const EQUALITY_OPERATOR = "EQUALITY_OPERATOR";

/**
 * keywords
 */
export const UNDEFINED = "undefined";
export const LET = "let";
export const VAR = "var";
export const TRUE = "true";
export const FALSE = "false";
export const NULL = "null";

export const TOKEN_TYPE_SPECS = [
  { type: NUMERIC_LITERAL, pattern: /^\d+/ },
  {
    type: STRING_LITERAL,
    pattern: /^"(?:[^"\\]|\\.)*"/,
    callback: (str: string) => str.substr(1, str.length - 2),
  },
  {
    type: STRING_LITERAL,
    pattern: /^'(?:[^'\\]|\\.)*'/,
    callback: (str: string) => str.substr(1, str.length - 2),
  },
  { type: LET, pattern: /^\blet\b/ },
  { type: VAR, pattern: /^\bvar\b/ },
  { type: IF_STATEMENT, pattern: /^\bif\b/ },
  { type: ELSE_STATEMENT, pattern: /^\belse\b/ },
  { type: TRUE, pattern: /^\btrue\b/ },
  { type: FALSE, pattern: /^\bfalse\b/ },
  { type: NULL, pattern: /^\bnull\b/ },
  { type: UNDEFINED, pattern: /^\undefined\b/ },
  { type: WHITE_SPACE, pattern: /^\s+/ },
  { type: COMMENTS, pattern: /^\/\/.*/ },
  { type: COMMENTS, pattern: /^\/\*[\s\S]*?\*\// },
  { type: EMPTY_LINE, pattern: /^\s*$/ },
  { type: LINE_TERMINATOR, pattern: /^[;]/ },
  { type: OPEN_BLOCK, pattern: /^{/ },
  { type: CLOSE_BLOCK, pattern: /^}/ },
  { type: COMPLEX_ASSIGNMENT, pattern: /^(\+=|\-=|\*=|\/=)/ },
  { type: ADD_OPERATOR, pattern: /^[\+|-]/ },
  { type: MULTIPLICATION_OPERATOR, pattern: /^[\*|\/]/ },
  { type: OPEN_PARENTHESIS, pattern: /^\(/ },
  { type: CLOSE_PARENTHESIS, pattern: /^\)/ },
  { type: EQUALITY_OPERATOR, pattern: /^[!=]=/ },
  { type: SIMPLE_ASSIGNMENT, pattern: /^=/ },
  { type: COMMA, pattern: /^,/ },
  { type: IDENTIFIER, pattern: /^\w+/ },
  { type: RELATIONAL_OPERATOR, pattern: /^(<=)|^(>=)|^<|^>/ },
];
