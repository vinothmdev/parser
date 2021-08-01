import { NUMERIC_LITERAL, STRING_LITERAL } from "./types";

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
        
        // Numbers
        if (!Number.isNaN(Number(this._input[this._index]))) {
            let start = this._index;
            while (!Number.isNaN(Number(this._input[this._index]))) {
                this._index++;
            }
            return {type: NUMERIC_LITERAL, value: this._input.substring(start, this._index)};
        }

        // String literals
        if (this._input[this._index] === '"') {
            let start = this._index++;
            while (this._input[this._index] !== '"') {
                this._index++;
            }
            return {type: STRING_LITERAL, value: this._input.substring(start + 1, this._index++)};
        }

        return null;
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