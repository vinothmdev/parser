import { EOF } from "dns";
import { Token } from "./token";
import { SKIP, TOKEN_TYPE_SPECS, UNDEFINED } from "./types";

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
  constructor(input: string) {
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
   * @return {null} - If there are no more tokens.
   */
  next(): Token {
    if (!this.hasNext()) {
      return { type: EOF, value: undefined };
    }

    let token: Token = { type: UNDEFINED, value: undefined };

    for (const tokenTypeDef of TOKEN_TYPE_SPECS) {
      let matchedToken = this.__pattenMatch(tokenTypeDef.pattern);

      if (!!matchedToken) {
        // Found white space
        // Ignore it
        if (tokenTypeDef.type === SKIP) {
          return this.next();
        }

        // If it has calback to ignore it
        if (tokenTypeDef.callback) {
          matchedToken = tokenTypeDef.callback(matchedToken);
        }

        // Return the token
        token = {
          type: tokenTypeDef.type,
          value: matchedToken,
        };
        break;
      }
    }
    return token;
  }

  /**
   * __pattenMatch:
   *    ; match based in Regex
   *    ; if match found advance index
   *  @param {string} patten - The patten to match.
   *  @return {null} - if this is not string token.
   */
  __pattenMatch(pettern: RegExp): string | null {
    const stringSlice = this._input.slice(this._index);
    let matches = pettern.exec(stringSlice);
    if (!!matches) {
      this._index += matches[0].length;

      return matches[0];
    }

    return null;
  }
}
