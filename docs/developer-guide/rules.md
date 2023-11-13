# Writing rules

Please help us create, enhance, and debug our rules!

## Add a rule

You should get yourself ready to [contribute code](../../CONTRIBUTING.md#code-contributions).

### Define the rule

A rule must be:

- for standard CSS syntax only
- generally useful; not tied to idiosyncratic patterns

And have a:

- unambiguous finished state
- singular purpose that doesn't overlap with other rules

Its name is split into two parts:

- the [_thing_](http://apps.workflower.fi/vocabs/css/en) the rule applies to, e.g. `at-rule`
- what the rule is checking, e.g. `disallowed-list`

Unless it applies to the whole source, then there is no first part.

### Write tests

You should add test cases for all patterns that are:

- considered problems
- _not_ considered problems

You should use:

- realistic CSS, avoiding the use of ellipses
- the minimum amount of code possible, e.g. use an empty rule if targeting selectors
- `{}` for empty rules, rather than `{ }`
- the `a` type selector by default
- the `@media` at-rules by default
- the `color` property by default
- the `red` value by default
- the `(min-)width` media feature by default
- _foo_, _bar_ and _baz_ for names, e.g. `.foo`, `#bar`, `--baz`

You should:

- vary column and line positions across your tests
- include at least one test that has 2 warnings
- test non-standard syntax in the `isStandardSyntax*` utilities, not in the rule itself

#### Commonly overlooked edge-cases

You should ask yourself how does your rule handle:

- variables (e.g. `var(--custom-property)`)?
- CSS strings (e.g. `content: "anything goes";`)?
- CSS comments (e.g. `/* anything goes */`)?
- empty functions (e.g. `var()`)?
- `url()` functions, including data URIs (e.g. `url(anything/goes.jpg)`)?
- vendor prefixes (e.g. `@-webkit-keyframes name {}`)?
- case sensitivity (e.g. `@KEYFRAMES name {}`)?
- a pseudo-class _combined_ with a pseudo-element (e.g. `a:hover::before`)?
- nesting (e.g. do you resolve `& a {}`, or check it as is?)?
- whitespace and punctuation (e.g. comparing `rgb(0,0,0)` with `rgb(0, 0, 0)`)?

### Write the rule

When writing the rule, you should:

- make the rule strict by default
- add secondary `ignore` options to make the rule more permissive
- not include code specific to language extensions like SCSS

You should make use of the:

- PostCSS API
- construct-specific parsers
- utility functions

#### PostCSS API

Use the [PostCSS API](https://api.postcss.org/) to navigate and analyze the CSS syntax tree. We recommend using the `walk` iterators (e.g. `walkDecls`), rather than using `forEach` to loop through the nodes.

When using array methods on nodes, e.g. `find`, `some`, `filter` etc, you should explicitly check the `type` property of the node before attempting to access other properties. For example:

```js
const hasProperty = nodes.find(
  ({ type, prop }) => type === "decl" && prop === propertyName
);
```

Use `node.raws` instead of `node.raw()` when accessing raw strings from the [PostCSS AST](https://astexplorer.net/#/gist/ef718daf3e03f1d200b03dc5a550ec60/c8cbe9c6809a85894cebf3fb66de46215c377f1a).

#### Construct-specific parsers

Depending on the rule, we also recommend using:

- [media-query-list-parser](https://www.npmjs.com/package/@csstools/media-query-list-parser)
- [postcss-value-parser](https://github.com/TrySound/postcss-value-parser)
- [postcss-selector-parser](https://github.com/postcss/postcss-selector-parser)

There are significant benefits to using these parsers instead of regular expressions or `indexOf` searches (even if they aren't always the most performant method).

#### Utility functions

Stylelint has [utility functions](https://github.com/stylelint/stylelint/tree/main/lib/utils) that are used in existing rules and might prove useful to you, as well. Please look through those so that you know what's available. (And if you have a new function that you think might prove generally helpful, let's add it to the list!).

Use the:

- `validateOptions()` utility to warn users about invalid options
- `isStandardSyntax*` utilities to ignore non-standard syntax

### Add options

Each rule can accept a primary and an optional secondary option.

Only add an option to a rule if it addresses a _requested_ use case to avoid polluting the tool with unused features.

#### Primary

Every rule _must have_ a primary option. For example, in:

- `"font-weight-notation": "numeric"`, the primary option is `"numeric"`
- `"selector-max-type": [2, { "ignoreTypes": ["custom"] }]`, the primary option is `2`

Rules are named to encourage explicit primary options. For example, `font-weight-notation: "numeric"|"named-where-possible"` rather than `font-weight-numeric: "always"|"never"`. As `font-weight-named: "never"` _implies_ always numeric, whereas `font-weight-notation: "numeric"` makes it _explicit_.

#### Secondary

Some rules require extra flexibility to address edge cases. These can use an optional secondary options object. For example, in:

- `"font-weight-notation": "numeric"` there is no secondary options object
- `"selector-max-type": [2, { "ignore": ["descendant] }]`, the secondary options object is `{ "ignore": ["descendant] }`

The most typical secondary options are `"ignore": []` and `"except": []`.

##### Keyword `"ignore"` and `"except"`

The `"ignore"` and `"except"` options accept an array of predefined keyword options, e.g. `["relative", "first-nested", "descendant"]`:

- `"ignore"` skips-over a particular pattern
- `"except"` inverts the primary option for a particular pattern

##### User-defined `"ignore*"`

Some rules accept a _user-defined_ list of things to ignore. This takes the form of `"ignore<Things>": []`, e.g. `"ignoreAtRules": []`.

The `ignore*` options let users ignore non-standard syntax at the _configuration level_. For example, the:

- `:global` and `:local` pseudo-classes introduced in CSS Modules
- `@debug` and `@extend` at-rules introduced in SCSS

Methodologies and language extensions come and go quickly, and this approach ensures our codebase does not become littered with code for obsolete things.

If your rule can accept an array as its primary option, you must designate this by setting the property `primaryOptionArray = true` on your rule function. For example:

```js
function rule(primary, secondary) {
  return (root, result) => {
    /* .. */
  };
}

rule.primaryOptionArray = true;

module.exports = rule;
```

There is one caveat here: If your rule accepts a primary option array, it cannot also accept a primary option object. Whenever possible, if you want your rule to accept a primary option array, you should make an array the only possibility, instead of allowing for various data structures.

### Add problem messages

Add problem messages in form of:

- "Expected \[something\] \[in some context\]"
- "Unexpected \[something\] \[in some context\]"

If the rule has autofix use:

- 'Expected "\[unfixed\]" to be "\[fixed\]"' for short strings
- 'Expected "\[primary\]" ... notation' for long strings

### Add autofix

Depending on the rule, it might be possible to automatically fix the rule's problems by mutating the PostCSS AST (Abstract Syntax Tree) using the [PostCSS API](http://api.postcss.org/).

Add `context` variable to rule parameters:

```js
function rule(primary, secondary, context) {
  return (root, result) => {
    /* .. */
  };
}
```

`context` is an object which could have two properties:

- `configurationComment`(string): String that prefixes configuration comments like `/* stylelint-disable */`.
- `fix`(boolean): If `true`, your rule can apply autofixes.
- `newline`(string): Line-ending used in current linted file.

If `context.fix` is `true`, then change `root` using PostCSS API and return early before `report()` is called.

```js
if (context.fix) {
  // Apply fixes using PostCSS API
  return; // Return and don't report a problem
}

report(/* .. */);
```

### Write the README

Each rule is accompanied by a README in the following format:

1. Rule name.
2. Single-line description.
3. Prototypical code example.
4. Expanded description (if necessary).
5. Options.
6. Example patterns that are considered problems (for each option value).
7. Example patterns that are _not_ considered problems (for each option value).
8. Optional options (if applicable).

The single-line description is in the form of:

- "Disallow ..." for `no` rules
- "Limit ..." for `max` rules
- "Require ..." for rules that accept `"always"` and `"never"` options
- "Specify ..." for everything else

You should:

- pick examples from the tests
- only use standard CSS syntax in examples and options
- add the fewest examples possible to communicate the intent of the rule, rather than show edge cases
- use `<!-- prettier-ignore -->` before `css` code fences
- use "this rule" to refer to the rule, e.g. "This rule ignores ..."
- align the arrows within the prototypical code example with the beginning of the highlighted construct
- align the text within the prototypical code example as far to the left as possible

For example:

<!-- prettier-ignore -->
```css
 @media screen and (min-width: 768px) {}
/**                 ↑          ↑
  *       These names and values */
```

Look at the READMEs of other rules to glean more conventional patterns.

### Wire up the rule

The final step is to add references to the new rule in the following places:

- [The rules `index.mjs` file](../../lib/rules/index.mjs)
- [The list of rules](../user-guide/rules.md)
- [The type definition of rules](../../types/stylelint/index.d.ts)

## Add an option to a rule

You should:

1. Get ready to [contribute code](../../CONTRIBUTING.md#code-contributions).
2. Add new unit tests to test the option.
3. Change the rule's validation to allow for the new option.
4. Add (as little as possible) logic to the rule to make the tests pass.
5. Add documentation about the new option.

## Fix a bug in a rule

You should:

1. Get ready to [contribute code](../../CONTRIBUTING.md#code-contributions).
2. Write failing unit tests that exemplify the bug.
3. Fiddle with the rule until those new tests pass.

## Deprecate a rule

Deprecating rules doesn't happen very often. When you do, you must:

1. Point the `stylelintReference` link to the specific version of the rule README on the GitHub website, so that it is always accessible.
2. Add the appropriate metadata to mark the rule as deprecated like `rule.meta = { deprecated: true }`.

## Improve the performance of a rule

You can run a benchmark on any given rule with any valid config using:

```shell
npm run benchmark-rule -- ruleName ruleOptions [ruleContext]
```

If the `ruleOptions` argument is anything other than a string or a boolean, it must be valid JSON wrapped in quotation marks.

```shell
npm run benchmark-rule -- value-keyword-case lower
```

```shell
npm run benchmark-rule -- value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]'
```

If the `ruleContext` argument is specified, the same procedure would apply:

```shell
npm run benchmark-rule -- value-keyword-case '["lower", {"camelCaseSvgKeywords": true}]' '{"fix": true}'
```

The script loads Bootstrap's CSS (from its CDN) and runs it through the configured rule.

It will end up printing some simple stats like this:

```shell
Warnings: 1441
Mean: 74.17598357142856 ms
Deviation: 16.63969674310928 ms
```

When writing new rules or refactoring existing rules, use these measurements to determine the efficiency of your code.

A Stylelint rule can repeat its core logic many, many times (e.g. checking every value node of every declaration in a vast CSS codebase). So it's worth paying attention to performance and doing what we can to improve it!

**Improving the performance of a rule is a great way to contribute if you want a quick little project.** Try picking a rule and seeing if there's anything you can do to speed it up.

Make sure you include benchmark measurements in your pull request!
