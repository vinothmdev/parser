import { Parser } from "./parser";
import { STRING_LITERAL } from "./types";

let parser: Parser;

beforeAll(() => {
  parser = new Parser();
})

afterAll(done => {
  done()
})

test('parse and return AST with number type', () => {
  const expected_value = {
    type: 'Program',
    body: { type: 'NumericLiteral', value: 50 }
  };

  const result = parser.parse('50');
  expect(result).toStrictEqual(expected_value);
});

test('should throw an error if called without a number', () => {
  const t = () => {
    parser.parse('a');
  };
  expect(t).toThrow(/unexpected EOF/);
});


test('parse and return AST with string type', () => {
  const expected_value = {
    type: 'Program',
    body: { type: STRING_LITERAL, value: 'apple' }
  };

  const result = parser.parse('"apple"');
  expect(result).toStrictEqual(expected_value);
});