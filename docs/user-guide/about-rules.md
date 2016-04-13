# About rules

We have taken great care to consistently name rules.

The rules have been designed to work in conjunction with one another so that strict conventions can be enforced.

## About rule names

- Made of lowercase words separated by hyphens.
- Split into two parts:

  - The first describes what [*thing*](http://apps.workflower.fi/vocabs/css/en) the rule applies to.
  - The second describes what the rule is checking.

```js
"number-leading-zero"
// ↑          ↑
// the thing  what the rule is checking
```

- Except when the rule applies to the whole stylesheet:

```js
"no-eol-whitespace"
"indentation"
//    ↑
// what the rules are checking
```

### No rules

Most rules allow you to choose whether you want to require *or* disallow something.

For example, whether numbers *must* or *must not* have a leading zero:

- `number-leading-zero`: `string - "always"|"never"`

  - `"always"` - there *must always* be a leading zero.
  - `"never"` - there *must never* be a leading zero.

```css
a { line-height: 0.5; }
/**              ↑
 * This leading zero */
```

However, some rules *just disallow* something. `*-no-*` is used to identify these rules.

For example, whether empty blocks should be disallowed:

- `block-no-empty` - blocks *must not* be empty.

```css
a {   }
/** ↑
 * Blocks like this */
```

Notice how, for a rule like this, it does not make sense to have an option to enforce the opposite i.e. that every block *must* be empty.

### Max rules

`*-max-*` is used when a rule is *setting a limit* to something.

For example, specifying the maximum number of digits after the "." in a number:

- `number-max-precision`: `int`

```css
a { font-size: 1.333em; }
/**             ↑
 * The maximum number of digits after this "." */
```

### Whitespace rules

Whitespace rules allow you to specify whether an empty line, a single space, a newline or no space must be used in some specific part of the stylesheet.

The whitespace rules combine two sets of keywords:

1. `before`, `after` and `inside` are used to specify where the whitespace (if any) is expected.
2. `empty-line`, `space` and `newline` are used to specify whether a single empty line, a single space, a single newline or no space is expected there.

For example, specifying if a single empty line or no space must come before all the comments in a stylesheet:

- `comment-empty-line-before`: `string` - `"always"|"never"`

```css
a {}
              ←
/* comment */ ↑
              ↑
/**           ↑
 * This empty line  */
```

Additionally, some whitespace rule make use of another set of keywords:

1. `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` or `range-operator` are used if a specific piece of punctuation in the *thing* is being targetted.

For example, specifying if a single space or no space must come after a comma in a function:

- `function-comma-space-after`: `string` - `"always"|"never"`

```css
a { transform: translate(1, 1) }
/**                       ↑
 * The space after this commas */
```

The plural of the punctuation is used for `inside` rules. For example, specifying if a single space or no space must be inside the parentheses of a function:

- `function-parentheses-space-inside`: `string` - `"always"|"never"`

```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 * The space inside these two parentheses */
```

## Rules work together

The `*-before` and `*-after` whitespace rules can be used together to enforce strict conventions.

Say you want to enforce no space before and a single space after the colon in every declaration:

```css
a { color: pink; }
/**      ↑
 * No space before and a single space after this colon */
```

You can enforce that with:

```js
"declaration-colon-space-after": "always",
"declaration-colon-space-before": "never",
```

Some *things* (e.g. declaration blocks and value lists) can span more than one line. In these cases `newline` rules and extra options can be used to provide flexibility.

For example, this is the complete set of `value-list-comma-*` rules and their options:

- `value-list-comma-space-after`: `"always"|"never"|"always-single-line"|"never-single-line"`
- `value-list-comma-space-before`: `"always"|"never"|"always-single-line"|"never-single-line"`
- `value-list-comma-newline-after`: `"always"|"always-multi-line|"never-multi-line"`
- `value-list-comma-newline-before`: `"always"|"always-multi-line"|"never-multi-line"`

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

### Example A

Say you only want to allow single-line value lists. And you want to enforce no space before and a single space after the commas:

```css
a {
  font-family: sans, serif, monospace;
  box-shadow: 1px 1px 1px red, 2px 2px 1px 1px blue inset, 2px 2px 1px 2px blue inset;
}
```

You can enforce that with:

```js
"value-list-comma-space-after": "always",
"value-list-comma-space-before": "never",
```

### Example B

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
"value-list-comma-newline-after": "always-multi-line",
"value-list-comma-space-after": "always-single-line",
"value-list-comma-space-before": "never",
```

### Example C

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
"value-list-comma-newline-before": "always-multi-line",
"value-list-comma-space-after": "always",
"value-list-comma-space-before": "never-single-line",
```

### Example D

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
"value-list-comma-newline-after": "never-multi-line",
"value-list-comma-newline-before": "always-multi-line",
"value-list-comma-space-after": "always-single-line",
"value-list-comma-space-before": "always-single-line",
```
