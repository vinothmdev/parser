import { Parser } from "./parser";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("Logical expression test with equal and not equal", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "BinaryExpression",
          operator: "==",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 0 },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "x" },
                right: { type: "NumericLiteral", value: 0 },
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "y" },
                right: { type: "NumericLiteral", value: 0 },
              },
            },
          ],
        },
        alternate: {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: "!=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
          consequent: { type: "BlockStatement", body: [] },
          alternate: null,
        },
      },
    ],
  };

  const result = parser.parse(
    `
    if (x == 0) {
      x = 0;
      y = 0;
      // Test
    } else if (x != 1) {
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("Logical expression test with equal and not equal and arithmetic", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "BinaryExpression",
          operator: "==",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
          right: { type: "NumericLiteral", value: 0 },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "x" },
                right: { type: "NumericLiteral", value: 0 },
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "y" },
                right: { type: "NumericLiteral", value: 0 },
              },
            },
          ],
        },
        alternate: {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: "!=",
            left: { type: "Identifier", name: "x" },
            right: {
              type: "BinaryExpression",
              operator: "+",
              left: { type: "NumericLiteral", value: 1 },
              right: { type: "Identifier", name: "y" },
            },
          },
          consequent: { type: "BlockStatement", body: [] },
          alternate: null,
        },
      },
    ],
  };

  const result = parser.parse(
    `
    if (x + 1 == 0) {
      x = 0;
      y = 0;
      // Test
    } else if (x != 1 + y) {
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("Logical expression with true and false", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "BinaryExpression",
          operator: "==",
          left: { type: "Identifier", name: "x" },
          right: { type: "BooleanLiteral", value: "true" },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "x" },
                right: { type: "NumericLiteral", value: 0 },
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "y" },
                right: { type: "NumericLiteral", value: 0 },
              },
            },
          ],
        },
        alternate: {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: "==",
            left: { type: "Identifier", name: "x" },
            right: { type: "BooleanLiteral", value: "false" },
          },
          consequent: { type: "BlockStatement", body: [] },
          alternate: null,
        },
      },
    ],
  };

  const result = parser.parse(
    `
    if (x == true) {
      x = 0;
      y = 0;
      // Test
    } else if (x == false) {
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});
