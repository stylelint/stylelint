# Working on rules

Please help us create, enhance, and debug our rules!

## Add a rule

*When writing a rule, always look to other similar rules for [conventions and patterns](../user-guide/rules/about.md) to start from and mimic.*

The rule should:

-   not include code for methodologies or language extensions
-   be strict by default

### PostCSS API

Use the [PostCSS API](https://api.postcss.org/) to navigate and analyze the CSS syntax tree. We recommend using the `walk` iterators (e.g. `walkDecls`), rather than using `forEach` to loop through the nodes. Use `node.raws` instead of `node.raw()` when accessing raw strings from the PostCSS AST.

### Construct-specific parsers

Depending on the rule, we also recommend using:

-   [postcss-value-parser](https://github.com/TrySound/postcss-value-parser)
-   [postcss-selector-parser](https://github.com/postcss/postcss-selector-parser)

There are significant benefits to using these parsers instead of regular expressions or `indexOf` searches (even if they aren't always the most performant method).

### Utility functions

stylelint has [utility functions](https://github.com/stylelint/stylelint/tree/master/lib/utils) that are used in existing rules and might prove useful to you, as well. Please look through those so that you know what's available. (And if you have a new function that you think might prove generally helpful, let's add it to the list!).

Use the:

-   `validateOptions()` utility to warn users about invalid options
-   `isStandardSyntax*` utilities to ignore non-standard syntax

### Options

Provide secondary options so that the user can ignore non-standard syntax at the *configuration level*. For example, when dealing with specificity, a rule should not account for the `:global` and `:local` pseudo-classes (introduced in the CSS Modules language extension), instead the rule should provide a `ignorePseudoClasses: []` secondary option. Methodologies come and go quickly, and this approach ensures the codebase does not become littered with code for obsolete things.

Only add an option to a rule if it addresses a *requested* use case to avoid polluting the tool with unused features.

If your rule can accept an array as its primary option, you must designate this by setting the property `primaryOptionArray = true` on your rule function. For example:

```js
function rule(primary, secondary) {
    return (root, result) => { /* .. */ };
}

rule.primaryOptionArray = true;

module.exports = rule;
```

There is one caveat here: If your rule accepts a primary option array, it cannot also accept a primary option object. Whenever possible, if you want your rule to accept a primary option array, you should make an array the only possibility, instead of allowing for various data structures.

### Add autofix

Depending on the rule, it might be possible to automatically fix the rule's violations by mutating the PostCSS AST (Abstract Syntax Tree) using the [PostCSS API](http://api.postcss.org/).

Add `context` variable to rule parameters:

```js
function rule(primary, secondary, context) {
    return (root, result) => { /* .. */ };
}
```

`context` is an object which could have two properties:

-   `fix`(boolean): If `true`, your rule can apply autofixes.
-   `newline`(string): Line-ending used in current linted file.

If `context.fix` is `true`, then change `root` using PostCSS API and return early before `report()` is called.

```js
if (context.fix) {
    // Apply fixes using PostCSS API
    return; // Return and don't report a problem
}

report(...);
```

### Write tests

Each rule must have tests that cover all patterns that:

-   are considered violations
-   should *not* be considered violations

Write as many as you can stand to.

You should:

-   test errors in multiple positions, not the same place every time
-   use realistic (if simple) CSS, and avoid the use of ellipses
-   use standard CSS syntax by default, and only swap parsers when testing a specific piece of non-standard syntax

#### Commonly overlooked edge-cases

You should ask yourself how does your rule handle:

-   variables (`$sass`, `@less` or `var(--custom-property)`)?
-   CSS strings (e.g. `content: "anything goes";`)?
-   CSS comments (e.g. `/* anything goes */`)?
-   `url()` functions, including data URIs (e.g. `url(anything/goes.jpg)`)?
-   vendor prefixes (e.g. `@-webkit-keyframes name {}`)?
-   case sensitivity (e.g. `@KEYFRAMES name {}`)?
-   a pseudo-class *combined* with a pseudo-element (e.g. `a:hover::before`)?
-   nesting (e.g. do you resolve `& a {}`, or check it as is?)?
-   whitespace and punctuation (e.g. comparing `rgb(0,0,0)` with `rgb(0, 0, 0)`)?

### Write the README

You should:

-   use "this rule" to refer to the rule e.g. "This rule ignores ..."
-   align the arrows within the prototypical code example with the beginning of the highlighted construct
-   align the text within the prototypical code example as far to the left as possible

For example:

```css
 @media screen and (min-width: 768px) {}
/**                 ↑          ↑
  *       These names and values */
```

Look at the READMEs of other rules to glean more conventional patterns.

#### Example patterns

You should use:

-   complete CSS patterns i.e. avoid ellipses (`...`)
-   standard CSS syntax (and `css` [GFM fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/)) by default
-   the minimum amount of code possible to communicate the pattern, e.g. if the rule targets selectors then use an empty rule, e.g. `{}`.
-   `{}`, rather than `{ }` for empty rules
-   the `a` type selector by default
-   the `@media` at-rules by default
-   the `color` property by default
-   *foo*, *bar* and *baz* for names, e.g. `.foo`, `#bar`, `--baz`

### Wire up the rule

The final step is to add references to the new rule in the following places:

-   [The rules `index.js` file](../../lib/rules/index.js)
-   [The list of rules](../user-guide/rules/list.md)

## Add an option to a rule

You should:

1.  Run `npm run watch` to start the interactive testing prompt.
2.  Use the `p` command to filter the active tests to just the rule you're working on.
3.  Change the rule's validation to allow for the new option.
4.  Add new unit tests to test the option.
5.  Add (as little as possible) logic to the rule to make the tests pass.
6.  Add documentation about the new option.

## Fix a bug in a rule

You should:

1.  Run `npm run watch` to start the interactive testing prompt.
2.  Use the `p` command to filter the active tests to just the rule you're working on.
3.  Write failing unit tests that exemplify the bug.
4.  Fiddle with the rule until those new tests pass.

## Deprecate a rule

Deprecating rules doesn't happen very often. When you do, you must:

1.  Point the `stylelintReference` link to the specific version of the rule README on the GitHub website, so that it is always accessible.
2.  Add the appropriate meta data to mark the rule as deprecated.

## Improve the performance of a rule

You can run a benchmarks on any given rule with any valid config using:

```shell
npm run benchmark-rule -- ruleName ruleOptions [ruleContext]
```

If the `ruleOptions` argument is anything other than a string or a boolean, it must be valid JSON wrapped in quotation marks.

```shell
npm run benchmark-rule -- selector-combinator-space-after never
```

```shell
npm run benchmark-rule -- selector-combinator-space-after always
```

```shell
npm run benchmark-rule -- block-opening-brace-space-before "[\"always\", {\"ignoreAtRules\": [\"else\"]}]"
```

If the `ruleContext` argument is specified, the sames procedure would apply:

```shell
npm run benchmark-rule -- block-opening-brace-space-before "[\"always\", {\"ignoreAtRules\": [\"else\"]}]" "{\"fix\": \"true\"}"
```

The script loads Bootstrap's CSS (from its CDN) and runs it through the configured rule.

It will end up printing some simple stats like this:

```shell
Warnings: 1441
Mean: 74.17598357142856 ms
Deviation: 16.63969674310928 ms
```

When writing new rules or refactoring existing rules, use these measurements to determine the efficiency of your code.

A stylelint rule can repeat its core logic many, many times (e.g. checking every value node of every declaration in a vast CSS codebase). So it's worth paying attention to performance and doing what we can to improve it!

**Improving the performance of a rule is a great way to contribute if you want a quick little project.** Try picking a rule and seeing if there's anything you can do to speed it up.

Make sure you include benchmark measurements in your pull request!
