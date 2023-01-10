# Configuring

Stylelint expects a configuration object, and looks for one in a:

- `stylelint` property in `package.json`
- `.stylelintrc{.js,.json,.yaml,.yml}` file
- `stylelint.config.{cjs,js}` file exporting a JS object

Starting from the current working directory, Stylelint stops searching when one of these is found. Alternatively, you can use the [`--config` or `configFile` option](usage/options.md#configfile) to short-circuit the search.

The `.stylelintrc` file (without extension) can be in JSON or YAML format. We recommend adding an extension to help your editor provide syntax checking and highlighting.

The configuration object has the following properties:

## `rules`

Rules determine what the linter looks for and complains about. There are [over 100 rules](rules.md) built into Stylelint. _No rules are turned on by default._

The `rules` property is _an object whose keys are rule names and values are rule configurations_. For example:

```json
{
  "rules": {
    "color-no-invalid-hex": true
  }
}
```

Each rule configuration fits one of the following formats:

- `null` (to turn the rule off)
- a single value (the primary option)
- an array with two values (`[primary option, secondary options]`)

Specifying a primary option turns on a rule.

Many rules provide secondary options for further customization. To set secondary options, use a two-member array. For example:

```json
{
  "rules": {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ]
  }
}
```

You can add any number of keys to the object. For example, you can:

- turn off `block-no-empty`
- turn on `unit-allowed-list` with a primary option
- turn on `alpha-value-notation` with a primary and secondary option

```json
{
  "rules": {
    "block-no-empty": null,
    "unit-allowed-list": ["em", "rem", "%", "s"],
    "alpha-value-notation": ["percentage", { "exceptProperties": ["opacity"] }]
  }
}
```

Some rules and options accept regex. You can enforce these common cases:

- kebab-case: `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
- lowerCamelCase: `^[a-z][a-zA-Z0-9]+$`
- snake*case: `^([a-z][a-z0-9]\*)(*[a-z0-9]+)\*$`
- UpperCamelCase: `^[A-Z][a-zA-Z0-9]+$`

Or enforce a prefix using a positive lookbehind regex. For example, `(?<=foo-)` to prefix with `foo-`.

### `disableFix`

You can set the `disableFix` secondary option to disable autofix _on a per-rule basis_.

For example:

```json
{
  "rules": {
    "color-function-notation": ["modern", { "disableFix": true }]
  }
}
```

### `message`

You can use the `message` secondary option to deliver a custom message when a rule is violated.

For example, the following rule configuration would substitute in custom messages:

```json
{
  "rules": {
    "custom-property-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        "message": "Expected custom property name to be kebab-case"
      }
    ]
  }
}
```

Alternately, you can write a [custom formatter](../developer-guide/formatters.md) for maximum control if you need serious customization.

Experimental feature: some rules support message arguments. For example, when configuring the `color-no-hex` rule, the hex color can be used in the message string:

`.stylelintrc.js`:

```js
{
  'color-no-hex': [true, {
    message: (hex) => `Don't use hex colors like "${hex}"`,
  }]
}
```

`.stylelintrc.json`:

<!-- prettier-ignore -->
```json
{
  "color-no-hex": [true, {
    "message": "Don't use hex colors like \"%s\""
  }]
}
```

With formats that don't support a function like JSON, you can use a `printf`-like format (e.g., `%s`). On the other hand, with JS format, you can use both a `printf`-like format and a function.

### `reportDisables`

You can set the `reportDisables` secondary option to report any `stylelint-disable` comments for this rule, effectively disallowing authors to opt-out of it.

For example:

```json
{
  "rules": {
    "color-no-invalid-hex": [true, { "reportDisables": true }]
  }
}
```

The report is considered to be a lint error.

### `severity`

You can use the `severity` secondary option to adjust any specific rule's severity.

The available values for `severity` are:

- `"warning"`
- `"error"` (default)

For example:

```json
{
  "rules": {
    "number-max-precision": [
      2,
      {
        "ignoreUnits": ["em"],
        "severity": "warning"
      }
    ]
  }
}
```

Reporters may use these severity levels to display problems or exit the process differently.

## `extends`

You can extend an existing configuration (whether your own or a third-party one). Configurations can bundle plugins, custom syntaxes, options, and configure rules. They can also extend other configurations.

For example, [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) is one of our official configs that you can extend.

When one configuration extends another, it starts with the other's properties and then adds to and overrides what's there.

For example, to extend the [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) and then change the alpha values to numbers and turn off the `selector-class-pattern` rule:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "alpha-value-notation": "number",
    "selector-class-pattern": null
  }
}
```

You can extend an array of existing configurations, with each item in the array taking precedence over the previous item (so the second item overrides rules in the first, the third item overrides rules in the first and the second, and so on, the last item overrides everything else).

For example, with `stylelint-config-standard`, then layer `myExtendableConfig` on top of that, and then override the `alpha-value-notation` rule:

```json
{
  "extends": ["stylelint-config-standard", "./myExtendableConfig"],
  "rules": {
    "alpha-value-notation": "number"
  }
}
```

The value of `"extends"` is a "locater" (or an array of "locaters") that is ultimately `require()`d. It can fit whatever format works with Node's `require.resolve()` algorithm. That means a "locater" can be:

- the name of a module in `node_modules` (e.g. `stylelint-config-standard`; that module's `main` file must be a valid JSON configuration)
- an absolute path to a file (which makes sense if you're creating a JS object in a Node.js context and passing it in) with a `.js` or `.json` extension.
- a relative path to a file with a `.js` or `.json` extension, relative to the referencing configuration (e.g. if configA has `extends: "../configB"`, we'll look for `configB` relative to configA).

You'll find more configs in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme).

## `plugins`

Plugins are custom rules or sets of custom rules built to support methodologies, toolsets, _non-standard_ CSS features, or very specific use cases.

For example, [stylelint-order](https://www.npmjs.com/package/stylelint-order) is a popular plugin pack to order things like properties within declaration blocks.

Plugins are often included within shared configs [that you can extend](#extends). For example, the [stylelint-config-standard-scss](https://www.npmjs.com/package/stylelint-config-standard-scss) config includes the [stylelint-scss](https://www.npmjs.com/package/stylelint-scss) plugin.

To use a plugin directly, add a `"plugins"` array to your config, containing either [plugin objects](../developer-guide/plugins.md) or "locaters" identifying the plugins you want to use. As with `extends`, above, a "locater" can be either a:

- npm module name
- absolute path
- path relative to the invoking configuration file

Once the plugin is declared, within your `"rules"` object _you'll need to add options_ for the plugin's rule(s), just like any standard rule. Look at the plugin's documentation to know what the rule name should be.

```json
{
  "plugins": ["../special-rule.js"],
  "rules": {
    "plugin-namespace/special-rule": "everything"
  }
}
```

A "plugin" can provide a single rule or a set of rules. If the plugin you use provides a set, invoke the module in your `"plugins"` configuration value, and use the rules it provides in `"rules"`. For example:

```json
{
  "plugins": ["../some-rule-set.js"],
  "rules": {
    "some-rule-set/first-rule": "everything",
    "some-rule-set/second-rule": "nothing",
    "some-rule-set/third-rule": "everything"
  }
}
```

You'll find more plugins in [awesome-stylelint](https://github.com/stylelint/awesome-stylelint#plugins).

## `customSyntax`

Specify a custom syntax to use on your code. [More info](usage/options.md#customsyntax).

## `overrides`

Using the `overrides` property, you can specify what subset of files to apply a configuration to.

For example, to use the:

- `postcss-scss` syntax for all `.scss` files
- `percentage` notation for all alpha values in all `.css` files in the `components` and `pages` directories

```json
{
  "rules": {
    "alpha-value-notation": "number"
  },
  "overrides": [
    {
      "files": ["*.scss", "**/*.scss"],
      "customSyntax": "postcss-scss"
    },
    {
      "files": ["components/**/*.css", "pages/**/*.css"],
      "rules": {
        "alpha-value-notation": "percentage"
      }
    }
  ]
}
```

The value of the `overrides` property is an array of objects. Each object:

- must contain a `files` property, which is an array of glob patterns that specify which files the configuration should be applied to
- should contain at least one other regular configuration property, such as `customSyntax`, `rules`, `extends`, etc.

The `customSyntax` property will be replaced, whereas `plugins`, `extends`, `rules`, etc. will be appended.

Patterns are applied against the file path relative to the directory of the config file. For example, if your config file has the path `/project-foo/.stylelintrc.js` and the file you want to lint has the path `/project-foo/components/bar.css`, then the pattern provided in `.stylelintrc.js` will be executed against the relative path `components/bar.css`.

Overrides have higher precedence than regular configurations. Multiple overrides within the same config are applied in order. That is, the last override block in a config file always has the highest precedence.

## `defaultSeverity`

You can set the default severity level for all rules that do not have a severity specified in their secondary options. For example, you can set the default severity to `"warning"`:

```json
{
  "defaultSeverity": "warning"
}
```

## `report*`

These `report*` properties provide extra validation for `stylelint-disable` comments. This can help enforce useful and well-documented disables.

The available reports are:

- [`reportDescriptionlessDisables`](#reportdescriptionlessdisables)
- [`reportInvalidScopeDisables`](#reportinvalidscopedisables)
- [`reportNeedlessDisables`](#reportneedlessdisables)

They are configured like rules. They can have one of three values:

- `null` (to turn the configuration off)
- `true` or `false` (the primary option)
- an array with two values (`[primary option, secondary options]`)

The following secondary options are available:

- `"except"` takes an array of rule names for which the primary option should be inverted.
- `"severity"` adjusts the level of error emitted for the rule, [as above](#severity).

For example, this produces errors for needless disables of all rules except `selector-max-type`:

```json
{
  "reportNeedlessDisables": [true, { "except": ["selector-max-type"] }]
}
```

And this emits warnings for disables of `unit-allowed-list` that don't have a description:

```json
{
  "reportDescriptionlessDisables": [
    false,
    {
      "except": ["unit-allowed-list"],
      "severity": "warning"
    }
  ]
}
```

### `reportDescriptionlessDisables`

Report `stylelint-disable` comments without a description. A [`report*`](#report) property.

For example:

```json
{
  "reportDescriptionlessDisables": true
}
```

[More info](usage/options.md#reportdescriptionlessdisables).

### `reportInvalidScopeDisables`

Report `stylelint-disable` comments that don't match rules that are specified in the configuration object. A [`report*`](#report) property.

For example:

```json
{
  "reportInvalidScopeDisables": true
}
```

[More info](usage/options.md#reportinvalidscopedisables).

### `reportNeedlessDisables`

Report `stylelint-disable` comments that don't match any lints that need to be disabled. A [`report*`](#report) property.

For example:

```json
{
  "reportNeedlessDisables": true
}
```

[More info](usage/options.md#reportneedlessdisables).

## `ignoreDisables`

Ignore `stylelint-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments.

For example:

```json
{
  "ignoreDisables": true
}
```

[More info](usage/options.md#ignoredisables).

## `ignoreFiles`

You can provide a glob or array of globs to ignore specific files.

For example, you can ignore all JavaScript files:

```json
{
  "ignoreFiles": ["**/*.js"]
}
```

Stylelint ignores the `node_modules` directory by default. However, this is overridden if `ignoreFiles` is set.

If the globs are absolute paths, they are used as is. If they are relative, they are analyzed relative to

- `configBasedir`, if it's provided;
- the config's filepath, if the config is a file that Stylelint found and loaded;
- or `process.cwd()`.

_Note that this is not an efficient method for ignoring lots of files._ If you want to ignore a lot of files efficiently, use [`.stylelintignore`](ignore-code.md) or adjust your files globs.
