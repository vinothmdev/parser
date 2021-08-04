/**
 * Token:
 *  Defind basic token type
 */
export type Token = {
  type: string;
  value?: any;
  body?: any;
  expression?: Token;
  operator?: string;
  left?: Token;
  right?: Token;
};