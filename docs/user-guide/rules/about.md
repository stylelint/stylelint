# About rules

The built-in rules:

-   apply to standard CSS syntax only
-   are generally useful; not tied to idiosyncratic patterns
-   have a clear and unambiguous finished state
-   have a singular purpose
-   are standalone, and don't rely on another rule
-   do not contain functionality that overlaps with another rule

In contrast, a plugin is a community rule that doesn't adhere to all these criteria. It might support a particular methodology or toolset, or apply to *non-standard* constructs and features, or be for specific use cases.

## Options

Each rule accepts a primary and an optional secondary option.

### Primary

Every rule *must have* a **primary option**. For example:

-   in `"color-hex-case": "upper"`, the primary option is `"upper"`
-   in `"indentation": [2, { "except": ["block"] }]`, the primary option is `2`

### Secondary

Some rules require extra flexibility to address edge cases. These can use an **optional secondary options object**. For example:

-   in `"color-hex-case": "upper"` there is no secondary options object
-   in `"indentation": [2, { "except": ["block"] }]`, the secondary options object is `{ "except": ["block"] }`

The most typical secondary options are `"ignore": []` and `"except": []`.

A rule's secondary option can be anything if it doesn't ignore or make exceptions. As an example, `resolveNestedSelectors: true|false` is used within some `selector-*` rules to change how the rule processes nested selectors.

#### Keyword `"ignore"` and `"except"`

The `"ignore"` and `"except"` options accept an array of predefined keyword options, e.g. `["relative", "first-nested", "descendant"]`:

-   `"ignore"` skips-over a particular pattern
-   `"except"` inverts the primary option for a particular pattern

#### User-defined `"ignore*"`

Some rules accept a *user-defined* list of things to ignore. This takes the form of `"ignore<Things>": []`, e.g. `"ignoreAtRules": []` is used if a rule checks at-rules.

## Names

Rule are consistently named, they are:

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

*Rules are named to encourage explicit, rather than implicit, options.* For example, `color-hex-case: "upper"|"lower"` rather than `color-hex-uppercase: "always"|"never"`. As `color-hex-uppercase: "never"` *implies* always lowercase, whereas `color-hex-case: "lower"` makes it *explicit*.

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

For example, to disallow empty blocks:

-   `block-no-empty` -   blocks *must not* be empty

```css
a {   }
/** ↑
 * Blocks like this */
```

Notice how it does not make sense to have an option to enforce the opposite, i.e. that every block *must* be empty.

### Max and min rules

`*-max-*` and `*-min-*` rules *set a limit* to something.

For example, specifying the maximum number of digits after the "." in a number:

-   `number-max-precision`: `int`

```css
a { font-size: 1.333em; }
/**             ↑
 * The maximum number of digits after this "." */
```

### Whitespace rules

Whitespace rules allow you to enforce an empty line, a single space, a newline or no space in some specific part of the stylesheet.

The whitespace rules combine two sets of keywords:

-   `before`, `after` and `inside` to specify where the whitespace (if any) is expected
-   `empty-line`, `space` and `newline` to specify whether a single empty line, a single space, a single newline or no space is expected there

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

Additionally, some whitespace rules use an additional set of keywords:

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

## READMEs

Each rule is accompanied by a README in the following format:

1.  Rule name.
2.  Single-line description.
3.  Prototypical code example.
4.  Expanded description (if necessary).
5.  Options.
6.  Example patterns that are considered violations (for each option value).
7.  Example patterns that are *not* considered violations (for each option value).
8.  Optional options (if applicable).

The single-line description is in the form of:

-   "Disallow ..." for `no` rules
-   "Limit ..." for `max` rules
-   "Require ..." for rules that accept `"always"` and `"never"` options
-   "Specify ..." for everything else

## Violation messages

Each rule produces violation messages in these forms:

-   "Expected \[something\] \[in some context\]"
-   "Unexpected \[something\] \[in some context\]"
