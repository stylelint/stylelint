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
no-eol-whitespace
no-missing-eof-newline
indentation
    ↑ 
  what the rules are enforcing
```

### No

Most rules *require or disallow* something.

For example, whether there must or must not be a trailing semicolon at the end of a rule:

* `rule-trailing-semicolon`: `string - "always"|"never"`
  * `"always"` - there *must always* be a trailing semicolon.
  * `"never"` - there *must never* be a trailing semicolon.

However, some rules *just disallow* something. Use `*-no-*` to identify these rules.

For example, whether empty rules should be disallowed or not:

* `rule-no-empty` - rules *must not* be empty.

Notice how, for a rule like this, it does not make sense to provide an option to enforce the opposite i.e. that every rule *must* be empty.

### Max

If the rule is *setting a limit* to something use `*-max-*`.

For example, specifying the maximum number of digits after the "." in a number:

* `number-max-precision`: `int` 

### Space/newline

If the rule is *specifying what whitespace must be around a thing* use:

1. `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` or `range-operator` to specify the thing.
2. `space` or `newline` to specify if a single space, newline or no space must be used.
3. `before`, `after` or `inside` to specify the location of the whitespace in relation to the thing.

For example, specifying if a *single space or no space* must be before a comma in a function:

* `function-coma-space-before`: `string` - `"always"|"never"`

Use the plural of the thing when using `inside`. For example, specifying if a *single space or no space* must be inside the parentheses of a function:

* `function-parentheses-inside-space`: `string` - `"always"|"never"`

If the rule handles (via its keyword options) both single and multiple line rules, target these using `always-single-line`, `always-multi-line`, `never-single-line` and `never-multi-line`.

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
