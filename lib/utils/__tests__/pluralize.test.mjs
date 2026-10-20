import assert from 'node:assert/strict';
import { test } from 'node:test';

import pluralize from '../pluralize.mjs';

test('pluralize()', () => {
	assert.equal(pluralize('word', 0), 'words');
	assert.equal(pluralize('word', 1), 'word');
	assert.equal(pluralize('word', 2), 'words');
});
