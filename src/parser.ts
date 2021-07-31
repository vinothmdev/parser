import { NUMERIC_LITERAL } from "./types";

/**
 * Parser : Recursive Decent Implementation
 */
export class Parser {
    _value: string;
    /**
     * Parse string into AST
     */
    parse(str) {
        this._value = str;
        return this.program();
    }

    /**
 * Program:
 *  :NumericLiteral
 *  ;
 */
    program(): any {
        return this.numericLiteral();
    };

    /**
     * NumericLiteral
     *  :Number
     *  ;
     */
    numericLiteral(): any {
        return { type: NUMERIC_LITERAL, value: Number(this._value) };
    }
};
