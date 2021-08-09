export const PROGRAM = "Program";
export const NUMERIC_LITERAL = "NumericLiteral";
export const STRING_LITERAL = "StringLiteral";
export const BOOLEAN_LITERAL = "BooleanLiteral";
export const NULL_LITERAL = "NullLiteral";
export const BLOCK_STATEMENT = "BlockStatement";
export const EXPRESSION_STATEMENT = "ExpressionStatement";
export const UNARY_EXPRESSION = "UnaryExpression";
export const EMPTY_STATE = "EmptyStatement";
export const BINARY_EXPRESSION = "BinaryExpression";
export const MEMBER_EXPRESSION = "MemberExpression";
export const ASSIGNMENT_EXPRESSION = "AssignmentExpression";
export const VARIABLE_DECLARATOR = "VariableDeclarator";
export const VARIABLE_DECLARATION = "VariableDeclaration";
export const IF_STATEMENT = "IfStatement";
export const ELSE_STATEMENT = "ElseStatement";
export const WHILE_STATEMENT = "WhileStatement";
export const DO_STATEMENT = "DoWhileStatement";
export const FOR_STATEMENT = "ForStatement";
export const FUNCTION_DECLARATION = "FunctionDeclaration";
export const RETURN_STATEMENT = "ReturnStatement";

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
export const LOGICAL_AND_OPERATOR = "LOGICAL_AND_OPERATOR";
export const LOGICAL_OR_OPERATOR = "LOGICAL_OR_OPERATOR";
export const LOGICAL_NOT = "LOGICAL_NOT";
export const MINUS_OPERATOR = "MINUS_OPERATOR";
export const PLUS_OPERATOR = "PLUS_OPERATOR";
export const MEMBER_OPERATOR = "MEMBER_OPERATOR";

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
  { type: BOOLEAN_LITERAL, pattern: /^\btrue\b/ },
  { type: BOOLEAN_LITERAL, pattern: /^\bfalse\b/ },
  { type: NULL_LITERAL, pattern: /^\bnull\b/ },
  { type: UNDEFINED, pattern: /^\bundefined\b/ },
  { type: DO_STATEMENT, pattern: /^\bdo\b/ },
  { type: WHILE_STATEMENT, pattern: /^\bwhile\b/ },
  { type: FOR_STATEMENT, pattern: /^\bfor\b/ },
  { type: FUNCTION_DECLARATION, pattern: /^\bfunction\b/ },
  { type: RETURN_STATEMENT, pattern: /^\breturn\b/ },
  { type: MEMBER_OPERATOR, pattern: /^[\.\[\]]/ },
  { type: LOGICAL_AND_OPERATOR, pattern: /^(&&)/ },
  { type: LOGICAL_OR_OPERATOR, pattern: /^(\|\|)/ },
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
  { type: LOGICAL_NOT, pattern: /^!/ },
  { type: PLUS_OPERATOR, pattern: /^\+/ },
  { type: MINUS_OPERATOR, pattern: /^\-/ },
  { type: SIMPLE_ASSIGNMENT, pattern: /^=/ },
  { type: COMMA, pattern: /^,/ },
  { type: IDENTIFIER, pattern: /^\w+/ },
  { type: RELATIONAL_OPERATOR, pattern: /^(<=)|^(>=)|^<|^>/ },
];
