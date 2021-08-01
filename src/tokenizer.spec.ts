import { Tokenizer } from "./tokenizer";
import { NUMERIC_LITERAL } from "./types";

test('Parse and return number literal', () => {
  const expected_value = {
    type: NUMERIC_LITERAL,
    value: '50'
  };
  expect(new Tokenizer("50").next()).toStrictEqual(expected_value);
});