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
} & IfStatement &
  Unary &
  ForStatement;

type IfStatement = {
  test?: Token;
  consequent?: Token;
  alternate?: Token | null;
};

type Unary = {
  type: string;
  operator?: string;
  argument?: Token;
};

type ForStatement = {
  type: string;
  init?: Token | null;
  test?: Token;
  update?: Token;
  body?: any;
};
