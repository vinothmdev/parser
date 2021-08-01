import { NUMERIC_LITERAL, STRING_LITERAL, UNDEFINED } from "./types";

/**
 * Tokenizer:
 * Lazy-parses a string into an array of tokens.
 */
export class Tokenizer {
  _index: number;
  _input: string;
  _length: number;

  /**
   * @param {string} input - The string to tokenize.
   */
  constructor(input) {
    this._input = input;
    this._length = input.length;
    this._index = 0;
  }

  /**
   * @returns {boolean} - True if the tokenizer has more tokens.
   */
  hasNext(): boolean {
    return this._index < this._length;
  }

  /**
   * @returns {string} - The next token.
   * @throws {null} - If there are no more tokens.
   */
  next(): Token {
    if (!this.hasNext()) {
      return null;
    }

    const defaultToken = { type: UNDEFINED, value: undefined };

    return this._parseNumericalRegex() || this._parseString() || defaultToken;
  }

  /**
   * _parseNumerical:
   *  ; find and match numeric token using index
   *  ; advance the index
   *  @param {string} input - The string to tokenize.
   *  @throws {null} - if this is not numerical token.
   */
  _parseNumerical(): Token {
    if (!Number.isNaN(Number(this._input[this._index]))) {
      let start = this._index;
      while (!Number.isNaN(Number(this._input[this._index]))) {
        this._index++;
      }
      return {
        type: NUMERIC_LITERAL,
        value: this._input.substring(start, this._index),
      };
    }
    return null;
  }

  /**
   * _parseNumericalRegex:
   *  ; find and match numeric token using regex
   *  ; advance the index
   *  @param {string} input - The string to tokenize.
   *  @throws {null} - if this is not numerical token.
   */
  _parseNumericalRegex(): Token {
    const stringSlice = this._input.slice(this._index);
    let matches = /^\d+/.exec(stringSlice);
    if (!!matches) {
      this._index += matches[0].length;

      return { type: NUMERIC_LITERAL, value: matches[0] };
    }
    return null;
  }

  /**
   * _parseString:
   *  ; find and match string token using index
   *  ; advance the index
   *  @param {string} input - The string to tokenize.
   *  @throws {null} - if this is not string token.
   */
  _parseString(): Token {
    if (this._input[this._index] === '"') {
      let start = this._index++;
      while (this._input[this._index] !== '"') {
        this._index++;
      }
      return {
        type: STRING_LITERAL,
        value: this._input.substring(start + 1, this._index++),
      };
    }
  }
}

/**
 * Token:
 *  Defind basic token type
 */
export class Token {
  type: string;
  value: string;
}
