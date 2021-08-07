import { Parser } from "./parser";
import { STRING_LITERAL } from "./types";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("parse and return AST with number type", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: { type: "NumericLiteral", value: 50 },
      },
    ],
  };

  const result = parser.parse("50;");
  expect(result).toStrictEqual(expected_value);
});

test("parse and return AST with string type", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: { type: STRING_LITERAL, value: "apple" },
      },
    ],
  };
  const result = parser.parse('"apple";');
  expect(result).toStrictEqual(expected_value);
});

test("parse and return AST with number, string, comment and multiline expressions", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: { type: STRING_LITERAL, value: "apple" },
      },
      {
        type: "ExpressionStatement",
        expression: { type: "NumericLiteral", value: 50 },
      },
      {
        type: "ExpressionStatement",
        expression: { type: "NumericLiteral", value: 200 },
      },
    ],
  };
  const result = parser.parse(`
  // String
  "apple";

  // Numeric
  50;

  /**
   * @param {number} num
   */
  200;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("parse and return AST with block expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: { type: STRING_LITERAL, value: "apple" },
          },
        ],
      },
      {
        type: "ExpressionStatement",
        expression: { type: "NumericLiteral", value: 50 },
      },
      {
        type: "ExpressionStatement",
        expression: { type: "NumericLiteral", value: 200 },
      },
    ],
  };
  const result = parser.parse(`
  // String
  {
  "apple";
  }

  // Numeric
  50;

  /**
   * @param {number} num
   */
  200;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("parse and return AST with empty block expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "BlockStatement",
        body: [],
      },
    ],
  };
  const result = parser.parse(`
  // String
  {

  }
  `);
  expect(result).toStrictEqual(expected_value);
});

test("parse and return AST with empty expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "EmptyStatement",
      },
    ],
  };
  const result = parser.parse(`
  ;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing binary expressions", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "NumericLiteral", value: 1 },
          right: { type: "NumericLiteral", value: 1 },
        },
      },
    ],
  };
  const result = parser.parse(`1+1;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing nested binary expressions", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "NumericLiteral", value: 1 },
            right: { type: "NumericLiteral", value: 2 },
          },
          right: { type: "NumericLiteral", value: 3 },
        },
      },
    ],
  };
  const result = parser.parse(`1+2+3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing nested binary expressions multiplication", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: { type: "NumericLiteral", value: 1 },
            right: { type: "NumericLiteral", value: 2 },
          },
          right: { type: "NumericLiteral", value: 3 },
        },
      },
    ],
  };
  const result = parser.parse(`1*2*3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing nested binary expressions grouped by precedence multiplication at right", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          right: {
            type: "BinaryExpression",
            operator: "*",
            left: { type: "NumericLiteral", value: 2 },
            right: { type: "NumericLiteral", value: 3 },
          },
          left: { type: "NumericLiteral", value: 1 },
        },
      },
    ],
  };
  const result = parser.parse(`1+2*3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing nested binary expressions grouped by precedence multiplication at left", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: { type: "NumericLiteral", value: 1 },
            right: { type: "NumericLiteral", value: 2 },
          },
          right: { type: "NumericLiteral", value: 3 },
        },
      },
    ],
  };
  const result = parser.parse(`1*2+3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing nested binary expressions grouped by precedence with multiplication on left and right", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: { type: "NumericLiteral", value: 1 },
            right: { type: "NumericLiteral", value: 2 },
          },
          right: {
            type: "BinaryExpression",
            operator: "*",
            left: { type: "NumericLiteral", value: 3 },
            right: { type: "NumericLiteral", value: 4 },
          },
        },
      },
    ],
  };
  const result = parser.parse(`1*2+3*4;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing grouped binary expressions", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "NumericLiteral", value: 1 },
            right: { type: "NumericLiteral", value: 2 },
          },
          right: { type: "NumericLiteral", value: 3 },
        },
      },
    ],
  };
  const result = parser.parse(`(1+2)*3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing multiple grouped binary expressions", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "NumericLiteral", value: 1 },
            right: { type: "NumericLiteral", value: 2 },
          },
          right: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "NumericLiteral", value: 3 },
            right: { type: "NumericLiteral", value: 4 },
          },
        },
      },
    ],
  };
  const result = parser.parse(`(1+2)-(3+4);`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing simple assignment with binary expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: { type: "NumericLiteral", value: 1 },
              right: { type: "NumericLiteral", value: 2 },
            },
            right: { type: "NumericLiteral", value: 3 },
          },
        },
      },
    ],
  };
  const result = parser.parse(`x = (1+2)*3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing simple assignment", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 3,
          },
        },
      },
    ],
  };
  const result = parser.parse(`x = 3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Parsing simple assignment", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "+=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 3,
          },
        },
      },
    ],
  };
  const result = parser.parse(`x += 3;`);
  expect(result).toStrictEqual(expected_value);
});

test("Single variable declaration ", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: null,
          },
        ],
        kind: "let",
      },
    ],
  };
  const result = parser.parse(`let y;`);
  expect(result).toStrictEqual(expected_value);
});

test("Multiple variable declaration", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "a",
            },
            init: null,
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "b",
            },
            init: null,
          },
        ],
        kind: "let",
      },
    ],
  };
  const result = parser.parse(`let a, b;`);
  expect(result).toStrictEqual(expected_value);
});

test("Multiple variable declaration with single assignment", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "a",
            },
            init: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "b",
              },
              right: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "c",
                },
                right: {
                  type: "NumericLiteral",
                  value: 42,
                },
              },
            },
          },
        ],
        kind: "let",
      },
    ],
  };
  const result = parser.parse(`let a = b = c = 42;`);
  expect(result).toStrictEqual(expected_value);
});

test("multiple variable declaration, with partial initialization", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "c",
            },
            init: null,
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "d",
            },
            init: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        ],
        kind: "let",
      },
    ],
  };
  const result = parser.parse(`let c, d = 10;`);
  expect(result).toStrictEqual(expected_value);
});

test("Sing variable declaration with initial value", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "e",
            },
            init: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        ],
        kind: "let",
      },
    ],
  };
  const result = parser.parse(`
  let e = 10;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("Var - Single variable declaration ", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: null,
          },
        ],
        kind: "var",
      },
    ],
  };
  const result = parser.parse(`var y;`);
  expect(result).toStrictEqual(expected_value);
});

test("Var - Multiple variable declaration", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "a",
            },
            init: null,
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "b",
            },
            init: null,
          },
        ],
        kind: "var",
      },
    ],
  };
  const result = parser.parse(`var a, b;`);
  expect(result).toStrictEqual(expected_value);
});

test("var - multiple variable declaration, with partial initialization", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "c",
            },
            init: null,
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "d",
            },
            init: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        ],
        kind: "var",
      },
    ],
  };
  const result = parser.parse(`var c, d = 10;`);
  expect(result).toStrictEqual(expected_value);
});

test("Var - Sing variable declaration with initial value", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "e",
            },
            init: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        ],
        kind: "var",
      },
    ],
  };
  const result = parser.parse(`
  var e = 10;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("Variable assignment", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "d",
          },
          right: {
            type: "NumericLiteral",
            value: 10,
          },
        },
      },
    ],
  };
  const result = parser.parse(`
  d = 10;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("If with simple condition", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "x",
                },
                right: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
            },
          ],
        },
        alternate: null,
      },
    ],
  };
  const result = parser.parse(`
    if (x) {
      x = 1;
    }
  `);
  expect(result).toStrictEqual(expected_value);
});

test("If with simple condition without block", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 1,
            },
          },
        },
        alternate: null,
      },
    ],
  };
  const result = parser.parse(`
    if (x) x = 1;
  `);
  expect(result).toStrictEqual(expected_value);
});

test("Nested if with block", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
              },
            ],
          },
          alternate: null,
        },
        alternate: null,
      },
    ],
  };
  const result = parser.parse(`
    if (x) if (x) { x = 1; }
  `);
  expect(result).toStrictEqual(expected_value);
});

test("Nested if with block else", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "x",
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
              },
            ],
          },
          alternate: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 2,
                  },
                },
              },
            ],
          },
        },
        alternate: null,
      },
    ],
  };
  const result = parser.parse(`
    if (x) if (x) { x = 1; } else { x = 2;}
  `);
  let test = JSON.stringify(result);
  expect(result).toStrictEqual(expected_value);
});

test("Nested if-else with nested if block", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "IfStatement",
              test: {
                type: "Identifier",
                name: "x",
              },
              consequent: {
                type: "BlockStatement",
                body: [
                  {
                    type: "ExpressionStatement",
                    expression: {
                      type: "AssignmentExpression",
                      operator: "=",
                      left: {
                        type: "Identifier",
                        name: "x",
                      },
                      right: {
                        type: "NumericLiteral",
                        value: 1,
                      },
                    },
                  },
                ],
              },
              alternate: null,
            },
          ],
        },
        alternate: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "x",
                },
                right: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            },
          ],
        },
      },
    ],
  };
  const result = parser.parse(`
    if (x) { if (x) { x = 1; } } else { x = 2;}
  `);
  let test = JSON.stringify(result);
  expect(result).toStrictEqual(expected_value);
});

test("If-else with simple condition", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "x",
                },
                right: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
            },
          ],
        },
        alternate: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "x",
                },
                right: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            },
          ],
        },
      },
    ],
  };
  const result = parser.parse(`
    if (x) {
      x = 1;
    } else {
      x = 2;
    }
  `);
  expect(result).toStrictEqual(expected_value);
});

test("If x >= 0", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: { type: "NumericLiteral", value: 1 },
          },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "x",
                },
                right: {
                  type: "NumericLiteral",
                  value: 1,
                },
              },
            },
          ],
        },
        alternate: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "x",
                },
                right: {
                  type: "NumericLiteral",
                  value: 2,
                },
              },
            },
          ],
        },
      },
    ],
  };
  const result = parser.parse(`
    if ( x >= 1 ) {
      x = 1;
    } else {
      x = 2;
    }
  `);
  expect(result).toStrictEqual(expected_value);
});

test("Throw error for undefined", () => {
  const t = () => {
    parser.parse("50");
  };
  expect(t).toThrow(/unexpected EOF, expected ';'/);
});

test("Throw error for undefined", () => {
  const t = () => {
    parser.parse("50**");
  };
  expect(t).toThrow(/unexpected token '*'/);
});

test("Throw error for undefined", () => {
  const t = () => {
    parser.parse("50*;");
  };
  expect(t).toThrow(/unexpected token '*'/);
});
