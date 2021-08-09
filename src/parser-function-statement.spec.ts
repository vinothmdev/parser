import { Parser } from "./parser";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("Simple function definition with out argument", () => {
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
        params: [],
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
    function sum() {
        // add two numbers
        x = a + b;
        return x;
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("Simple function definition with out argument and only return", () => {
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
        params: [],
        body: {
          type: "BlockStatement",
          body: [
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
    function sum() {
        // add two numbers
        return x;
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("Simple function definition with out argument and only return", () => {
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
        params: [],
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ReturnStatement",
              argument: null,
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
    function sum() {
        // add two numbers
        return;
    }
    `
  );
  expect(result).toStrictEqual(expected_value);
});

test("Simple function definition with parameters", () => {
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

test("Simple function definition with parameters with return expression", () => {
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
              type: "ReturnStatement",
              argument: {
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
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
    function sum(a,b) {
        // add two numbers
        return a+b;
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

test("Chained function call", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
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

  const result = parser.parse(`sum(a,b)(a,b);`);
  expect(result).toStrictEqual(expected_value);
});

test("Chained function call", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "console",
            },
            property: {
              type: "Identifier",
              name: "log",
            },
            computed: false,
            optional: false,
          },
          arguments: [
            {
              type: "Identifier",
              name: "a",
            },
          ],
          optional: false,
        },
      },
    ],
  };

  const result = parser.parse(`console.log(a);`);
  expect(result).toStrictEqual(expected_value);
});

// test("lambda function call", () => {
//   const expected_value = {
//     type: "Program",
//     body: [
//       {
//         type: "VariableDeclaration",
//         declarations: [
//           {
//             type: "VariableDeclarator",
//             id: {
//               type: "Identifier",
//               name: "sum",
//             },
//             init: {
//               type: "ArrowFunctionExpression",
//               id: null,
//               expression: false,
//               generator: false,
//               async: false,
//               params: [
//                 {
//                   type: "Identifier",
//                   name: "a",
//                 },
//                 {
//                   type: "Identifier",
//                   name: "b",
//                 },
//               ],
//               body: {
//                 type: "BlockStatement",
//                 body: [
//                   {
//                     type: "ReturnStatement",
//                     argument: {
//                       type: "BinaryExpression",
//                       left: {
//                         type: "Identifier",
//                         name: "a",
//                       },
//                       operator: "+",
//                       right: {
//                         type: "Identifier",
//                         name: "b",
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         ],
//         kind: "let",
//       },
//     ],
//   };

//   const result = parser.parse(`let sum = (a,b) => {return a+b;};`);
//   expect(result).toStrictEqual(expected_value);
// });
