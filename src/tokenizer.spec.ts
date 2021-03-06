import { Tokenizer } from "./tokenizer";
import {
  IDENTIFIER,
  NUMERIC_LITERAL,
  STRING_LITERAL,
  UNDEFINED,
} from "./types";

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

test("Parse and return string literal in single quote", () => {
  const expected_value = {
    type: STRING_LITERAL,
    value: "apple",
  };
  expect(new Tokenizer("'apple'").next()).toStrictEqual(expected_value);
});

test("Throw error for undefined", () => {
  const expected_value = {
    type: IDENTIFIER,
    value: "apple",
  };
  expect(new Tokenizer("apple").next()).toStrictEqual(expected_value);
});

test("Ignore Space", () => {
  const expected_value = {
    type: NUMERIC_LITERAL,
    value: "42",
  };
  expect(new Tokenizer("  42  ").next()).toStrictEqual(expected_value);
});

test("Ignore Single Line Comment", () => {
  const expected_value = {
    type: NUMERIC_LITERAL,
    value: "42",
  };
  expect(
    new Tokenizer(`
    // Comments
    42
  `).next()
  ).toStrictEqual(expected_value);
});

test("Ignore Multiline Comment", () => {
  const expected_value = {
    type: NUMERIC_LITERAL,
    value: "42",
  };
  expect(
    new Tokenizer(`
    /**
     * 
     */ 
    42
  `).next()
  ).toStrictEqual(expected_value);
});

test("Ignore empty lines", () => {
  const expected_value = {
    type: NUMERIC_LITERAL,
    value: "42",
  };
  expect(
    new Tokenizer(`

    42
  `).next()
  ).toStrictEqual(expected_value);
});
