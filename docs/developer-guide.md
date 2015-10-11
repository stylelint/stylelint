# Developer guide

In this guide you'll find information on contributing rules to stylelint, writing your own plugins and formatters.

## Writing rules

Have a look at the [user guide](/docs/user-guide.md) to familiarize yourself the rule naming conventions.

### Let everyone know

1. First, open [an issue](https://github.com/stylelint/stylelint/issues/new) with the title "New rule: *rule-name*" and let everyone else know when you intend to start on the new rule.
2. Once you have something to show, create a [pull request](https://github.com/stylelint/stylelint/compare).

### Options

Use explicit, rather than implicit, options. For example:

* `color-hex-case: "upper"|"lower"` rather than `color-hex-uppercase: "always"|"never"`

As `color-hex-uppercase: "never"` *implies* always lowercase.

### Messages

Take the form of:

* "Expected a ... something"
* "Unexpected ... something" (for rejection e.g. when something is disallowed)

### README.md

Each rule must be accompanied by a README.md, which takes the form of:

1. Rule name.
2. Single line description.
3. Code example (if necessary).
4. Expanded description (if necessary).
5. Options (if applicable).
6. Example patterns that are considered warnings (for each option value).
7. Example patterns that are *not* considered warnings (for each option value).
5. Optional options (if applicable).

### Tests

Each rule must be accompanied by tests that contain:

* All patterns that are considered warnings.
* All patterns that should *not* be considered warnings.

#### Running tests

You can run the tests via:

```console
npm test
```

To run tests in a single file, instead of all the tests at once, you'll need to use `babel-tape-runner` (because the codebase is ES6). For example:

```console
babel-tape-runner src/rules/color-hex-case/__tests__/index.js
```

## Writing plugins

```js
// Abbreviated example:

var stylelint = require("stylelint")

var myPluginRule = function(expectationKeyword, optionsObject) {
  return function(postcssRoot, postcssResult) {
    // ... some logic ...
    stylelint.utils.report({ .. })
  }
}
```

In order for your plugin rule to work with the standard configuration format, (e.g. `[2, "tab", { hierarchicalSelectors: true }]`), it should be a function that accepts 2 arguments: the expectation keyword (e.g. `"tab"`) and, optionally, an options object (e.g. `{ hierarchicalSelectors: true }`).

It should return a function that is essentially a little PostCSS plugin: it takes 2 arguments: the PostCSS Root (the parsed AST), and the PostCSS LazyResult.
You'll have to [learn about the PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md).

A few of stylelint's internal utilities are exposed publicly in `stylelint.utils`, to help you write plugin rules.
For details about the APIs of these functions, please look at comments in the source code and examples in the standard rules.

- `report`: Report your linting warnings. *You'll want to use this: do not use `node.warn()` directly.* If you use `report`,
your plugin will respect disabled ranges and other possible future features of stylelint, so it will fit in better with the standard rules.
- `ruleMessages`: Tailor your messages to look like the messages of other stylelint rules. Currently, this means that the name of the rule is appended, in parentheses, to the end of the message.
- `styleSearch`: Search within CSS strings, and for every match found invoke a callback, passing a match object with details about the match. `styleSearch` ignores CSS strings (e.g. `content: "foo";`) and by default ignores comments. It can also be restricted to substrings within or outside of CSS functional notation.

### Testing plugins

For testing your plugin, you might consider using the same rule-testing function that stylelint uses internally: https://github.com/stylelint/stylelint-rule-tester.

## Writing formatters

A formatter is a function that accepts *an array of these stylelint result objects* and outputs a string:

```js
// A stylelint result object
{
  source:  "path/to/file.css", // The filepath or PostCSS identifier like <input css 1>
  errored: true, // This is `true` if at least one rule with a severity of 2 triggered a warning
  warnings: [ // Array of warning objects, each like the following ...
    {
      line: 3,
      column: 12,
      rule: "block-no-empty",
      severity: 2,
      text: "You should not have an empty block (block-no-empty)"
    },
    ..
  ]
}
```
