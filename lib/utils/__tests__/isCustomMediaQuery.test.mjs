import assert from 'node:assert/strict';
import { it } from 'node:test';

import isCustomMediaQuery from '../isCustomMediaQuery.mjs';

it('isCustomMediaQuery', () => {
	assert.ok(isCustomMediaQuery('--custom-media-query'));
	assert.ok(!isCustomMediaQuery('border-top-left-radius'));
	assert.ok(!isCustomMediaQuery('-webkit-appearance'));
	assert.ok(!isCustomMediaQuery('$sass-variable'));
	assert.ok(!isCustomMediaQuery('@less-variable'));
	assert.ok(!isCustomMediaQuery('var(--something)'));
	assert.ok(!isCustomMediaQuery('var(  --something  )'));
});
