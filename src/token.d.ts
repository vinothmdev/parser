import { secureHeapUsed } from "crypto";

/**
 * Token:
 *  Defind basic token type
 */
export type Token = {
  type: string;
  name?: string;
  value?: any;
  body?: any;
  expression?: Token;
  operator?: string | null;
  left?: Token;
  right?: Token | null;
  kind?: string;
  declarations?: Token[];
  id?: Token;
  init?: Token | null;
} & IfStatement;

type IfStatement = {
  test?: Token;
  consequent?: Token;
  alternate?: Token | null;
};
