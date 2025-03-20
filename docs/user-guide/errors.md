# Errors & warnings

In addition to rule problems, Stylelint surfaces the following errors and warnings:

## CSS syntax error

The CSS parser built into Stylelint, or the chosen [custom syntax](options.md#customsyntax), could not parse your code.

### Unclosed block

You should balance your _curly braces_, typically of _declaration blocks_.

For example:

```diff css
- a { color: red;
+ a { color: red; }
```

### Unclosed bracket

You should balance your _square brackets_, typically of _attribute selectors_ and _grid names_.

For example:

```diff css
- a[foo { grid: [bar; }
+ a[foo] { grid: [bar]; }
```

### Unclosed string

You should balance your _quotation marks_.

For example:

```diff css
- a { content: " }
+ a { content: "" }
```

### Unknown word

You should:

- hyphenate _properties_
- separate _property and value pairs_ with _colons_
- separate _declarations_ with _semicolons_
- pair _selectors_ with _declaration blocks_ in _rules_

For example:

```diff css
a {
- margin top: 1px
- color red
+ margin-top: 1px;
+ color: red
}
```

## Parse error

The CSS parser built into Stylelint (or the chosen [custom syntax](options.md#customsyntax)) successfully parsed your code, but one of the construct-specific parsers failed to parse either a media query, selector or value within that source.

The construct-specific parsers are:

- `@csstools/media-query-list-parser`
- `postcss-selector-parser`
- `postcss-value-parser`

You should check that your constructs are wellformed, e.g. parentheses are balanced.

## Unknown rule error

There is an unknown rule in the [configuration object](configure.md).

You should:

- install the latest version of Stylelint (`npm i --save-dev stylelint`), as we may have recently added the rule
- check that the rule exists and is correctly named by searching the [list of rules](rules.md)

## Deprecation warning

There is a deprecated rule in the [configuration object](configure.md).

You should:

- identify in the [CHANGELOG](../../CHANGELOG.md) which release deprecated the rule
- take the action suggested there

## Invalid option warning

There is a misconfigured rule in the [configuration object](configure.md).

You should:

- install the latest version of Stylelint (`npm i --save-dev stylelint`), as we may have recently added the option
- check that the option exists and is correctly named by reading the rule's README
- correctly configure the [`rules`](configure.md#rules) property in the configuration object

## Warning with EditInfo

When the `computeEditInfo` option is enabled and `fix` option is disabled, warnings may include a `fix` property that provides information about suggested fixes.
This is useful for automated fixing tools and IDE integrations.

### EditInfo type

The `EditInfo` value is information to edit text. It is included in warnings' `fix` property. It has following properties:

- `range` (`[number, number]`)
  The pair of 0-based indices in source code text to remove.

- `text` (`string`)
  The text to add.

For example, to change `a { opacity: 10%; }` to `a { opacity: 0.1; }`, the EditInfo might look like:

```js
{
  // Index of "10%"
  range: [13, 16],
  // The replacement text
  text: "0.1"
}
```

To apply this edit, you would:

```js
// Original: "a { opacity: 10%; }"
const result =
  sourceCodeText.slice(0, edit.range[0]) + // "a { opacity: "
  edit.text + // "0.1"
  sourceCodeText.slice(edit.range[1]); // "; }"
// Result: "a { opacity: 0.1; }"
```

Note: Only a single `EditInfo` will be recorded for a specific region in source code. If multiple report ranges overlap, only the first will contain `EditInfo`.
