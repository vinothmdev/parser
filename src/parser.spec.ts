import { Parser } from "./parser";

test('parse and return number type AST', () => {
  const result = {type: 'NumericLiteral', value: 50};
  expect(new Parser().parse("50")).toStrictEqual(result);
});