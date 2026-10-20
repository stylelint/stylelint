# Writing system tests

System tests verify that Stylelint works as expected. They are another line of defense against regressions, after the unit tests and integration tests.

Each of these system tests asserts that we end up with some expected output, given a configuration and a stylesheet.

These tests should not be comprehensive and systematic (_the unit tests should_). They should reproduce real use-cases and verify that those use-cases work as expected.

## Snapshots

The tests use [`node:test` snapshots](https://nodejs.org/api/test.html#snapshot-testing), so we can easily:

- assert against potentially large objects and strings
- update expectations as needed.

To update the snapshots of a test file, run it with the `--test-update-snapshots` flag:

```shell
node --import ./lib/testUtils/setup.mjs --test --test-update-snapshots system-tests/001/fs.test.mjs
```

## The pattern

To add a system test, you should:

- add a test-case folder to `system-tests/` incrementing the number from existing test cases
- add a configuration file and a stylesheet
- add a `fs.test.mjs` and `no-fs.test.mjs` following the format established by existing tests, and using the `systemTestUtils`
- take a snapshot of `report`
