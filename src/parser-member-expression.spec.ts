import { Parser } from "./parser";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
});

afterAll((done) => {
  done();
});

test("simple member expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "s",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
            computed: false,
            optional: false,
          },
          operator: ">",
          right: {
            type: "NumericLiteral",
            value: 0,
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "s",
                },
                property: {
                  type: "Identifier",
                  name: "i",
                },
                computed: true,
                optional: false,
              },
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
      while(s.length > 0) {
        s[i];
      }
      `
  );
  expect(result).toStrictEqual(expected_value);
});

test("chained member expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "s",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
            computed: false,
            optional: false,
          },
          operator: ">",
          right: {
            type: "NumericLiteral",
            value: 0,
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "MemberExpression",
                object: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "a",
                  },
                  property: {
                    type: "Identifier",
                    name: "b",
                  },
                  computed: false,
                  optional: false,
                },
                property: {
                  type: "Identifier",
                  name: "c",
                },
                computed: false,
                optional: false,
              },
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
        while(s.length > 0) {
          a.b.c;
        }
        `
  );
  expect(result).toStrictEqual(expected_value);
});

test("array member with nested member expression", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "s",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
            computed: false,
            optional: false,
          },
          operator: ">",
          right: {
            type: "NumericLiteral",
            value: 0,
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "s",
                },
                property: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "i",
                  },
                  property: {
                    type: "Identifier",
                    name: "a",
                  },
                  computed: false,
                  optional: false,
                },
                computed: true,
                optional: false,
              },
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
        while(s.length > 0) {
          s[i.a];
        }
        `
  );
  expect(result).toStrictEqual(expected_value);
});

test("chained member expression with array property", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "s",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
            computed: false,
            optional: false,
          },
          operator: ">",
          right: {
            type: "NumericLiteral",
            value: 0,
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "MemberExpression",
                object: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "s",
                  },
                  property: {
                    type: "Identifier",
                    name: "a",
                  },
                  computed: false,
                  optional: false,
                },
                property: {
                  type: "Identifier",
                  name: "i",
                },
                computed: true,
                optional: false,
              },
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
        while(s.length > 0) {
          s.a[i];
        }
        `
  );
  expect(result).toStrictEqual(expected_value);
});

test("object membership by name string", () => {
  const expected_value = {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        test: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "s",
            },
            property: {
              type: "Identifier",
              name: "length",
            },
            computed: false,
            optional: false,
          },
          operator: ">",
          right: {
            type: "NumericLiteral",
            value: 0,
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "s",
                },
                property: {
                  type: "StringLiteral",
                  value: "i",
                },
                computed: true,
                optional: false,
              },
            },
          ],
        },
      },
    ],
  };

  const result = parser.parse(
    `
        while(s.length > 0) {
          s['i'];
        }
        `
  );
  expect(result).toStrictEqual(expected_value);
});
