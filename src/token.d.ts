import { secureHeapUsed } from "crypto";

/**
 * Token:
 *  Defind basic token type
 */
export type Token = {
  type: string;
  name?: string;
  value?: any;
  body?: Token | Token[] | null;
  expression?: Token | boolean;
  operator?: string | null;
  left?: Token;
  right?: Token | null;
  kind?: string;
  declarations?: Token[];
  id?: Token;
  init?: Token | null;
} & IfStatement &
  Unary &
  ForStatement &
  Partial<FunctionDeclaration> &
  Partial<CallExpression> &
  Partial<MemberExpression>;

type IfStatement = {
  test?: Token | null;
  consequent?: Token;
  alternate?: Token | null;
};

type Unary = {
  type: string;
  operator?: string;
  argument?: Token | null;
};

type ForStatement = {
  type: string;
  init?: Token | null;
  test?: Token | null;
  update?: Token | null;
  body?: any;
};

type FunctionDeclaration = {
  type: string;
  id: Token;
  expression: Token | boolean;
  generator: boolean;
  async: boolean;
  params?: Token[] | null;
  body: Token | Token[] | null;
};

type CallExpression = {
  callee: Token;
  argument: Token | null;
  optional: boolean;
};

type MemberExpression = {
  type: string;
  object: Token;
  property: Token;
  computed: boolean;
  optional: boolean;
};
