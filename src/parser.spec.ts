import {Parser} from "./parser";
import {STRING_LITERAL} from "./types";

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
                expression: {type: "NumericLiteral", value: 50},
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
                expression: {type: STRING_LITERAL, value: "apple"},
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
                expression: {type: STRING_LITERAL, value: "apple"},
            },
            {
                type: "ExpressionStatement",
                expression: {type: "NumericLiteral", value: 50},
            },
            {
                type: "ExpressionStatement",
                expression: {type: "NumericLiteral", value: 200},
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
                        expression: {type: STRING_LITERAL, value: "apple"},
                    },
                ],
            },
            {
                type: "ExpressionStatement",
                expression: {type: "NumericLiteral", value: 50},
            },
            {
                type: "ExpressionStatement",
                expression: {type: "NumericLiteral", value: 200},
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
                    operator: '+',
                    left: {type: "NumericLiteral", value: 1},
                    right: {type: "NumericLiteral", value: 1}
                }
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
                    operator: '+',
                    left: {
                        type: "BinaryExpression",
                        operator: '+',
                        left: {type: "NumericLiteral", value: 1},
                        right: {type: "NumericLiteral", value: 2}
                    },
                    right: {type: "NumericLiteral", value: 3}
                }
            },
        ],
    };
    const result = parser.parse(`1+2+3;`);
    expect(result).toStrictEqual(expected_value);
});

test("Throw error for undefined", () => {
    const t = () => {
        parser.parse("a");
    };
    expect(t).toThrow(/unexpected token 'undefined'/);
});

test("Throw error for undefined", () => {
    const t = () => {
        parser.parse("50");
    };
    expect(t).toThrow(/unexpected EOF, expected ';'/);
});
