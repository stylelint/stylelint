# Configuration

The linter _expects a configuration object_. You can either craft your own config or extend an existing one.

For the Node API and PostCSS plugin, you can either pass a configuration object directly or create a `.stylelintrc` JSON file.
For the CLI, you must use a `.stylelintrc` file or point to some other JSON file.

## The Configuration Object

The configuration object can have the following properties. Only `rules` is required.

### `rules`

[Rules](/docs/user-guide/rules.md) determine what the linter looks for and complains about.
*No rules are turned on by default*, so this is where you turn on everything you want to check.

**The `rules` property is an object whose keys are rule names and values are rule configurations.**
Each rule configuration is either a single severity number (0-2) or an array with the following information:
`[severity, primary option, secondary options]`.

```json
{
  "rules": {
    "color-no-invalid-hex": 2,
    "declaration-colon-space-after": [1, "always"],
    "indentation": [2, "tab", {
      "except": ["value"]
    }]
  }
}
```

### `extends`

Your configuration can *extend* an existing configuration (whether your own or a third-party config).
When one configuration extends another, it starts with the other's properties then adds to and overrides what's there.

You can extend an array of existing configurations, with each item in the array taking precedence over the following (so the first item overrides everything else, the second item overrides everything but the first, the last gets overridden by everything else, etc.).

For example, extending the [`stylelint-config-suitcss`](https://github.com/stylelint/stylelint-config-suitcss) and then changing indentation to tabs and turning off the number-leading-zero rule:

```json
{
  "extends": "stylelint-config-suitcss",
  "rules": {
    "indentation": [2, "tab"],
    "number-leading-zero": 0,
  }
}
```

Or starting with `stylelint-config-suitcss`, then extending layering `myExtendableConfig` on top of that, and then overriding the indentation rule:

```json
{
  "extends": [
    "./myExtendableConfig",
    "stylelint-config-suitcss"  
  ],
  "rules": {
    "indentation": [2, "tab"],
  }
}
```

**The value of `"extends"` is a "locater" (or an array of "locaters") that is ultimately `require()`d, so can fit whatever format works with Node's `require.resolve()` algorithm.** That means the a "locater" can be:

- The name of a module in `node_modules` (e.g. `stylelint-config-wordpress`; that module's `main` file must be a valid JSON configuration)
- An absolute path to a file (which makes sense if you're creating a JS object in a Node context and passing it in)
- A relative path to a file, relative to the referencing configuration (e.g. if configA has `extends: "../configB"`, we'll look for `configB` relative to configA).

*Because of `extends`, you can create and use shareable stylelint configurations.*

## `plugins`

[Plugins](/docs/user-guide/plugins.md) are userland rules that support _non-standard_ CSS features, or very specific use cases. To use one, add a `"plugins"` object to your config. Each key is a new rule's name, and its value is a "locater" identifying the plugin.
As with `extends`, above, a "locater" can be either an npm module name, an absolute path, or a path relative to the invoking configuration file.

Once the plugin is declared, within your `"rules"` object you can add settings for the plugin's rule just like any standard rule.

```json
{
  "plugins": {
    "special-rule": "../special-rule.js",
  },
  "rules": {
    "special-rule": [2, "everything"],
  },
}
```

## Configuring rules

[Rules](/docs/user-guide/rules.md) are built into the linter and focus on _standard_ CSS. They are configured within the `rules` key of the config.

### Turning rules on and off

Each rule can be turned off or on:

* `0` - turn the rule off.
* `1` - turn the rule on as a warning (does not affect CLI exit code).
* `2` - turn the rule on as an error (CLI exit code is 1 when triggered).

An example of turning rules on and off:

```js
{
  "rules": {
    "rule-no-single-line": 0, // turn rule off
    "declaration-no-important": 2, // turn rule on
    "indentation": [2, "tabs"] // turn on a rule that has options
  }
}
```

Rules can be temporarily turned off by using special comments in your CSS. For example, you can either turn all the rules off:

```css
/* stylelint-disable */
a {}
/* stylelint-enable */
```

Or you can turn off individual rules:

```css
/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
  color: pink !important;
}
/* stylelint-enable */
```

### Configuring options

Only the `*-no-*` rules don't expect options. All the other rules must be explicitly configured as _there are no default values_.

An example of explicitly configuring the options for three rules:

```js
{
  "rules": {
    "indentation": [2, "tab", {
      "except": ["value"],
    }],
    "declaration-colon-space-before": [2, "never"],
    "number-leading-zero": [2, "always"],
  }
}
```

### Rules work together

The `*-before` and `*-after` whitespace rules can be used together to enforce strict conventions.

Say you want to enforce no space before and a single space after the colon in every declaration:

```css
    a { color: pink; }
/**          ↑
 * No space before and a single space after this colon */
```

You can enforce that with:

```js
"declaration-colon-space-after": [2, "always"],
"declaration-colon-space-before": [2, "never"],
```

Some *things* (e.g. declaration blocks and value lists) can span more than one line. In these cases `newline` rules and extra options can be used to provide flexibility.

For example, this is the complete set of `value-list-comma-*` rules and their options:

* `value-list-comma-space-after`: `"always"|"never"|"always-single-line"|"never-single-line"`
* `value-list-comma-space-before`: `"always"|"never"|"always-single-line"|"never-single-line"`
* `value-list-comma-newline-after`: `"always"|"always-multi-line|"never-multi-line"`
* `value-list-comma-newline-before`: `"always"|"always-multi-line"|"never-multi-line"`

Where `*-multi-line` and `*-single-line` are in reference to the value list (the *thing*). For example, given:

```css
a,
b {
  color: red;
  font-family: sans, serif, monospace; /* single line value list */
}              ↑                    ↑
/**            ↑                    ↑
 *  The value list start here and ends here */
```

There is only a single-line value list in this example. The selector is multi-line, as is the declaration block and, as such, also the rule. But the value list isn't and that is what the `*-multi-line` and `*-single-line` refer to in the context of this rule.

#### Example A

Say you only want to allow single-line value lists. And you want to enforce no space before and a single space after the commas:

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red, 2px 2px 1px 1px blue inset, 2px 2px 1px 2px blue inset;
}
```

You can enforce that with:

```js
"value-list-comma-space-after": [2, "always"],
"value-list-comma-space-before": [2, "never"],
```

#### Example B

Say you want to allow both single-line and multi-line value lists. You want there to be a single space after the commas in the single-line lists and no space before the commas in both the single-line and multi-line lists:

```css
a {
  font-family: sans, serif, monospace; /* single-line value list with space after, but no space before */
  box-shadow: 1px 1px 1px red, /* multi-line value list ... */
    2px 2px 1px 1px blue inset, /* ... with newline after, ...  */
    2px 2px 1px 2px blue inset; /* ... but no space before */
}
```

You can enforce that with:

```js
"value-list-comma-newline-after": [2, "always-multi-line"],
"value-list-comma-space-after": [2, "always-single-line"],
"value-list-comma-space-before": [2, "never"],
```

#### Example C

Say you want to allow both single-line and multi-line value lists. You want there to be no space before the commas in the single-line lists and always a space after the commas in both lists:

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red
    , 2px 2px 1px 1px blue inset
    , 2px 2px 1px 2px blue inset;
}
```

You can enforce that with:

```js
"value-list-comma-newline-before": [2, "always-multi-line"],
"value-list-comma-space-after": [2, "always"],
"value-list-comma-space-before": [2, "never-single-line"],
```

#### Example D

Lastly, the rules are flexible enough to enforce entirely different conventions for single-line and multi-line lists. Say you want to allow both single-line and multi-line value lists. You want the single-line lists to have a single space before and after the colons. Whereas you want the multi-line lists to have a single newline before the commas, but no space after:


```css
a {
  font-family: sans , serif , monospace; /* single-line list with a single space before and after the comma */
  box-shadow: 1px 1px 1px red /* multi-line list ... */
    ,2px 2px 1px 1px blue inset /* ... with newline before, ...  */
    ,2px 2px 1px 2px blue inset; /* ... but no space after the comma */
}
```

You can enforce that with:


```js
"value-list-comma-newline-after": [2, "never-multi-line"],
"value-list-comma-newline-before": [2, "always-multi-line"],
"value-list-comma-space-after": [2, "always-single-line"],
"value-list-comma-space-before": [2, "always-single-line"],
```
