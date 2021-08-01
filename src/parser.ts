import { Token, Tokenizer } from "./tokenizer";
import { NUMERIC_LITERAL, PROGRAM } from "./types";

/**
 * Parser : Recursive Decent Implementation
 */
export class Parser {
    _value: string;
    _tokenizer: Tokenizer;
    _lookahead: Token;
    /**
     * Parse string into AST
     */
    parse(str) {
        this._value = str;
        this._tokenizer = new Tokenizer(str);

        // Prime the first token for predictive parsing
        this._lookahead = this._tokenizer.next();

        return this.program();
    }

    /**
 * Program:
 *  :NumericLiteral
 *  ;
 */
    program(): any {
        return {
            type: PROGRAM,
            body: this.numericLiteral()
        };
    };

    /**
     * NumericLiteral
     *  :Number
     *  ;
     */
    numericLiteral(): any {
        const token = this._eat(NUMERIC_LITERAL);
        return { type: NUMERIC_LITERAL, value: Number(token.value) };
    }

    /**
     * _eat:
     * : [a-zA-Z]+
     * | [0-9]+
     * ;
     */
    _eat(type: string): Token {
        const token = this._lookahead;

        if (!token) {
            throw new Error(`unexpected EOF, expected '${type}'`);
        }
        if (token.type !== type) {
            throw new Error(`unexpected token '${token.value}', expected '${type}'`);
        }

        // Advance to the next token
        this._lookahead = this._tokenizer.next();
        return token;
    }
};
