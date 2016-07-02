# Working on rules

**Please help us create, enhance, and debug stylelint rules!**

There are well over a hundred rules already, so stylelint *needs* community contributions to continue to improve.

If you like stylelint and open source software (since you're reading this, you almost certainly do), please consider taking some time to pitch in. Not only will you help stylelint thrive, you will also learn a thing or two — about CSS, PostCSS, Node, ES2015, unit testing, open source software, and more.

**We want to do everything we can to encourage contributions!** So if you want to participate but don't end up doing it for one reason or another, please file an issue and give us feedback about what we could do to better encourage you.

Also: we hope that your participation in the project isn't a one-off. *We'd love to add more members to the organization and see more regulars pop up in issues and pull requests!*

## Creating new rules

### Let everyone know

First, open [an issue](https://github.com/stylelint/stylelint/issues/new) and let everyone else know that you intend to create a new rule.

Usually we have some discussion about the rule's purpose, name, and options before it's ready for development. We also discuss whether the rule meets the following criteria for inclusion in stylelint:

- Applicable to standard CSS syntax only.
- Useful to the majority of users.
- Has a clear and unambiguous finished state.
- Has a singular purpose.
- Is standalone, and doesn't rely on another rule.
- Does not contain functionality that overlaps with another rule.

Otherwise, it should be a plugin. However, plugins should also try to adhere to the latter three criteria.

Once you have something to show, you'll create a [pull request](https://github.com/stylelint/stylelint/compare) to continue the conversation.

### Come up with a name

Have a look at the [rules user guide](/docs/user-guide/about-rules.md) to familiarize yourself the rule naming conventions.

We take care to ensure that all the rules are named accurately and consistently. Our goals in that effort are to ensure that rules are easy to find and understand, and to prevent us from wanting to change the name later.

### Determine options

#### Primary

Every rule *must have* a **primary option**.

- In `"color-hex-case": "upper"`, the primary option is `"upper"`.
- In `"indentation": [2, { "except": ["block"] }]`, the primary option is `2`.

#### Secondary

Some rules require extra flexibility to address a variety of use-cases. These can use a **secondary options object**.

- In `"color-hex-case": "upper"`, there is no secondary options object.
- In `"indentation": [2, { "except": ["block"] }]`, the secondary options object is `{ "except": ["block"] }`.

The most typical secondary options are `"ignore": []` and `"except": []`; but anything is possible.

`"ignore"` and `"except"` accept an array of predefined keyword options e.g. `["relative", "first-nested", "descendant"]`. Use `"ignore"` when you want the rule to simply skip-over a particular pattern, and use `"except"` when you want to invert the primary option for a particular pattern.

Use a more specific secondary option name when accepting a *user-defined* list of things to ignore. For example, use `"ignoreAtRules": []` if a rule checks at-rules and you want to allow a user to specify which particular at-rule types to ignore.

A rule's secondary option can be anything if you're not ignoring or making exceptions. As an example, `resolveNestedSelectors: true|false` is used within some `selector-*` rules to change how the rule processes nested selectors.

#### Be explicit

*Use explicit, rather than implicit, options.* For example, `color-hex-case: "upper"|"lower"` rather than `color-hex-uppercase: "always"|"never"`. As `color-hex-uppercase: "never"` *implies* always lowercase, whereas `color-hex-case: "lower"` makes it *explicit*.

### Determine warning messages

Messages usually take one of these forms:

- "Expected \[something\] \[in some context\]".
- "Unexpected \[something\] \[in some context\]."

Look at the messages of other rules to glean more conventions and patterns.

### Write the rule

*When writing the rule, always look to other similar rules for conventions and patterns to start from and mimic.*

You will use the simple [PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md) to navigate and analyze the CSS syntax tree. We recommend using the `walk` iterators (e.g. `walkDecls`), rather than using `forEach` to loop through the nodes.

Depending on the rule, we also recommend using [postcss-value-parser](https://github.com/TrySound/postcss-value-parser) and [postcss-selector-parser](https://github.com/postcss/postcss-selector-parser). There are significant benefits to using these parsers instead of regular expressions or `indexOf` searches (even if they aren't always the most performant method).

stylelint has a number of [utility functions](https://github.com/stylelint/stylelint/tree/master/src/utils) that are used in existing rules and might prove useful to you, as well. Please look through those so that you know what's available. (And if you have a new function that you think might prove generally helpful, let's add it to the list!)

In particular, you will definitely want to use `validateOptions()` so that users are warned about invalid options. (Looking at other rules for examples of options validation will help a lot.)

### Write tests

Each rule must be accompanied by tests that contain:

- All patterns that are considered warnings.
- All patterns that should *not* be considered warnings.

It is easy to write stylelint tests, so *write as many as you can stand to*.

#### Checklist

Please run through this checklist and ensure each point is covered by your tests. Especially *consider the edge-cases*. These are where the bugs and shortcomings of rules always arise.

##### Best practices

- Ensure you are testing errors in multiple positions, not the same place every time.
- Ensure you use realistic (if simple) CSS, and avoid the use of ellipses.
- Ensure you use standard CSS syntax by default, and only swap parsers when testing a specific piece of non-standard syntax.

##### Commonly overlooked edge-cases

- How does your rule handle variables (`$sass`, `@less`, or `var(--custom-property)`)?
- How does your rule handle CSS strings (e.g. `content: "anything goes";`)?
- How does your rule handle CSS comments (e.g. `/* anything goes */`)?
- How does your rule handle `url()` functions, including data URIs (e.g. `url(anything/goes.jpg)`)?
- How does your rule handle vendor prefixes (e.g. `@-webkit-keyframes name {}`)?
- How does your rule handle case sensitivity (e.g. `@KEYFRAMES name {}`)?
- How does your rule handle a pseudo-class *combined* with a pseudo-element (e.g. `a:hover::before`)?
- How does your rule handle nesting (e.g. do you resolve `& a {}`, or check it as is?)?
- How does your rule handle whitespace and punctuation (e.g. comparing `rgb(0,0,0)` with `rgb(0, 0, 0)`)?

#### Running tests

You can run the tests via:

```console
npm test
```

However, this runs all 10,000+ unit tests and also linting.

To run tests in a single file only (which you'll want to do during development), you'll need to use `babel-tape-runner` (because the codebase is ES6). For example, to run the test for the `color-hex-case` rule:

```console
./node_modules/.bin/babel-tape-runner src/rules/color-hex-case/__tests__/index.js
```

### Write the README

Each rule must be accompanied by a README, fitting the following format:

1. Rule name.
2. Single line description.
3. Prototypical code example.
4. Expanded description (if necessary).
5. Options.
6. Example patterns that are considered warnings (for each option value).
7. Example patterns that are *not* considered warnings (for each option value).
8. Optional options (if applicable).

Look at the READMEs of other rules to glean more conventional patterns.

#### Single line descriptions

Take the form of:

- "Disallow ..." (for `no` rules).
- "Limit ..." (for `max` rules).
- "Require ..." (for rules that accept `"always"` and `"never"` options).
- "Specify ..." (for everything else).

#### Example patterns

- Use complete CSS patterns i.e. avoid ellipses (`...`)
- Use standard CSS syntax (and use `css` code fences) by default.

### Wire up the rule

The final step is to add references to the new rule in the following places:

- [The rules `index.js` file](https://github.com/stylelint/stylelint/blob/master/src/rules/index.js)
- [The CHANGELOG](/CHANGELOG.md)
- [The list of rules](/docs/user-guide/rules.md)
- [The example config](/docs/user-guide/example-config.md)

## Adding options to existing rules

First, open an issue about the option you wish to add. We'll discuss its functionality and name there.

Once we've agreed on the direction, you can work on a pull request. Here are the steps you'll need to take:

1. Change the rule's validation to allow for the new option.
2. Add to the rule some logic (as little as possible) to make the option work.
3. Add new unit tests to test the option.
4. Add documentation about the new option.
5. Add a note to the CHANGELOG about your addition.

## Fixing bugs

Fixing bugs is usually very easy. Here is a process that works:

1. Write failing unit tests that exemplify the bug.
2. Fiddle with the rule until those new tests pass.
3. Add a note to the CHANGELOG about your fix.

That's it! **If you are unable to figure out how to fix the bug yourself, it is still *extremely* helpful to submit a pull request with your failing test cases.** It means that somebody else can jump right in and help out with the rule's logic.
