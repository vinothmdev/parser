import { Parser } from "./parser";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("while loop with simple condition", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          operator: ">",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 0 },
        },
        body: {
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
      },
    ],
  };

  const result = parser.parse(
    `
    while (x > 0) {
        x = 0;
        y = 0;
        // Test
      }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("while loop with compound condition x + 1 == 0", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          operator: ">",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
          right: { type: "NumericLiteral", value: 0 },
        },
        body: {
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
      },
    ],
  };

  const result = parser.parse(
    `
      while (x + 1 > 0) {
          x = 0;
          y = 0;
          // Test
        }
      `
  );
  expect(result).toStrictEqual(expected_value);
});

test("do-while loop with compound condition x + 1 == 0", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "DoWhileStatement",
        body: {
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
        test: {
          type: "BinaryExpression",
          operator: ">",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
          right: { type: "NumericLiteral", value: 0 },
        },
      },
    ],
  };

  const result = parser.parse(
    `
    do {
        x = 0;
        y = 0;
        // Test
        } while (x + 1 > 0);
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("for loop", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ForStatement",
        init: {
          type: "VariableDeclaration",
          declarations: [
            {
              type: "VariableDeclarator",
              id: {
                type: "Identifier",
                name: "i",
              },
              init: {
                type: "NumericLiteral",
                value: 0,
              },
            },
          ],
          kind: "let",
        },
        test: {
          type: "BinaryExpression",
          operator: "<",
          left: { type: "Identifier", name: "i" },
          right: { type: "NumericLiteral", value: 20 },
        },
        update: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "Identifier", name: "i" },
            right: { type: "NumericLiteral", value: 1 },
          },
        },
        body: {
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
      },
    ],
  };

  const result = parser.parse(
    `
      for(let i = 0; i<20; i=i+1) {
          x = 0;
          y = 0;
          // Test
    }
      `
  );
  let test = JSON.stringify(result);
  expect(result).toStrictEqual(expected_value);
});

test("for loop with empty expressions", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ForStatement",
        init: null,
        test: null,
        update: null,
        body: {
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
      },
    ],
  };

  const result = parser.parse(
    `
      for(; ;) {
          x = 0;
          y = 0;
          // Test
    }
      `
  );
  let test = JSON.stringify(result);
  expect(result).toStrictEqual(expected_value);
});
