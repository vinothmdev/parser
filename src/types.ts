export const PROGRAM = "Program";
export const NUMERIC_LITERAL = "NumericLiteral";
export const STRING_LITERAL = "StringLiteral";
export const UNDEFINED = "UNDEFINED";
export const SKIP = null;
export const WHITE_SPACE = SKIP;
export const COMMENTS = SKIP;
export const EMPTY_LINE = SKIP;

export const TOKEN_TYPE_SPECS = [
  { type: NUMERIC_LITERAL, pattern: /^\d+/ },
  {
    type: STRING_LITERAL,
    pattern: /^"(?:[^"\\]|\\.)*"/,
    callback: (str) => str.substr(1, str.length - 2),
  },
  {
    type: STRING_LITERAL,
    pattern: /^'(?:[^'\\]|\\.)*'/,
    callback: (str) => str.substr(1, str.length - 2),
  },
  { type: WHITE_SPACE, pattern: /^\s+/ },
  { type: COMMENTS, pattern: /^\/\/.*/ },
  { type: COMMENTS, pattern: /^\/\*[\s\S]*?\*\// },
  { type: EMPTY_LINE, pattern: /^\s*$/ },
];
