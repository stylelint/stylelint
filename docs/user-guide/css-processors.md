# CSS processors

The linter supports current and future CSS syntax. This includes all standard CSS but also special features that use standard CSS syntactic structures, e.g. special at-rules, special properties, and special functions. Some CSS-*like* language extensions --   features that use non-standard syntactic structures --   are, as such, supported; however, since there are infinite processing possibilities, the linter cannot support everything.

You can run the linter before or after your css processors. Depending on which processors you use, each approach has caveats:

1.  *Before*: Some plugins/processors might enable a syntax that isn't compatible with the linter.
2.  *After*: Some plugins/processors might generate CSS that is invalid against your linter config, causing warnings that do not correspond to your original stylesheets.

*In both cases you can either turn off the incompatible linter rule, or stop using the incompatible plugin/processor.* You could also approach plugin/processor authors and request alternate formatting options that will make their plugin/processor compatible with stylelint.

## Parsing non-standard syntax

The linter can *parse* any the following non-standard syntaxes by using special PostCSS parsers:

-   SCSS (using [`postcss-scss`](https://github.com/postcss/postcss-scss))
-   Less (using [`postcss-less`](https://github.com/webschik/postcss-less))
-   SugarSS (using [`sugarss`](https://github.com/postcss/sugarss))

(Whenever someone writes a PostCSS parser for another syntax, stylelint can easily add support for that.)

*Non-standard syntaxes are automatically inferred from file extensions `.less`, `.scss`, and `.sss`.* If you would need to specify your non-standard syntax, though, both the [CLI](/docs/user-guide/cli.md) and the [Node API](docs/user-guide/cli.md) expose a `syntax` option.

-   If you're using the CLI, use the `syntax` flag like so:  `stylelint ... --syntax scss`
-   If you're using the Node API, pass in the `syntax` option like so: `stylelint.lint({ syntax: "sugarss", ... })`.

If you're using the linter as a [PostCSS Plugin](/docs/user-guide/postcss-plugin.md), you'll need to use the special parser directly with PostCSS's `syntax` option like so:

```js
var postcss = require("postcss")
var scss = require("postcss-scss")
// or use "postcss-less" or "sugarss"

postcss([
  require("stylelint"),
  require("reporter")
])
  .process(css, {
    from: "src/app.css",
    syntax: scss
  })
})
```
