# Writing plugins

Plugins are rules and sets of rules built by the community. We recommend adhering to stylelint's [conventions for writing rules](/docs/developer-guide/rules.md#come-up-with-a-name), including conventions for names, options, messages, tests and docs. These will help create a consistent user experience.

## The anatomy of a plugin

```js
// Abbreviated example
var stylelint = require("stylelint")

var ruleName = "plugin/foobar"

stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected ...",
})

var myPluginRule = stylelint.createPlugin(ruleName, function(primaryOption, secondaryOptionObject) {
  return function(postcssRoot, postcssResult) {
    var validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, { .. })
    if (!validOptions) { return }
    // ... some logic ...
    stylelint.utils.report({ .. })
  }
})
```

Your plugin's rule name must be namespaced, e.g. `your-namespace/your-rule-name`. If your plugin provides only a single rule or you can't think of a good namespace, you can simply use `plugin/my-rule`. This namespace ensures that plugin rules will never clash with core rules. *Make sure you document your plugin's rule name (and namespace) for users, because they will need to use it in their config.*

`stylelint.createPlugin(ruleName, ruleFunction)` ensures that your plugin will be setup properly alongside other rules.

In order for your plugin rule to work with the standard configuration format, (e.g. `["tab", { hierarchicalSelectors: true }]`), `ruleFunction` should accept 2 arguments: the primary option (e.g. `"tab"`) and, optionally, an secondary options object (e.g. `{ hierarchicalSelectors: true }`).

`ruleFunction` should return a function that is essentially a little PostCSS plugin: it takes 2 arguments: the PostCSS Root (the parsed AST), and the PostCSS LazyResult. You'll have to [learn about the PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md).

## `stylelint.utils`

A few of stylelint's internal utilities are exposed publicly in `stylelint.utils`, to help you write plugin rules. For details about the APIs of these functions, please look at comments in the source code and examples in the standard rules.

You will want to use:

- `report`: Report your linting warnings. *Do not use `node.warn()` directly.* If you use `report`, your plugin will respect disabled ranges and other possible future features of stylelint, so it will fit in better with the standard rules.
- `ruleMessages`: Tailor your messages to look like the messages of other stylelint rules.
- `validateOptions`: Help your user's out by checking that the options they've submitted are valid.

**`stylelint.util.styleSearch` is deprecated and will be removed in v7. Use the external module [style-search](https://github.com/davidtheclark/style-search) instead.**

## `stylelint.rules`

All of the rule functions are available at `stylelint.rules`. This allows you to build on top of existing rules for your particular needs.

A typical use-case is to build in more complex conditionals that the rule's options allow for. For example, maybe your codebase uses special comment directives to customize rule options for specific stylesheets. You could build a plugin that checks those directives and then runs the appropriate rules with the right options (or doesn't run them at all).

All rules share a common signature. They are a function that accepts two arguments: a primary option and a secondary options object. And that functions returns a function that has the signature of a PostCSS plugin, expecting a PostCSS root and result as its arguments.

Here's a simple example of a plugin that runs `color-hex-case` only if there is a special directive `@@check-color-hex-case` somewhere in the stylesheet:

```js
export default stylelint.createPlugin(ruleName, function (expectation) {
  const runColorHexCase = stylelint.rules["color-hex-case"](expectation)
  return (root, result) => {
    if (root.toString().indexOf("@@check-color-hex-case") === -1) return
    runColorHexCase(root, result)
  }
})
```

## External helper modules

In addition to the standard parsers mentioned in the ["Working on rules"](/docs/developer-guide/rules.md) doc, there are other external modules used within stylelint that we recommend using. These include:

- [normalize-selector](https://github.com/getify/normalize-selector) - Normalize CSS selectors.
- [postcss-resolve-nested-selector](https://github.com/davidtheclark/postcss-resolve-nested-selector) - Given a (nested) selector in a PostCSS AST, return an array of resolved selectors.
- [style-search](https://github.com/davidtheclark/style-search) - Search CSS (and CSS-like) strings, with sensitivity to whether matches occur inside strings, comments, and functions.

Have a look through [stylelint's internal utils](https://github.com/stylelint/stylelint/tree/master/src/utils) and if you come across one that you need in your plugin, then please consider helping us extract it out into a external module.

## Testing plugins

For testing your plugin, you might consider using the same rule-testing function that stylelint uses internally: [`stylelint-test-rule-tape`](https://github.com/stylelint/stylelint-test-rule-tape).

## Plugin packs

To make a single module provide multiple rules, simply export an array of plugin objects (rather than a single object).

## Sharing plugins and plugin packs

- Use the `stylelint-plugin` keyword within your `package.json`.
- Once your plugin is published, please send us a Pull Request to add your plugin to [the list](/docs/user-guide/plugins.md).
