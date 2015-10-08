# User guide

In this guide you'll find information on usage, configuration and complementary tools.

## Usage

There are three ways to use the linter: the CLI, the standalone JS API and as a [PostCSS plugin](https://github.com/postcss/postcss#usage).

In all three instances you can either directly pass in a config or let the linter look for a `.stylelintrc` file in the _[standard RC](https://github.com/dominictarr/rc#standards)_ locations.

### The CLI

`stylelint --help` should print the following:

```
  Modern CSS linter

  Usage
    stylelint [input] [options]

  By default, stylelint will look for a .stylelintrc file in JSON format,
  using rc to look in various places (cf. https://github.com/dominictarr/rc#standards).
  Alternately, you can specify a configuration file via --config.

  Input
    File glob(s) (passed to node-glob).
    You can also pass no input and use stdin.

  Options
    --config            Path to a JSON configuration file.
    --version           Get the currently installed version of stylelint.
    -f, --formatter     Specify a formatter: "json" or "string". Default is "string".
    --custom-formatter  Path to a JS file exporting a custom formatting function
    -q, --quiet         Only register warnings for rules with a severity of 2 (ignore level 1)
```

And you use it just like that. It outputs formatted results into `process.stdout`, which you could just read or pipe elsewhere.

The CLI accepts `stdin` or a file glob(s).

Some examples:

```
stylelint path/to/things/*.css
```

```
echo "a { color: pink; }" | stylelint
```

```
stylelint path/to/things/*.css --config path/to/.stylelintrc > myTestReport.txt
```

#### Exit codes

Only the CLI exits the process with exit codes. The standalone `stylelint.lint()` is a promise, so people can `.catch()` errors; and the plugin needs to be handled within the plugin context.

The following exit codes might pop up:

- 1: Something just went wrong, who knows
- 2: At least one rule with a severity of 2 triggered at least one warning
- 78: There was some problem with the configuration file
- 80: A file glob was passed both it found no files

### Standalone JS API

```js
stylelint.lint(options)
```
Options:

- `files` (kind of optional): A file glob, ultimately passed to node-glob to figure out what files you're referencing
- `css` (kind of optional): A CSS string to be linted
- `formatter` (optional): Either `"json"`, `"string"`, or a function. Default for `stylelint.lint()` is `"json"`. See above.
- `config` (optional): A stylelint configuration object
- `configBasedir` (optional): If the `config` object passed wants to use `extends` or `plugins`, it is going to have to pass a `configBasedir`, which is an absolute path to the directory that these `extends` and `plugins` are *relative to*.

_Note: Though both `files` and `css` are "optional," you *must* have one and *cannot* have both._

Returns a Promise that resolves with an object containing the following properties:

- `output`: String. A string displaying the formatted warnings (using the default formatter or whichever you passed)
- `errored`: Boolean. If true, at least one rule with a severity of 2 registered a warning
- `results`: An array containing all the stylelint result objects (the objects that formatters consume)
- `postcssResults`: An array containing all the PostCSS LazyResults that were accumulated during processing

Some examples:

```js
// If myConfig contains no extends or plugins, I do not have to use configBasedir
stylelint.lint({
  files: 'all/my/stylesheets/*.css',
  config: myConfig
}).then(function() {
  /* do things with data.output, data.errored, and data.results */
});
```

```js
// If it does, I do
stylelint.lint({
  files: 'all/my/stylesheets/*.css',
  config: myConfig,
  configBasedir: path.join(__dirname, "configs")
}).then(function() { .. });
```

```js
// Maybe I want to pass a string instead of a file glob, and I want to use the string formatter
stylelint.lint({
  css: 'a { color: pink; }',
  config: myConfig,
  formatter: "string"
}).then(function() { .. });
```

```js
// This time I want to use my own custom formatter function
stylelint.lint({
  css: 'a { color: pink; }',
  config: myConfig,
  formatter: function(stylelintResults) { .. }
}).then(function() { .. });
```

_Unlike the CLI, `stylelint.lint()`'s default formatter is `"json"`._

### As a PostCSS plugin

You can either use a PostCSS runner -- such as [`gulp-postcss`](https://github.com/postcss/gulp-postcss), [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss) and [`postcss-loader`](https://github.com/postcss/postcss-loader) -- or you can use the PostCSS JS API directly.

* _PostCSS `5.x` or `4.x` compatibility_ - versions `1.0.0+` of the linter are compatible with PostCSS `5.0.2+`. Whereas, versions `0.8.0 and below` are compatible with PostCSS `4.x`.
* _Use a reporter_ - the linter registers warnings via PostCSS. Therefore, you'll want to use it with a PostCSS runner that prints warnings (e.g. [`gulp-postcss`](https://github.com/postcss/gulp-postcss)) or another PostCSS plugin that prints warnings (e.g. [`postcss-reporter`](https://github.com/postcss/postcss-reporter)).

An example of using [`gulp-postcss`](https://github.com/postcss/gulp-postcss):

```js
gulp.task("css", function () {

  var postcss = require("gulp-postcss")
  var stylelint = require("stylelint")
  var reporter = require("postcss-reporter")

  return gulp.src("src/**/*.css")
    .pipe(postcss([
      stylelint({ /* your settings */ }),
      reporter({
        clearMessages: true,
      })
    ]))
})
```

An example of using the PostCSS JS API:

```js
var fs = require("fs")
var postcss = require("postcss")
var stylelint = require("stylelint")
var reporter = require("postcss-reporter")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

  postcss([
    stylelint({ /* your settings */ }),
    reporter(),
   ])
  .process(css, { from: "input.css" })
  .then()
  .catch(err => console.error(err.stack))
```

Your settings can be pass a single configuration object *or* you can pass an object like this:

```js
{
  config: myConfigurationObject,
  configBasedir: path/to/relativize/extends/and/plugins
}
```

#### Usage with CSS processors

The linter supports current and future CSS syntax. This includes all standard CSS but also special features that use standard CSS syntactic structures, e.g. special at-rules, special properties, and special functions. Some CSS-*like* language extensions -- features that use non-standard syntactic structures -- are, as such, supported; however, since there are infinite processing possibilities, the linter cannot support everything.

You can run the linter before or after your css processors. Depending on which processors you use, each approach has caveats:

1. *Before*: Some plugins might enable a syntax that isn't compatible with the linter.
2. *After*: Some plugins might generate CSS that is invalid against your linter config, causing warnings that do not correspond to your original stylesheets.

*In both cases you can either turn off the incompatible linter rule, or stop using the incompatible plugin.* You could also approach plugin authors and request alternate formatting options that will make their plugin compatible with stylelint.

## Configuration

The linter _expects a config_. You can either craft your own config or use a [pre-written one](#shareable-configs).

[Rules](docs/rules.md) are built into the linter and focus on _standard_ CSS. They are configured within the `rules` key of the config. All rules share these traits:

* Rules are standalone.
* Rules are unopinionated, i.e:
  * None of the rules are turned on by default.
  * None of the rules have default values for options.

### Rule names

Rules names are:

* Made of lowercase words separated by hyphens.
* Usually split into two parts:
  * The first describes what [*thing*](http://apps.workflower.fi/vocabs/css/en) the rule applies to.
  * The second describes what the rule is checking.

```
"number-leading-zero"
    ↑       ↑
the thing   what the rule is checking
```

* Except when the rule applies to the whole stylesheet:

```
"no-eol-whitespace"
"indentation"
     ↑
  what the rules are checking
```

#### No

Most rules allow you to choose whether you want to require *or* disallow something.

For example, whether numbers *must* or *must not* have a leading zero:

* `number-leading-zero`: `string - "always"|"never"`
  * `"always"` - there *must always* be a leading zero.
  * `"never"` - there *must never* be a leading zero.

```css
    a { line-height: 0.5; }
/**                  ↑
 *   This leading zero */
```

However, some rules *just disallow* something. `*-no-*` is used to identify these rules.

For example, whether empty blocks should be disallowed:

* `block-no-empty` - rules *must not* be empty.

```css
    a { }
/**    ↑
 *  Blocks like this */
```

Notice how, for a rule like this, it does not make sense to have an option to enforce the opposite i.e. that every block *must* be empty.

#### Max

`*-max-*` is used when a rule is *setting a limit* to something.

For example, specifying the maximum number of digits after the "." in a number:

* `number-max-precision`: `int`

```css
    a { font-size: 1.333em; }
/**                 ↑
 * The maximum number of digits after this "." */
```

#### Whitespace

Whitespace rules allow you to specify whether an empty line, a single space, a newline or no space must be used in some specific part of the stylesheet.

The whitespace rules combine two sets of keywords:

1. `before`, `after` and `inside` are used to specify where the whitespace (if any) is expected.
2. `empty-line`, `space` and `newline` are used to specify whether a single empty line, a single space, a single newline or no space is expected there.

For example, specifying if a single empty line or no space must come before all the comments in a stylesheet:

* `comment-empty-line-before`: `string` - `"always"|"never"`

```css
    a {}
                  ←
    /* comment */ ↑
                  ↑
/**               ↑
 *        This empty line  */
```

Additionally, some whitespace rule make use of another set of keywords:

1. `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` or `range-operator` are used if a specific piece of punctuation in the *thing* is being targetted.

For example, specifying if a single space or no space must come before a comma in a function:

* `function-comma-space-before`: `string` - `"always"|"never"`

```css
    a { transform: translate(1, 1) }
/**                           ↑
 *  The space after this commas */
```

The plural of the punctuation is used for `inside` rules. For example, specifying if a single space or no space must be inside the parentheses of a function:

* `function-parentheses-space-inside`: `string` - `"always"|"never"`

```css
    a { transform: translate( 1, 1 ); }
/**                         ↑      ↑
 * The space inside these two parentheses */
```

### Rules work together

The `before` and `after` rules can be used together to enforce strict conventions.

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
  box-shadow: 1px 1px 1px #000, 2px 2px 1px 1px #ccc inset, 2px 2px 1px 2px #ccc inset;
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
  box-shadow: 1px 1px 1px #000, /* multi-line value list ... */
    2px 2px 1px 1px #ccc inset, /* ... with newline after, ...  */
    2px 2px 1px 2px #ccc inset; /* ... but no space before */
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
  box-shadow: 1px 1px 1px #000
    , 2px 2px 1px 1px #ccc inset
    , 2px 2px 1px 2px #ccc inset;
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
  box-shadow: 1px 1px 1px #000 /* multi-line list ... */
    ,2px 2px 1px 1px #ccc inset /* ... with newline before, ...  */
    ,2px 2px 1px 2px #ccc inset; /* ... but no space after the comma */
}
```

You can enforce that with:


```js
"value-list-comma-newline-after": [2, "never-multi-line"],
"value-list-comma-newline-before": [2, "always-multi-line"],
"value-list-comma-space-after": [2, "always-single-line"],
"value-list-comma-space-before": [2, "always-single-line"],
```

### Turning rules on and off

Each rule can be turned off or on:

* `0` - turn the rule off.
* `1` - turn the rule on as a warning (does not affect exit code).
* `2` - turn the rule on as an error (exit code is 1 when triggered).

An example of turning one rules on and off:

```js
{
  "rules": {
    "rule-no-single-line": 0, // turn rule off
    "declaration-no-important": 2, // turn rule on
    "indentation": [2, "tabs"] // turn rule with options on
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
      except: ["value"],
    }],
    "declaration-colon-space-before": [2, "never"],
    "number-leading-zero": [2, "always"],
  }
}
```

### Shareable configs

If you prefer to enforce a third-party styleguide (rather than craft your own config), you can use:

* [SuitCSS shareable config](https://github.com/stylelint/stylelint-config-suitcss)
* [Wordpress shareable config](https://github.com/stylelint/stylelint-config-wordpress)

You can also extend a shareable config file, starting with what's there and making your own modifications and additions:

```json
{
  "extends": "stylelint-config-suitcss",
  "rules": {
    "indentation": [2, "tab"],
    "number-leading-zero": 0,
  }
}
```

The value of `"extends"` is a "locator" that is ultimately `require()`d, so can fit whatever format works with Node's `require.resolve()` algorithm. That means the "locators" can be:

- The names of modules in `node_modules` (e.g. `stylelint-config-wordpress`, if that module's `main` file is a valid JSON configuration)
- An absolute path to a file (which makes sense if you're creating a JS object in a Node context and passing it in)
- A relative path to a file, relative to the referencing configuration (e.g. if configA has `extends: "../configB"`, we'll look for `configB` relative to configA) (which makes sense in JSON configs).

A configuration's `extends` value can be a single locator or an array of locators.

### Plugin rules

[Plugins](docs/plugins.md) are userland rules that support _non-standard_ CSS features. To use one, add a `"plugins"` property to your config. The key is the rule's name; the value is the rule function itself. Then, within the `"rules"` object, your can add settings for your plugin rule just like any standard rule.

```js
{
  "plugins": {
    "special-rule": "../special-rule.js"),
  },
  "rules": {
    "special-rule": [ 2, "everything" ],
  },
}
```

A configuration's `plugins` value is an object whose keys are rule names and values are locators for the actual plugin functions.

## Complementary tools

The linter works well with:

### Editor plugins

* [linter-stylelint](https://github.com/1000ch/linter-stylelint) - An Atom Linter plugin for stylelint.
* [SublimeLinter-contrib-stylelint](https://github.com/kungfusheep/SublimeLinter-contrib-stylelint) - A Sublime Text plugin for stylelint.

### Other linters & formatters

* [cssfmt](https://github.com/morishitter/cssfmt) - A tool that automatically formats CSS and SCSS source code.
* [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter) - A BEM linter for CSS.
* [stylehacks](https://github.com/ben-eb/stylehacks) - Detect/remove browser hacks from CSS files.
