# Developer guide

Have a look at the [user guide](user-guide.md) to familiarize yourself with things like rule naming conventions.

## Running tests

You can run the tests via:

```console
npm test
```

## Adding a new rule

1. First, open [an issue](https://github.com/stylelint/stylelint/issues/new) with the title "New rule: *rule-name*" and let everyone else know when you intend to start on the new rule.
2. Once you have something to show, create a [pull request](https://github.com/stylelint/stylelint/compare).

### Messages

Take the form of:

* "Expected a ... something"
* "Unexpected ... something" (for rejection e.g. when something is disallowed)

### Tests

Each rule must be accompanied by tests that contain:

* All patterns that are considered warnings.
* All patterns that should *not* be considered warnings.

### README.md

Each rule must be accompanied by a README.md, which takes the form of:

1. Rule name.
2. Single line description.
3. Code example (if necessary).
4. Expanded description (if necessary).
5. Options (if applicable).
6. Example patterns that are considered warnings (for each option value).
7. Example patterns that are *not* considered warnings (for each option value).
