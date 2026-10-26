import { test } from 'node:test';

import pluralize from '../pluralize.mjs';

test('pluralize()', (t) => {
	t.assert.strictEqual(pluralize('word', 0), 'words');
	t.assert.strictEqual(pluralize('word', 1), 'word');
	t.assert.strictEqual(pluralize('word', 2), 'words');
});
