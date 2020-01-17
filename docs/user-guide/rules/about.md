# About rules

Rules determine what the linter looks for and complains about. All the rules are turned off by default and none have default values for their options.

The built-in rules are geared towards standard CSS syntax. With the exception of the `indentation` rule, all the rules will ignore structures that contain non-standard syntax e.g. variable interpolation and mixins.

## About rule names

We have taken great care to consistently name rules.

Rule names are:

-   made up of lowercase words separated by hyphens
-   split into two parts

The first part describes what [*thing*](http://apps.workflower.fi/vocabs/css/en) the rule applies to. The second part describes what the rule is checking.

For example:

```js
"number-leading-zero"
// ↑          ↑
// the thing  what the rule is checking
```

There is no first part when the rule applies to the whole stylesheet.

For example:

```js
"no-eol-whitespace"
"indentation"
//    ↑
// what the rules are checking
```

### No rules

Most rules require *or* disallow something.

For example, whether numbers *must* or *must not* have a leading zero:

-   `number-leading-zero`: `string -   "always"|"never"`
    -   `"always"` -   there *must always* be a leading zero
    -   `"never"` -   there *must never* be a leading zero

```css
a { line-height: 0.5; }
/**              ↑
 * This leading zero */
```

However, some rules *just disallow* something. These rules include `*-no-*` in their name.

For example, whether empty blocks should be disallowed:

-   `block-no-empty` -   blocks *must not* be empty

```css
a {   }
/** ↑
 * Blocks like this */
```

Notice how, for a rule like this, it does not make sense to have an option to enforce the opposite i.e. that every block *must* be empty.

### Max and min rules

`*-max-*` and `*-min-*` rules are used to *set a limit* to something.

For example, specifying the maximum number of digits after the "." in a number:

-   `number-max-precision`: `int`

```css
a { font-size: 1.333em; }
/**             ↑
 * The maximum number of digits after this "." */
```

### Whitespace rules

Whitespace rules allow you to specify whether an empty line, a single space, a newline or no space must be used in some specific part of the stylesheet.

The whitespace rules combine two sets of keywords:

-   `before`, `after` and `inside` are used to specify where the whitespace (if any) is expected
-   `empty-line`, `space` and `newline` are used to specify whether a single empty line, a single space, a single newline or no space is expected there

For example, specifying if a single empty line or no space must come before all the comments in a stylesheet:

-   `comment-empty-line-before`: `string` -   `"always"|"never"`

```css
a {}
              ←
/* comment */ ↑
              ↑
/**           ↑
 * This empty line  */
```

Additionally, some whitespace rule make use of another set of keywords:

-   `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` or `range-operator` are used if a specific piece of punctuation in the *thing* is being targeted

For example, specifying if a single space or no space must follow a comma in a function:

-   `function-comma-space-after`: `string` -   `"always"|"never"`

```css
a { transform: translate(1, 1) }
/**                       ↑
 * The space after this commas */
```

The plural of the punctuation is used for `inside` rules. For example, specifying if a single space or no space must be inside the parentheses of a function:

-   `function-parentheses-space-inside`: `string` -   `"always"|"never"`

```css
a { transform: translate( 1, 1 ); }
/**                     ↑      ↑
 * The space inside these two parentheses */
```

