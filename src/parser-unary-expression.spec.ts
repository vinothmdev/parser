import { Parser } from "./parser";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("Logical not", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "!",
          argument: { type: "Identifier", name: "x" },
        },
      },
    ],
  };

  const result = parser.parse(`!x;`);
  expect(result).toStrictEqual(expected_value);
});

test("unary minus", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "-",
          argument: { type: "Identifier", name: "x" },
        },
      },
    ],
  };

  const result = parser.parse(`-x;`);
  expect(result).toStrictEqual(expected_value);
});

test("unary plus", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "+",
          argument: { type: "Identifier", name: "x" },
        },
      },
    ],
  };

  const result = parser.parse(`+x;`);
  expect(result).toStrictEqual(expected_value);
});

test("--x", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "-",
          argument: {
            type: "UnaryExpression",
            operator: "-",
            argument: { type: "Identifier", name: "x" },
          },
        },
      },
    ],
  };

  const result = parser.parse(`--x;`);
  expect(result).toStrictEqual(expected_value);
});

test("if(--x == 0)", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "BinaryExpression",
          operator: "==",
          left: {
            type: "UnaryExpression",
            operator: "-",
            argument: {
              type: "UnaryExpression",
              operator: "-",
              argument: { type: "Identifier", name: "x" },
            },
          },

          right: { type: "NumericLiteral", value: 0 },
        },
        consequent: {
          type: "BlockStatement",
          body: [],
        },
        alternate: null,
      },
    ],
  };

  const result = parser.parse(`if(--x == 0){}`);
  expect(result).toStrictEqual(expected_value);
});
