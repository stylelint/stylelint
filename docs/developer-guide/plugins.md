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

This example plugin disallows the word "foo" in selectors:

```js
import stylelint from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions }
} = stylelint;

const ruleName = "foo-org/selector-no-foo";

const messages = ruleMessages(ruleName, {
  rejected: (selector) => `Unexpected "foo" within selector "${selector}"`
});

const meta = {
  url: "https://github.com/foo-org/stylelint-selector-no-foo/blob/main/README.md"
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true]
    });

    if (!validOptions) return;

    root.walkRules((ruleNode) => {
      const { selector } = ruleNode;

      if (!selector.includes("foo")) return;

      report({
        result,
        ruleName,
        message: messages.rejected(selector),
        node: ruleNode,
        word: selector
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
```

> [!NOTE]
> The [JSDoc `@type` tag](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#type) enables the autocompletion and type-checking features provided by Typescript.

The usage would be:

```json
{
  "plugins": ["@foo-org/stylelint-selector-no-foo"],
  "rules": {
    "foo-org/selector-no-foo": true
  }
}
```

```sh-session
$ echo '.foo {}' | stylelint --stdin-filename=test.css

test.css
 1:1  ✖  Unexpected "foo" within selector ".foo"  foo-org/selector-no-foo

1 problem (1 error, 0 warnings)
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

You'll have to [learn about the PostCSS API](https://postcss.org/api/).

### Asynchronous rules

You can write your plugin as an _async function_ to deal with `Promise`.

```js
const ruleFunction = (primary, secondaryOptions) => {
  return async (root, result) => {
    // validate options...

    // load disallowed words asynchronously
    const disallowedWords = await import("./disallowed-words.js");

    // traverse AST nodes...

    // report a warning if a problem word is detected...
  };
};
```

## Testing

You can use either:

- [`stylelint-test-rule-node`](https://www.npmjs.com/package/stylelint-test-rule-node) (`node:test` based)
- [`jest-preset-stylelint`](https://github.com/stylelint/jest-preset-stylelint) (Jest based)

Both expose a `testRule` function that you can use to efficiently test your plugin using a schema.

For example:

```js
import { testRule } from "stylelint-test-rule-node";

import plugin from "./index.js";

const {
  rule: { messages, ruleName }
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  fix: true,

  accept: [
    {
      code: ".a {}"
    },
    {
      code: ".b {}"
    }
  ],

  reject: [
    {
      code: ".foo {}",
      fixed: ".safe {}",
      message: messages.rejected(".foo"),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 8
    }
  ]
});
```

Alternatively, you'll find more testing options in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme).

If your plugin involves more than just checking syntax, you can use Stylelint directly.

For example:

```js
import stylelint from "stylelint";

const { lint } = stylelint;

const config = {
  plugins: ["./index.js"],
  rules: {
    "foo-org/selector-no-foo": true
  }
};

it("warns", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    files: ["fixtures/test.css"],
    config
  });

  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(1);

  const [{ text, line, column }] = warnings;

  expect(text).toBe('Unexpected "foo" within selector ".foo"');
  expect(line).toBe(1);
  expect(column).toBe(1);
});

it("doesn't warn", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    code: ".foo {}",
    config
  });

  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(0);
});
```

## `stylelint.utils`

Stylelint exposes some useful utilities.

You're also welcome to copy any of the [internal utils](https://github.com/stylelint/stylelint/tree/main/lib/utils) into your plugin. You should not `import` them directly, as they are not part of the public API and may change or be removed without warning.

### `stylelint.utils.report()`

Adds problems from your plugin to the list of problems that Stylelint will report to the user.

Use `stylelint.utils.report()` to ensure your plugin respects disabled ranges and other possible future features of Stylelint.

> [!IMPORTANT]
> Do not use PostCSS's [`Node#warn()`](https://postcss.org/api/#node-warn) method directly.

You can specify PostCSS's [warning options](https://postcss.org/api/#warningoptions) (e.g., `word`, `index`, `start`, etc.) to detail where a problem occurs.

### `stylelint.utils.ruleMessages()`

Tailors your messages to the format of standard Stylelint rules.

### `stylelint.utils.validateOptions()`

Validates the options for your rule.

### `stylelint.utils.checkAgainstRule()`

Checks CSS against a standard or custom Stylelint rule _within your own rule_. This function provides power and flexibility for plugins authors who wish to modify, constrain, or extend the functionality of existing Stylelint rules.

> [!NOTE]
> This is an async function. Your custom rule may need to wait until a `Promise` returned by the function is resolved.

It accepts an options object and a callback that is invoked with warnings from the specified rule. The options are:

- `ruleName`: the name of the rule you are invoking
- `ruleSettings`: settings for the rule you are invoking
- `root`: the root node to run this rule against
- `result?`: the PostCSS result for resolving and invoking custom rules
- `context?`: the [context](rules.md#add-autofix) for the rule you are invoking

Use the warning to create a _new_ warning _from your plugin rule_ that you report with [`stylelint.utils.report()`](#stylelintutilsreport).

For example, imagine you want to create a plugin that runs [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md) with a built-in list of exceptions for at-rules provided by your preprocessor-of-choice:

```js
const {
  utils: { checkAgainstRule, report }
} = stylelint;

const allowableAtRules = [
  /* .. */
];

const ruleName = "your-own/at-rule-no-unknown";

const myPluginRule = (primary, secondaryOptions, context) => {
  return async (root, result) => {
    const ignoreAtRules = allowableAtRules.concat(
      secondaryOptions?.ignoreAtRules ?? []
    );
    const defaultedSecondaryOptions = { ...secondaryOptions, ignoreAtRules };

    await checkAgainstRule(
      {
        ruleName: "at-rule-no-unknown",
        ruleSettings: [primary, defaultedSecondaryOptions],
        root,
        result,
        context
      },
      (warning) => {
        report({
          ruleName,
          result,
          message: warning.text,
          node: warning.node,
          start: { line: warning.line, column: warning.column },
          end: { line: warning.endLine, column: warning.endColumn }
        });
      }
    );
  };
};
```

## `stylelint.rules`

All of the rule functions are available at the `stylelint.rules` object. This allows you to build on top of existing rules for your particular needs.

> [!NOTE]
> Every value in the `stylelint.rules` object is a `Promise` resolving a rule function.

A typical use-case is to build in more complex conditionals that the rule's options allow for. For example, maybe your codebase uses special comment directives to customize rule options for specific stylesheets. You could build a plugin that checks those directives and then runs the appropriate rules with the right options (or doesn't run them at all).

All rules share a common signature. They are a function that accepts two arguments: a primary option and a secondary options object. And that function returns a function that has the signature of a PostCSS plugin, expecting a PostCSS root and result as its arguments.

Here's an example of a plugin that runs `declaration-no-important` only if there is a special directive `@@check-declaration-no-important` somewhere in the stylesheet:

```js
createPlugin(ruleName, (primary) => {
  const rulePromise = stylelint.rules["declaration-no-important"];
  const ruleRunnner = rulePromise.then((rule) => rule(primary));

  return async (root, result) => {
    if (!root.toString().includes("@@check-declaration-no-important")) {
      return;
    }

    (await ruleRunnner)(root, result);
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
