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
  operator?: string;
  left?: Token;
  right?: Token;
  kind?: string;
  declarations?: Token[];
  id?: Token;
  init?: Token | null;
};
