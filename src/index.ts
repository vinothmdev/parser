import { Parser } from "./parser";

export module simpleparser {
  export function parse(code: string): any {
    return JSON.stringify(new Parser().parse(code), null, 2);
  }
}

console.log(simpleparser.parse(process.argv[2]));
