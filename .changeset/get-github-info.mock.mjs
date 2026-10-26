import { mock } from 'node:test';

// Stands in for `@changesets/get-github-info` in changelog-stylelint.test.mjs.
export const getCommitInfo = mock.fn();
