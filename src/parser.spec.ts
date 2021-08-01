import { Parser } from "./parser";
import { STRING_LITERAL } from "./types";

test('parse and return AST with number type', () => {
  const expected_value = {
    type: 'Program',
    body: { type: 'NumericLiteral', value: 50 }
  };
  const parser = new Parser();
  const result = parser.parse('50');
  expect(result).toStrictEqual(expected_value);
});

test('should throw an error if called without a number', () => {
  const t = () => {
    new Parser().parse('a');
  };
  expect(t).toThrow(/unexpected EOF/);
});


test('parse and return AST with string type', () => {
  const expected_value = {
    type: 'Program',
    body: { type: STRING_LITERAL, value: 'apple' }
  };
  const parser = new Parser();
  const result = parser.parse('"apple"');
  expect(result).toStrictEqual(expected_value);
});