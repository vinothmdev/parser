export const PROGRAM = "Program";
export const NUMERIC_LITERAL = "NumericLiteral";
export const STRING_LITERAL = "StringLiteral";
export const UNDEFINED = "UNDEFINED";

export const TOKEN_TYPE_SPECS = [
  { type: NUMERIC_LITERAL, pattern: /^\d+/ },
  { type: STRING_LITERAL, pattern: /^"(?:[^"\\]|\\.)*"/ },
  { type: STRING_LITERAL, pattern: /^'(?:[^'\\]|\\.)*'/ },
];
