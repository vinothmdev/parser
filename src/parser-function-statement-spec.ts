import { Parser } from "./parser";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("Simple function definition", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "FunctionDeclaration",
        id: {
          type: "Identifier",
          name: "sum",
        },
        expression: false,
        generator: false,
        async: false,
        params: [
          {
            type: "Identifier",
            name: "a",
          },
          {
            type: "Identifier",
            name: "b",
          },
        ],
        body: {
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
                  type: "BinaryExpression",
                  left: {
                    type: "Identifier",
                    name: "a",
                  },
                  operator: "+",
                  right: {
                    type: "Identifier",
                    name: "b",
                  },
                },
              },
            },
            {
              type: "ReturnStatement",
              argument: {
                type: "Identifier",
                name: "x",
              },
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
    function sum(a,b) {
        // add two numbers
        x = a + b;
        return x;
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("Simple function call", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "sum",
          },
          arguments: [
            {
              type: "Identifier",
              name: "a",
            },
            {
              type: "Identifier",
              name: "b",
            },
          ],
          optional: false,
        },
      },
    ],
  };

  const result = parser.parse(`sum(a,b);`);
  expect(result).toStrictEqual(expected_value);
});
