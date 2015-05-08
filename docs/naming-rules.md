# Naming rules

Rules are:

* Made of lowercase words separated by hyphens.
* Split into two parts:
  * The first describes [what thing](http://apps.workflower.fi/vocabs/css/en) the rule applies to.
  * The second describes what the rule is enforcing.

```js
selector-max-specificity
   ^           ^
   |           |
the thing    what the rule is enforcing
```

## No

Most rules *enforce the inclusion or exclusion* of something.

For example, whether there should or shouldn't be a trailing semicolon at the end of a declaration block:

* `declaration-block-trailing-semicolon`: `bool`
  * `true` - there *must* be a trailing semicolon
  * `false` - there *must not* be a trailing semicolon

If the rule is *disallowing* something use `*-no-*`.

For example, whether empty rule-sets should be disallowed or not:

* `rule-set-no-empty`: `bool` 
  * `true`: rule-sets *must not* be empty
  * `false`: rule-sets *can* be empty (equivalent to not turning the rule on)

In this case it doesn't make sense to enforce that every rule-set *must* be empty.

## Max

If the rule is *setting a limit* to something use `*-max-*`.

For example, specifying the maximum number of digits after the "." in a number

* `number-max-precision`: `int` 

## Before and after

If the rule is *specifying what whitespace must be* around something then use `*-before/after` and use `comma`, `colon`, `semicolon`, `opening-brace`, `closing-brace`, `opening-parenthesis`, `closing-parenthesis`, `operator` and `range-operator` to identify that something.

For example, what whitespace must be before a coma and after the operator in a function:

* `function-coma-before`: `string`
* `function-operator-after`: `string`

If the rule handles (via its options) both single and multiple lines, target these using `single-line` and `multi-line` respectively.

For example, what whitespace must be after the opening brace of a block:

* `block-opening-brace-after`: `object { single-line: "", multi-line: "" }`
