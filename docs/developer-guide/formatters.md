# Writing custom formatters

A formatter is a function with the following signature:

```js
/**
 * @type {import('stylelint').Formatter}
 */
export default function formatter(results, returnValue) {
  return "a string of formatted results";
}
```

Where the first argument (`results`) is an array of [Stylelint result objects (type `Array<StylelintResult>`)](../user-guide/node-api.md#result-object).

And the second argument (`returnValue`) is an object (type `LinterResult`) with one or more of the following keys:

```jsonc
{
  "errored": false, // `true` if there were any warnings with "error" severity
  "maxWarningsExceeded": {
    // Present if Stylelint was configured with a `maxWarnings` count
    "maxWarnings": 10,
    "foundWarnings": 15
  },
  "ruleMetadata": {
    "block-no-empty": {
      "url": "https://stylelint.io/user-guide/rules/block-no-empty"
    }
    // other rules...
  }
}
```

## Passing arguments

You can use environmental variables in your formatter. For example, pass `SKIP_WARNINGS`:

```shell
SKIP_WARNINGS=true stylelint "*.css" --custom-formatter ./my-formatter.js
```

Alternatively, you can create a separate formatting program and pipe the output from the built-in JSON formatter into it:

```shell
stylelint -f json "*.css" 2>&1 | my-program-that-reads-JSON --option
```

## `stylelint.formatters`

Stylelint's internal formatters are exposed publicly in `stylelint.formatters`.

## Sharing formatters

Use the `stylelint-formatter` keyword within your `package.json`. For example:

```json
{
  "keywords": ["stylelint", "stylelint-formatter"]
}
```
