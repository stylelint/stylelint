import assert from 'node:assert/strict';
import { it } from 'node:test';

import isCustomSelector from '../isCustomSelector.mjs';

it('isCustomSelector', () => {
	assert.ok(isCustomSelector(':--custom-selector'));
	assert.ok(!isCustomSelector('a'));
	assert.ok(!isCustomSelector('#div'));
	assert.ok(!isCustomSelector(':hover'));
	assert.ok(!isCustomSelector(':before'));
	assert.ok(!isCustomSelector('::before'));
});
