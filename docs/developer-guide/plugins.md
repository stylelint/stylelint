# Writing plugins

Plugins are custom rules and sets of custom rules. They might support a particular methodology or toolset, apply to non-standard constructs and features, or be for specific use cases.

We recommend your custom rules adhere to our [rule conventions](rules.md) for:

- names
- options
- messages
- tests
- docs
- metadata
- construct-specific parsers

## The anatomy of a plugin

```js
// Abbreviated example
const stylelint = require("stylelint");

const ruleName = "plugin/foo-bar";
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected ..."
});
const meta = {
  url: "https://github.com/foo-org/stylelint-foo/blob/main/src/rules/foo-bar/README.md"
  // deprecated: true,
};

const ruleFunction = (primaryOption, secondaryOptionObject) => {
  return (postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(
      postcssResult,
      ruleName,
      {
        /* .. */
      }
    );

    if (!validOptions) {
      return;
    }

    // ... some logic ...
    stylelint.utils.report({
      /* .. */
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
```

Your plugin's rule name must be namespaced, e.g. `your-namespace/your-rule-name`, to ensure it never clashes with the built-in rules. If your plugin provides only a single rule or you can't think of a good namespace, you can use `plugin/my-rule`. _You should document your plugin's rule name (and namespace) because users need to use them in their config._

Use `stylelint.createPlugin(ruleName, ruleFunction)` to ensure that your plugin is set up properly alongside other rules.

For your plugin rule to work with the [standard configuration format](../user-guide/configure.md#rules), `ruleFunction` should accept 2 arguments:

- the primary option
- optionally, a secondary options object

If your plugin rule supports [autofixing](rules.md#add-autofix), then `ruleFunction` should also accept a third argument: `context`.

`ruleFunction` should return a function that is essentially a little [PostCSS plugin](https://postcss.org/docs/writing-a-postcss-plugin). It takes 2 arguments:

- the PostCSS Root (the parsed AST)
- the PostCSS LazyResult

You'll have to [learn about the PostCSS API](https://api.postcss.org/).

### Asynchronous rules

You can return a `Promise` instance from your plugin function to create an asynchronous rule.

```js
// Abbreviated asynchronous example
const stylelint = require("stylelint");

const ruleName = "plugin/foo-bar-async";
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected ..."
});
const meta = {
  /* .. */
};

const ruleFunction = (primaryOption, secondaryOptionObject) => {
  return (postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(
      postcssResult,
      ruleName,
      {
        /* .. */
      }
    );

    if (!validOptions) {
      return;
    }

    return new Promise((resolve) => {
      // some async operation
      setTimeout(() => {
        // ... some logic ...
        stylelint.utils.report({
          /* .. */
        });
        resolve();
      }, 1);
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
```

## Testing

You should use [`jest-preset-stylelint`](https://github.com/stylelint/jest-preset-stylelint) to test your plugin. The preset exposes a global `testRule` function that you can use to efficiently test your plugin using a schema.

For example:

```js
// index.test.js
const {
  rule: { ruleName, messages }
} = require(".");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,
  fix: true,

  accept: [
    {
      code: ".class {}"
    },
    {
      code: ".my-class {}"
    }
  ],

  reject: [
    {
      code: ".myClass {}",
      fixed: ".my-class {}",
      message: messages.expected,
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 9
    }
  ]
});
```

However, if your plugin involves more than just checking syntax you can use Stylelint directly.

For example:

```js
// index.test.js
const { lint } = require("stylelint");

const config = {
  plugins: ["./index.js"],
  rules: {
    "plugin/at-import-no-unresolveable": [true]
  }
};

it("warns for unresolveable import", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    files: "fixtures/contains-unresolveable-import.css",
    config
  });

  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(1);

  const [{ line, column, text }] = warnings;

  expect(text).toBe(
    "Unexpected unresolveable import (plugin/at-import-no-unresolveable)"
  );
  expect(line).toBe(1);
  expect(column).toBe(1);
});

it("doesn't warn for fileless sources", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    code: "@import url(unknown.css)",
    config
  });
  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(0);
});
```

Alternatively, if you don't want to use Jest you'll find more testing tool in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme).

## `stylelint.utils`

Stylelint exposes some useful utilities.

You're also welcome to copy any of the [internal utils](https://github.com/stylelint/stylelint/tree/main/lib/utils) into your plugin. You should not `require` or `import` them directly, as they are not part of the public API and may change or be removed without warning.

### `stylelint.utils.report`

Adds problems from your plugin to the list of problems that Stylelint will report to the user.

Use `stylelint.utils.report` to ensure your plugin respects disabled ranges and other possible future features of stylelint. _Do not use PostCSS's `node.warn()` method directly._

### `stylelint.utils.ruleMessages`

Tailors your messages to the format of standard Stylelint rules.

### `stylelint.utils.validateOptions`

Validates the options for your rule.

### `stylelint.utils.checkAgainstRule`

Checks CSS against a standard or custom Stylelint rule _within your own rule_. This function provides power and flexibility for plugins authors who wish to modify, constrain, or extend the functionality of existing Stylelint rules.

It accepts an options object and a callback that is invoked with warnings from the specified rule. The options are:

- `ruleName`: the name of the rule you are invoking
- `ruleSettings`: settings for the rule you are invoking
- `root`: the root node to run this rule against
- `result?`: the PostCSS result for resolving and invoking custom rules
- `context?`: the [context](rules.md#add-autofix) for the rule you are invoking

Use the warning to create a _new_ warning _from your plugin rule_ that you report with `stylelint.utils.report`.

For example, imagine you want to create a plugin that runs `at-rule-no-unknown` with a built-in list of exceptions for at-rules provided by your preprocessor-of-choice:

```js
const allowableAtRules = [
  /* .. */
];

function myPluginRule(primaryOption, secondaryOptionObject, ruleContext) {
  return (postcssRoot, postcssResult) => {
    const defaultedOptions = Object.assign({}, secondaryOptionObject, {
      ignoreAtRules: allowableAtRules.concat(options.ignoreAtRules || [])
    });

    stylelint.utils.checkAgainstRule(
      {
        ruleName: "at-rule-no-unknown",
        ruleSettings: [primaryOption, defaultedOptions],
        root: postcssRoot,
        result: postcssResult,
        context: ruleContext
      },
      (warning) => {
        stylelint.utils.report({
          message: myMessage,
          ruleName: myRuleName,
          result: postcssResult,
          node: warning.node,
          line: warning.line,
          column: warning.column,
          endLine: warning.endLine,
          endColumn: warning.endColumn
        });
      }
    );
  };
}
```

## `stylelint.rules`

All of the rule functions are available at `stylelint.rules`. This allows you to build on top of existing rules for your particular needs.

A typical use-case is to build in more complex conditionals that the rule's options allow for. For example, maybe your codebase uses special comment directives to customize rule options for specific stylesheets. You could build a plugin that checks those directives and then runs the appropriate rules with the right options (or doesn't run them at all).

All rules share a common signature. They are a function that accepts two arguments: a primary option and a secondary options object. And that function returns a function that has the signature of a PostCSS plugin, expecting a PostCSS root and result as its arguments.

Here's an example of a plugin that runs `declaration-no-important` only if there is a special directive `@@check-declaration-no-important` somewhere in the stylesheet:

```js
module.exports = stylelint.createPlugin(ruleName, (expectation) => {
  const runDeclarationNoImportant = stylelint.rules[
    "declaration-no-important"
  ].then((rule) => rule(expectation));

  return (root, result) => {
    if (!root.toString().includes("@@check-declaration-no-important")) {
      return;
    }

    return runDeclarationNoImportant.then((rule) => rule(root, result));
  };
});
```

## Allow primary option arrays

If your plugin can accept an array as its primary option, you must designate this by setting the property `primaryOptionArray = true` on your rule function. For more information, check out the ["Working on rules"](rules.md) doc.

## Peer dependencies

You should express, within the `peerDependencies` key (and **not** within the `dependencies` key) of your plugin's `package.json`, what version(s) of Stylelint your plugin can be used with. This is to ensure that different versions of Stylelint are not unexpectedly installed.

For example, to express that your plugin can be used with Stylelint versions 14 and 15:

```json
{
  "peerDependencies": {
    "stylelint": "^14.0.0 || ^15.0.0"
  }
}
```

## Plugin packs

To make a single module provide multiple rules, export an array of plugin objects (rather than a single object).

## Sharing plugins and plugin packs

Use the `stylelint-plugin` keyword within your `package.json`.
