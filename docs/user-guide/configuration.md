# Configuration

The linter *expects a configuration object*. You can either craft your own config or extend an existing one.

## Loading the configuration object

Finding and loading of your configuration object is done with [cosmiconfig](https://github.com/davidtheclark/cosmiconfig). Starting from the current working directory, it will look for the following possible sources, in this order:

- a `stylelint` property in `package.json`
- a `.stylelintrc` file
- a `stylelint.config.js` file exporting a JS object

The `.stylelintrc` file (without extension) can be in JSON or YAML format. Alternately, you can add a filename extension to designate JSON, YAML, or JS format: `.stylelintrc.json`, `.stylelintrc.yaml`, `.stylelintrc.js`. You may want to use an extension so that your text editor can better interpret the file, and help with syntax checking and highlighting.

Once one of these is found and parsed, the search will stop and that object will be used.

The configuration search can be short-circuited by using either the `config` or `configFile` options.

## The configuration object

The configuration object can have the following properties. Only `rules` is required.

### `rules`

Rules determine what the linter looks for and complains about. There are [over 100](/docs/user-guide/rules.md) built into stylelint. *No rules are turned on by default*, so this is where you turn on everything you want to check. All the rules must be explicitly configured as *there are no default values*.

The `rules` property is *an object whose keys are rule names and values are rule configurations*. Each rule configuration fits one of the following formats:

- a single value (the primary option)
- an array with two values (`[primary option, secondary options]`)
- `null` (to turn the rule off)

```json
{
  "rules": {
    "block-no-empty": null,
    "color-no-invalid-hex": true,
    "declaration-colon-space-after": "always",
    "indentation": ["tab", {
      "except": ["value"]
    }],
    "max-empty-lines": 2,
    "unit-whitelist": ["em", "rem", "%", "s"]
  }
}
```

Specifying a primary option will turn a rule on.

#### Turning rules off from within your CSS

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

And you can turn off rules for individual lines only, after which you do not need to explicitly re-enable them:

```css
#id { /* stylelint-disable-line */
  color: pink !important; /* stylelint-disable-line declaration-no-important */
}
```

Complex, overlapping disabling & enabling patterns are supported:

```css
/* stylelint-disable */
/* stylelint-enable foo */
/* stylelint-disable foo */
/* stylelint-enable */
/* stylelint-disable foo, bar */
/* stylelint-disable baz */
/* stylelint-enable baz, bar */
/* stylelint-enable foo */
```

#### Severities: error & warning

By default, all rules have an `"error"`-level severity.

To downgrade any rule use the secondary option `severity`. The available values for `severity` are:

- `"warning"`
- `"error"`

```js
// error-level severity examples
{ "indentation": 2 }
{ "indentation": [2] }

// warning-level severity examples
{ "indentation": [2, { "severity": "warning" } ] }
{ "indentation": [2, {
    "except": ["value"],
    "severity": "warning"
  }]
}
```

Different reporters may use these severity levels in different way, e.g. display them differently, or exit the process differently.

#### Custom Messages

If you want to deliver a custom message when a rule is violated, you can do so in two ways: provide a `message` option for the rule, or write a custom formatter.

All rules accept a `message` secondary option that, if provided, will be substituted for whatever standard message would be provided. For example, the following rule configuration would substitute in a couple of custom message:

```json
{
  "color-hex-case": [ "lower", {
    "message": "Lowercase letters are easier to distinguish from numbers"
  } ],
  "indentation": [ 2, {
    "ignore": ["block"],
    "message": "Please use 2 spaces for indentation. Tabs make The Architect grumpy.",
    "severity": "warning"
  } ]
}
```

Writing a [custom formatter](/docs/developer-guide/formatters.md) gives you maximum control if you need serious customization.

### `extends`

Your configuration can *extend* an existing configuration (whether your own or a third-party config). When one configuration extends another, it starts with the other's properties then adds to and overrides what's there.

You can extend an array of existing configurations, with each item in the array taking precedence over the following (so the first item overrides everything else, the second item overrides everything but the first, the last gets overridden by everything else, etc.).

For example, extending the [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard) and then changing indentation to tabs and turning off the `number-leading-zero` rule:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "indentation": "tab",
    "number-leading-zero": null
  }
}
```

Or starting with `stylelint-config-standard`, then layering `myExtendableConfig` on top of that, and then overriding the indentation rule:

```json
{
  "extends": [
    "stylelint-config-standard",
    "./myExtendableConfig"
  ],
  "rules": {
    "indentation": "tab"
  }
}
```

The value of `"extends"` is a "locater" (or an array of "locaters") that is ultimately `require()`d, so can fit whatever format works with Node's `require.resolve()` algorithm. That means the a "locater" can be:

- The name of a module in `node_modules` (e.g. `stylelint-config-standard`; that module's `main` file must be a valid JSON configuration)
- An absolute path to a file (which makes sense if you're creating a JS object in a Node context and passing it in) with a `.js` or `.json` extension.
- A relative path to a file with a `.js` or `.json` extension, relative to the referencing configuration (e.g. if configA has `extends: "../configB"`, we'll look for `configB` relative to configA).

*Because of `extends`, you can create and use shareable stylelint configurations.*

### `plugins`

Plugins are rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases. To use one, add a `"plugins"` array to your config, containing "locaters" identifying the plugins you want to use. As with `extends`, above, a "locater" can be either an npm module name, an absolute path, or a path relative to the invoking configuration file.

Once the plugin is declared, within your `"rules"` object *you'll need to add options* for the plugin's rule just like any standard rule. You will have to look at the plugin's documentation to know what the rule name should be.

```json
{
  "plugins": [
    "../special-rule.js"
  ],
  "rules": {
    "special-rule": "everything"
  },
}
```

### `ignoreFiles`

Provide a glob or array of globs to ignore specific files.

If the globs are absolute paths, they are used as is. If they are relative, they are analyzed relative to

- `configBasedir`, if it's provided;
- the config's filepath, if the config is a file that stylelint found a loaded;
- or `process.cwd()`.

The `ignoreFiles` property is stripped from extended configs: only the root-level config can ignore files.
