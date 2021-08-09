# parser

Simple parser created for learning purposes.

# Test

This project uses jest for testing and it can be executed by

`npm test`

# Coding style

This project uses prettier for code style.

# Code Coverage:

Code coverage is tested by

`jest --coverage`

# Usuage

`npx ts-node . {exp}`

- `{exp}` is the expression to be parsed.

# Examples

    npx ts-node . "x=3;"

```
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": {
          "type": "Identifier",
          "name": "x"
        },
        "right": {
          "type": "NumericLiteral",
          "value": 3
        }
      }
    }
  ]
}
```
