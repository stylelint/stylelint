# Rule guidelines

* Rules are standalone.
* Rules are unopinionated:
  * All rules are turned off by default.
  * All rules do *not* have default values for options.

## Rule names

Rules are:

* Made of lowercase words separated by hyphens.
* Usually split into two parts:
  * The first describes [what thing](http://apps.workflower.fi/vocabs/css/en) the rule applies to.
  * The second describes what the rule is enforcing.

```js
selector-max-specificity
    ↑         ↑
the thing    what the rule is enforcing
```

* Except when the rule applies to the whole CSS document.

```js
eof-new-line
eol-no-whitespace
indentation
    ↑ 
  what the rules are enforcing
```

### No

Most rules *require or disallow the inclusion* of something.

For example, whether there must or must not be a trailing semicolon at the end of a declaration block:

* `declaration-block-trailing-semicolon`: `string - "always"|"never"`
  * `"always"` - there *must always* be a trailing semicolon
  * `"never"` - there *must never* be a trailing semicolon

However, some rules just *disallow* something. Use `*-no-*` to identify these rules.

For example, whether empty rule-sets should be disallowed or not:

* `rule-set-no-empty` - rule-sets *must not* be empty

In this case it doesn't make sense to enforce that every rule-set *must* be empty.

### Max

If the rule is *setting a limit* to something use `*-max-*`.

For example, specifying the maximum number of digits after the "." in a number

* `number-max-precision`: `int` 

### Space

If the rule is *specifying what space must be* around something then use `*-space` and use `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` and `range-operator` to identify that something.

For example, specifying what space must be before a comma and after the operator in a function:

* `function-coma-space`: `object` - `{ before: "always"|"never", after: "always"|"never" }`

If the rule handles (via its keyword options) both single and multiple lines, target these using `always-single-line`, `always-multi-line`, `never-single-line` and `never-multi-line`.

## Messages

Take the form of:

* "Expected a ... something"
* "Unexpected ... something" (for rejection e.g. when something is disallowed)

## Tests

Each rule must be accompanied by tests that contain:

* All patterns that are considered warnings.
* All patterns that should *not* be considered warnings.

## README.md

Each rule must be accompanied by a README.md, which takes the form of:

1. Rule name.
2. Single line description.
3. Code example (if necessary).
4. Expanded description (if necessary).
5. Options (if applicable).
6. Example patterns that are considered warnings (for each option value).
7. Example patterns that are *not* considered warnings (for each option value).
