# Managing pull requests

You should:

- use [GitHub reviews](https://help.github.com/articles/about-pull-request-reviews/)
- review against the [Developer guide criteria](../developer-guide/rules.md)
- resolve conflicts by [rebasing](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)
- assign _zero or more_ [`pr: *`](https://github.com/stylelint/stylelint/labels) labels

You should not use any:

- other labels
- milestones

## Merging

When merging a PR, you should:

1. Use your judgment for the number of approvals needed:
   - one approval is usually fine for simple fixes
   - two approvals are often useful for bigger changes
2. If applicable, add a [changeset](https://github.com/changesets/changesets) using the GitHub interface:
   - prefix the entry with either: "Removed", "Changed", "Deprecated", "Added", "Fixed" or "Security"
   - if applicable, lead with the name of the rule, e.g. "Fixed: `unit-disallowed-list` false positives for custom properties".
3. ["Squash and merge"](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-request-merges#squash-and-merge-your-pull-request-commits) commits ensuring the resulting commit message:
   - either matches the changeset entry but in the present tense, e.g. "Fix `unit-disallowed-list` false positives for custom properties"
   - or is in sentence case and descriptive, e.g. "Refactor `colour-no-named` to use new AST"
