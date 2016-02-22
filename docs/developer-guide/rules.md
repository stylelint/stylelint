# Writing rules

Have a look at the [rules guide](/docs/user-guide/rules.md) to familiarize yourself the rule naming conventions.

## Let everyone know

1. First, open [an issue](https://github.com/stylelint/stylelint/issues/new) and let everyone else know when you intend to start on the new rule.
2. Once you have something to show, create a [pull request](https://github.com/stylelint/stylelint/compare).

## Options

Use explicit, rather than implicit, options. For example:

- `color-hex-case: "upper"|"lower"` rather than `color-hex-uppercase: "always"|"never"`

As `color-hex-uppercase: "never"` *implies* always lowercase.

## Messages

Take the form of:

- "Expected a ... something".
- "Unexpected ... something" (for rejection e.g. when something is disallowed).

## README

Each rule must be accompanied by a README, which takes the form of:

1. Rule name.
2. Single line description.
3. Code example (if necessary).
4. Expanded description (if necessary).
5. Options (if applicable).
6. Example patterns that are considered warnings (for each option value).
7. Example patterns that are *not* considered warnings (for each option value).
8. Optional options (if applicable).

## Single line descriptions

Take the form of:

- "Disallow ..." (for `no` rules).
- "Limit ..." (for `max` rules).
- "Require ..." (for `after`, `before` and `inside` rules).
- "Specify ..." (for everything else).

## Tests

Each rule must be accompanied by tests that contain:

- All patterns that are considered warnings.
- All patterns that should *not* be considered warnings.

### Running tests

You can run the tests via:

```console
npm test
```

To run tests in a single file, instead of all the tests at once, you'll need to use `babel-tape-runner` (because the codebase is ES6). For example, to run the test for the `color-hex-case` rule:

```console
./node_modules/.bin/babel-tape-runner src/rules/color-hex-case/__tests__/index.js
```

## Wiring up the rule up

The final step is to refer to the new rule in the following places:

- [The rules `index.js` file](https://github.com/stylelint/stylelint/blob/master/src/rules/index.js)
- [The CHANGELOG](https://github.com/stylelint/stylelint/blob/master/CHANGELOG.md)
- [The list of rules](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md)
- [The example config](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/example-config.md)
