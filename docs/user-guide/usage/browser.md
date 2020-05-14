# Web Browser (experimental)

You can use stylelint in the browser using the experimental ES module (ESM) bundle.

The ESM bundle supports a subset of the [Node API](./node-api.md)'s functionality.

If you started with the Node API, then removed all parts that read or write to a filesystem you'd end up with something similar to the ESM bundle. (TODO: make this better)

All code, config and other options must be provided inline. Notably the ESM bundle has _no_ support for config files, ignore files, CLI usage, or automatic loading of plugins, rules or syntaxes. (TODO: verify accuracy of this line)

An example:

```html
<html>
  <head></head>
  <body>
    <script type="module">
      import stylelint from "./stylelint.js";

      const result = await stylelint({
        code: `a {color: #FFF; }`,
        config: {
          rules: {
            "color-hex-length": "long"
          }
        }
      });

      console.log(result);
    </script>
  </body>
</html>
```

### Formatters

JSON formatter only. No other formatters supported (for now)

TODO: expand this section

### Syntaxes

Plain css syntax available by default.

Syntax bundles can be large. Therefore other syntaxes must be loaded manually (see examples)

No auto-inference. (TODO: maybe provide auto-syntax bundle? let people run auto-inference if they don't care about the bundle size)

Bundles are provided for all officially supported syntaxes

TODO: expand this section

## Options

The supported options are as listed:

### `config`

A [configuration object](../configure.md).

TODO: This is a required option

### `code`

A string to lint.

TODO: This is a required option

### `configOverrides`

TODO: does this work?

A partial stylelint configuration object whose properties override the existing config object, whether stylelint loads the config via the `config` option or a `.stylelintrc` file.

### `fix`

Automatically fix, where possible, violations reported by rules.

For CSS with standard syntax, stylelint uses [postcss-safe-parser](https://github.com/postcss/postcss-safe-parser) to fix syntax errors.

If a source contains a:

- scoped disable comment, e.g. `/* stylelint-disable indentation */`, any violations reported by the scoped rules will not be automatically fixed anywhere in the source
- unscoped disable comment, i.e. `/* stylelint-disable */`, the entirety of source will not be automatically fixed

This limitation in being tracked in [issue #2643](https://github.com/stylelint/stylelint/issues/2643).

### `maxWarnings`

Set a limit to the number of warnings accepted.

If the number of warnings exceeds this value, a [`maxWarningsExceeded`](node-api.md#maxwarningsexceeded) property is added to the returned data

### `syntax`

Specify a syntax.

If you do not specify a syntax, stylelint automatically infer the syntaxes.

Syntax must be an object with:

```
{
  parse: function,
  stringify: function
}
```

You must set this option to match the syntax you're parsing.

### `customSyntax`

TODO: for ESM bundle override this instead of syntax option?

Module name or path to a JS file exporting a [PostCSS-compatible syntax](https://github.com/postcss/postcss#syntaxes).

Note, however, that stylelint can provide no guarantee that core rules work with syntaxes other than the defaults listed for the `syntax` option above.

### `ignoreDisables`

Ignore `stylelint-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments.

You can use this option to see what your linting results would be like without those exceptions.

### `reportNeedlessDisables`

Produce a report to clean up your codebase, keeping only the stylelint-disable comments that serve a purpose.

If needless disables are found, a [`needlessDisables`](node-api.md#needlessdisables) property is added to the returned data

### `reportInvalidScopeDisables`

CLI flags: `--report-invalid-scope-disables, --risd`

Produce a report of the stylelint-disable comments that used for rules that don't exist within the configuration object.

If invalid scope disables are found, a [`invalidScopeDisables`](node-api.md#invalidscopedisables) property is added to the returned data

## The returned promise

`stylelint.lint()` returns a Promise that resolves with an object containing the following properties:

### `errored`

Boolean. If `true`, at least one rule with an "error"-level severity registered a violation.

### `output`

A string displaying the formatted violations (using the default formatter or whichever you passed).

### `postcssResults`

An array containing all the accumulated [PostCSS LazyResults](https://api.postcss.org/LazyResult.html).

### `results`

An array containing all the stylelint result objects (the objects that formatters consume).

### `maxWarningsExceeded`

An object containing the maximum number of warnings and the amount found, e.g. `{ maxWarnings: 0, foundWarnings: 12 }`.

### `needlessDisables`

An array of objects, one for each source, with tells you which stylelint-disable comments are not blocking a lint violation

### `invalidScopeDisables`

An array of objects, one for each source, with tells you which rule in `stylelint-disable <rule>` comment don't exist within the configuration object.

## Syntax errors

`stylelint.lint()` does not reject the Promise when your CSS contains syntax errors.
It resolves with an object (see [The returned promise](#the-returned-promise)) that contains information about the syntax error.

## Usage examples

The ESM bundle

### Example A - default syntax

```js
import stylelint from "./stylelint.js";

const result = await stylelint({
  code: `a {color: #FFF; }`,
  config: {
    rules: {
      "color-hex-length": "long"
    }
  }
});
```

### Example B - alternate syntax

```js
import { stylelint } from "./stylelint.js";
import { scss } from "./syntaxes/scss.js";

const result = await stylelint({
  code: `a {color: #FFF; }`,
  config: {
    rules: {
      "color-hex-length": "long"
    }
  },
  syntax: "scss",
  customSyntax: scss
});
```

### Example C - syntax register

```js
import { stylelint } from "./stylelint.js";
import { scss } from "./syntaxes/scss.js";

const result = await stylelint({
  code: `a {color: #FFF; }`,
  config: {
    rules: {
      "color-hex-length": "long"
    }
  },
  syntax: "scss",
  register: { syntax: scss }
});
```

### Example C - ~syntax~ generic 'add-on' register

```js
import { stylelint } from "./stylelint.js";
import { scss } from "./syntaxes/scss.js";
import { myCoolPlugin } from "./my-cool-plugin.js";

const result = await stylelint({
  code: `a {color: #FFF; }`,
  config: {
    plugins: ["my-cool-plugin"],
    rules: {
      "color-hex-length": "long",
      "my-cool-plugin/blah": true
    }
  },
  syntax: "scss",
  syntaxes: [scss],
  plugins: [myCoolPlugin]
});
```
