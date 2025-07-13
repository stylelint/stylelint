# Configuring

Stylelint expects a configuration object.

Starting from the current working directory, Stylelint searches upwards until it finds a `stylelint.config.js` file that exports one. You can use the [`--config`](cli.md#--config--c) or [`configFile`](options.md#configfile) options to short-circuit the search.

The style of export depends on your [default module system configuration](https://nodejs.org/api/packages.html#determining-module-system) for Node.js, e.g., `"type": "module"` in your `package.json` file. You can use the `stylelint.config.mjs` or `stylelint.config.cjs` filename to be explicit.

Example `stylelint.config.js` file:

```js
/** @type {import('stylelint').Config} */
export default {
  rules: {
    "block-no-empty": true
  }
};
```

> [!NOTE]
> Stylelint currently supports other configuration locations and formats, but we may remove these in the future:
>
> - `.stylelintrc.js` file using `export default` or `module.exports`
> - `.stylelintrc.mjs` file using `export default`
> - `.stylelintrc.cjs` file using `module.exports`
> - `.stylelintrc` file in YAML or JSON format
> - `.stylelintrc.yml` or `.stylelintrc.yaml` file
> - `.stylelintrc.json` file
> - `stylelint` property in `package.json`

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

Some rules accept regular expressions (regex) in the `"/regex/"` format. If you surround a string option with `"/"`, it'll be interpreted as a regex. For example, `"/.+/"` matches any string. You can specify a regex literal in JavaScript, such as `/.+/`, rather than a string with `"/"`.

The `"/regex/"` format is also available in some object keys. For example, when `{ "/^margin/": ["px"] }` is given, the key matches `margin`, `margin-top`, `margin-inline`, etc.

The `*-pattern` rules translate the given string without `"/"` into a regex, like `"^foo"` into `new RegExp("^foo")`. In this case, you can directly specify a regex literal in JavaScript, such as `/^foo/`.

You can enforce these common cases:

<!-- prettier-ignore -->
- kebab-case: `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`
- lowerCamelCase: `^[a-z][a-zA-Z0-9]+$`
- snake\_case: `^([a-z][a-z0-9]*)(_[a-z0-9]+)*$`
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

Some rules support message arguments. For example, when configuring the `color-no-hex` rule, the hex color can be used in the message string:

Via JavaScript:

```js
export default {
  rules: {
    "color-no-hex": [
      true,
      {
        message: (hex) => `Don't use hex colors like "${hex}"`
      }
    ]
  }
};
```

Via JSON:

```json
{
  "rules": {
    "color-no-hex": [
      true,
      {
        "message": "Don't use hex colors like \"%s\""
      }
    ]
  }
}
```

With formats that don't support a function like JSON, you can use a `printf`-like format (e.g., `%s`). On the other hand, with JS format, you can use both a `printf`-like format and a function.

### `url`

You can use the `url` secondary option to provide a custom link to external docs. These urls can then be displayed in custom formatters.

For example:

```json
{
  "rules": {
    "color-no-hex": [true, { "url": "https://example.org/your-custom-doc" }]
  }
}
```

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

Some rules support [message arguments](#message). For these rules, it is possible to use a function for `severity`, which would accept these arguments, allowing you to adjust the severity based on these arguments.

This function must return `"error"`, `"warning"`, or `null`. When it would return `null`, the `defaultSeverity` would be used.

For example, given:

```js
export default {
  rules: {
    "selector-disallowed-list": [
      ["a > .foo", "/\\[data-.+]/"],
      {
        severity: (selector) => {
          return selector.includes("a > .foo") ? "error" : "warning";
        }
      }
    ]
  }
};
```

The following pattern is reported as an error:

<!-- prettier-ignore -->
```css
a > .foo {}
```

But the following pattern would be reported as a warning:

<!-- prettier-ignore -->
```css
a[data-auto="1"] {}
```

## `languageOptions`

You can customize the syntax to define or extend the syntax for at-rules, properties, types, and CSS-wide keywords.

### `syntax`

You can extend or modify the default CSS syntax to customize the following aspects:

- `atRules`: Define custom at-rules with specific `prelude` and `descriptors` syntax
- `cssWideKeywords`: Extend the list of CSS-wide keywords with custom values
- `properties`: Customize the syntax of specific properties
- `types`: Extend or modify type definitions used in property values

```json
{
  "languageOptions": {
    "syntax": {
      "atRules": {
        "example": {
          "comment": "Example at-rule",
          "prelude": "<custom-ident>",
          "descriptors": {
            "foo": "<number>",
            "bar": "<color>"
          }
        }
      },
      "cssWideKeywords": ["my-global-value"],
      "properties": { "top": "| <--foo()>" },
      "types": { "--foo()": "--foo( <length-percentage> )" }
    }
  },
  "rules": {
    "at-rule-descriptor-no-unknown": true,
    "at-rule-descriptor-value-no-unknown": true,
    "at-rule-prelude-no-invalid": true,
    "declaration-property-value-no-unknown": true
  }
}
```

The following rules are configured via the `languageOptions` property:

- [`at-rule-descriptor-no-unknown`](../../lib/rules/at-rule-descriptor-no-unknown/README.md)
- [`at-rule-descriptor-value-no-unknown`](../../lib/rules/at-rule-descriptor-value-no-unknown/README.md)
- [`at-rule-no-unknown`](../../lib/rules/at-rule-no-unknown/README.md)
- [`at-rule-prelude-no-invalid`](../../lib/rules/at-rule-prelude-no-invalid/README.md)
- [`declaration-property-value-no-unknown`](../../lib/rules/declaration-property-value-no-unknown/README.md)
- [`property-no-unknown`](../../lib/rules/property-no-unknown/README.md)

#### `AtRules`

You can customize at-rules by defining their expected prelude and descriptors.
For example, to support a new at-rule `@foo` with specific descriptors:

```json
{
  "languageOptions": {
    "syntax": {
      "atRules": {
        "foo": {
          "prelude": "<custom-ident>",
          "descriptors": {
            "bar": "<number>",
            "baz": "<color>"
          }
        }
      }
    }
  }
}
```

When `at-rule-descriptor-no-unknown` is enabled, the following patterns are considered problems:

<!-- prettier-ignore -->
```css
@foo custom-ident { qux: 10; }
```

When `at-rule-descriptor-value-no-unknown` is enabled, the following patterns are considered problems:

<!-- prettier-ignore -->
```css
@foo custom-ident { bar: red; }
```

In both cases, the following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@foo custom-ident { bar: 10; baz: red; }
```

#### `cssWideKeywords`

You can add custom global keywords that are accepted as valid property values.
For example, to add `-moz-initial` to the [wide keywords](https://drafts.csswg.org/css-values-4/#css-wide-keywords):

```json
{
  "languageOptions": {
    "syntax": {
      "cssWideKeywords": ["-moz-initial"]
    }
  }
}
```

When `declaration-property-value-no-unknown` is enabled, the following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: foo; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: -moz-initial; }
```

#### `properties`

You can extend or modify the syntax for specific properties.
For example, to support a custom `foo` property that accepts `<color>` values:

```json
{
  "languageOptions": {
    "syntax": {
      "properties": { "foo": "<color>" }
    }
  }
}
```

When `declaration-property-value-no-unknown` is enabled, The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { foo: 10px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { foo: red; }
```

#### `types`

You can extend or modify the syntax for specific types.
For example, to support a new function `--foo()` that accepts `<length-percentage>` values and use it within the top property:

```json
{
  "languageOptions": {
    "syntax": {
      "types": { "--foo()": "--foo( <length-percentage> )" },
      "properties": { "top": "| <--foo()>" }
    }
  }
}
```

When `declaration-property-value-no-unknown` is enabled, the following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { top: --foo(red); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { top: --foo(10px); }
```

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

You'll find more configs in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#configs) and [on the npm registry](https://www.npmjs.com/search?q=keywords:stylelint-config).

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

You'll find more plugins in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#plugins) and [on the npm registry](https://www.npmjs.com/search?q=keywords:stylelint-plugin).

## `customSyntax`

Specify a custom syntax to use on your code. [More info](options.md#customsyntax).

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
- may contain a `name` property to provide a description of the override's purpose

The `customSyntax` property will be replaced, whereas `plugins`, `extends`, `rules`, etc. will be appended.

Patterns are applied against the file path relative to the directory of the config file. For example, if your config file has the path `/project-foo/.stylelintrc.js` and the file you want to lint has the path `/project-foo/components/bar.css`, then the pattern provided in `.stylelintrc.js` will be executed against the relative path `components/bar.css`.

Overrides have higher precedence than regular configurations. Multiple overrides within the same config are applied in order. That is, the last override block in a config file always has the highest precedence.

## `processors`

> [!WARNING]
> This is an experimental feature. The API may change in the future.
>
> This `processors` property was [removed in 15.0.0](../migration-guide/to-15.md#removed-processors-configuration-property), but has revived for post-processing. Note that this is different from the previous behavior.

Processors are functions that hook into Stylelint's pipeline.
Currently, processors contains only two properties: a string `name` and a function `postprocess`. `postprocess` runs after all rules have been evaluated. This function receives the `result` object of the linting process and can modify it.

For example, you can use a processor to remap the result location. Below processor expands the warning location for 'color-no-hex' rule to the entire CSS declaration. A warning for a hex color in a rule like `a { color: #111; }` would originally point to the hex color itself (e.g., line 1, columns 12-16). After processing, the warning will encompass the entire declaration (e.g., line 1, columns 5-16).

```json
{
  "rules": { "color-no-hex": true },
  "processors": ["path/to/my-processor.js"]
}
```

```js
// my-processor.js

/** @type {import("stylelint").Processor} */
export default function myProcessor() {
  return {
    name: "remap-color-no-hex",

    postprocess(result, root) {
      const updatedWarnings = result.warnings.map((warning) => {
        if (warning.rule !== "color-no-hex") {
          return warning;
        }

        let updatedWarning = { ...warning };

        root?.walk((node) => {
          const { start, end } = node.source;

          if (
            node.type === "decl" &&
            start.line <= warning.line &&
            end.line >= warning.endLine &&
            start.column <= warning.column &&
            end.column >= warning.endColumn
          ) {
            updatedWarning = {
              ...updatedWarning,
              line: start.line,
              endLine: end.line,
              column: start.column,
              endColumn: end.column
            };

            return false;
          }
        });

        return updatedWarning;
      });

      result.warnings = updatedWarnings;
    }
  };
}
```

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
- [`reportUnscopedDisables`](#reportunscopeddisables)

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

[More info](options.md#reportdescriptionlessdisables).

### `reportInvalidScopeDisables`

Report `stylelint-disable` comments that don't match rules that are specified in the configuration object. A [`report*`](#report) property.

For example:

```json
{
  "reportInvalidScopeDisables": true
}
```

[More info](options.md#reportinvalidscopedisables).

### `reportNeedlessDisables`

Report `stylelint-disable` comments that don't match any lints that need to be disabled. A [`report*`](#report) property.

For example:

```json
{
  "reportNeedlessDisables": true
}
```

[More info](options.md#reportneedlessdisables).

### `reportUnscopedDisables`

Report configuration comments that are not scoped to at least one rule. A [`report*`](#report) property.

For example:

```json
{
  "reportUnscopedDisables": true
}
```

[More info](options.md#reportunscopeddisables).

## `configurationComment`

You can set what configuration comments like `/* stylelint-disable */` start with. This can be useful if you use multiple instances of Stylelint with different configurations.

For example, to have an instance of Stylelint disable rules with `/* stylelint-foo-instance-disable */` instead of the default `/* stylelint-disable */`:

```json
{
  "configurationComment": "stylelint-foo-instance"
}
```

## `ignoreDisables`

Ignore `stylelint-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments.

For example:

```json
{
  "ignoreDisables": true
}
```

[More info](options.md#ignoredisables).

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

> [!NOTE]
> This is **not an efficient method for ignoring lots of files**. If you want to ignore a lot of files efficiently, use [`.stylelintignore`](ignore-code.md) or adjust your files globs.

## `allowEmptyInput`

Stylelint does not throw an error when the glob pattern matches no files.

For example:

```json
{
  "allowEmptyInput": true
}
```

> [!NOTE]
> This config option should not be overridden on a per-file basis.

[More info](options.md#allowemptyinput).

## `cache`

Store the results of processed files so that Stylelint only operates on the changed ones.

For example:

```json
{
  "cache": true
}
```

> [!NOTE]
> This config option should not be overridden on a per-file basis.

[More info](options.md#cache).

## `fix`

Automatically fix, where possible, problems reported by rules.

For example:

```json
{
  "fix": true
}
```

> [!NOTE]
> This config option should not be overridden on a per-file basis.

[More info](options.md#fix).

## `formatter`

Specify the formatter to format your results.

Options are:

- The name of a provided formatter.
  ```json
  {
    "formatter": "string"
  }
  ```
- A path to a custom formatter function.
  ```json
  {
    "formatter": "path/to/customformatter.js"
  }
  ```
- A formatter function.
  ```js
  export default {
    formatter: () => {
      /* ... */
    }
  };
  ```

You'll find more formatters in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#formatters) and [on the npm registry](https://www.npmjs.com/search?q=keywords:stylelint-formatter).

[More info](options.md#formatter).
