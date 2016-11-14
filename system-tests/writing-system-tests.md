# Writing system tests

The goal of these system tests is to verify that stylelint works as expected. They are another line of defense against regressions, after the unit tests and integration tests.

Each of these system tests assert that we end up with some expected output, given a configuration and a stylesheet.

These tests are not meant to comprehensive and systematic (*the unit tests are*). They are meant to reproduce real use-cases (of which there aren infinite variety) and verify that those use-cases work as expected. The more cases we add, the more effective these tests will be.

## Jest snapshots

The tests use Jest snapshots, so we can easily assert against potentially large objects and strings, and so we can easily update expectations as needed.

## The pattern

-   Add a test-case folder to `system-tests/` incrementing the number from existing test cases.
-   Add a configuration file and a stylesheet.
-   Setup the test following the format established by existing tests, and using the `systemTestUtils`.
-   Take a snapshot the JSON `results` array.
