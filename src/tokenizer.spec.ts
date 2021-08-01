import { Tokenizer } from "./tokenizer";
import { NUMERIC_LITERAL, STRING_LITERAL, UNDEFINED } from "./types";

test("Parse and return number literal", () => {
  const expected_value = {
    type: NUMERIC_LITERAL,
    value: "50",
  };
  expect(new Tokenizer("50").next()).toStrictEqual(expected_value);
});

test("Parse and return string literal", () => {
  const expected_value = {
    type: STRING_LITERAL,
    value: "apple",
  };
  expect(new Tokenizer('"apple"').next()).toStrictEqual(expected_value);
});

test("Throw error for undefined", () => {
  const expected_value = {
    type: UNDEFINED,
    value: undefined,
  };
  expect(new Tokenizer("apple").next()).toStrictEqual(expected_value);
});
