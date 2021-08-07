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
