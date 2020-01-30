# Contributing

Thank you for wanting to contribute. stylelint *needs* community contributions to continue to improve.

If you like stylelint and open-source software (since you're reading this, you almost certainly do), please consider taking some time to pitch in. Not only will you help stylelint thrive, but you may learn a thing or two — about CSS, PostCSS, Node, ES2015, unit testing, open-source software, and more.

To help out, you can:

-   get involved in any open [issue](https://github.com/stylelint/stylelint/issues) or [pull request](https://github.com/stylelint/stylelint/pulls)
-   improve our [support for non-standard syntaxes](docs/about/syntaxes.md)
-   create, enhance and debug rules using [our guide](docs/developer-guide/rules.md)
-   improve the [documentation](docs/)
-   add new tests to *absolutely anything*
-   improve the [performance of rules](docs/developer-guide/rules.md#improve-the-performance-of-a-rule)
-   open [new issues](https://github.com/stylelint/stylelint/issues/new/choose) about your ideas for making stylelint better
-   create or contribute to [integrations](docs/user-guide/integrations/editor.md), like our plugin for [VS Code](https://github.com/stylelint/vscode-stylelint)

**We want to do everything we can to encourage contributions!** So if you want to participate but don't end up doing it for one reason or another, please [file an issue](https://github.com/stylelint/stylelint/issues/new) and give us feedback about what we could do to encourage you better.

## Code contributions

You should first [create a new issue](https://github.com/stylelint/stylelint/issues/new/choose) so that we can discuss your new feature, bug fix or change.

To start coding, you'll need:

-   a minimum of [Node.js](https://nodejs.org/en/) v10, though we do recommend using the latest LTS release
-   the latest [npm](https://www.npmjs.com/)

Then:

1.  [Fork and clone](https://guides.github.com/activities/forking/) the stylelint repository.
2.  Install all the dependencies with `npm ci`.

### Run tests

Next, you'll want to run the tests using `npm test`.

However, this runs all 25,000+ unit tests and also linting.

You can use interactive testing prompt to run tests for just a chosen set of files (which you'll want to do during development). For example, to run the tests for just the `color-hex-case` and `color-hex-length` rules:

1.  Run `npm run watch` to start the interactive testing prompt.
2.  Press `p` to filter by a filename regex pattern.
3.  Enter `color-hex-case|color-hex-length` i.e. each rule name separated by the pipe symbol (`|`).

You can find more information about testing on the [Jest website](https://jestjs.io/).

### Write code

With the interactive testing prompt running, you can write the code to fix the bug or add the new feature confident that things are working as expected. You'll find more guidance on how we write code in the [Developer guide](docs/developer-guide/rules.md).

### Format code

We use [Prettier](https://prettier.io/) (with [a Husky and lint-staged precommit](https://prettier.io/docs/en/precommit.html)) to format your code automatically.

Alternatively, you can:

-   trigger the pretty-printing all the files using `npm run prettier:fix`
-   use a [Prettier editor integration](https://prettier.io/docs/en/editors.html)

### Open a pull request

When you have something to share, it's time to [open a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

After we review and merge your pull request, we'll invite you to become a maintainer of the stylelint organization. You'll then be able to help manage issues, pull requests and releases. You'll also be able to work on the stylelint repository rather than your fork.

## Financial contributions

We welcome financial contributions in full transparency on our [Open Collective](https://opencollective.com/stylelint).

Anyone can file an expense. We will "merge" the expense into the ledger if it makes sense for the development of the community. Open Collective then reimburses the person who filed the expense.

You can financially support us by becoming a:

-   [backer](https://opencollective.com/stylelint#backer)
-   [sponsor](https://opencollective.com/stylelint#sponsor)
