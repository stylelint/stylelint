import assert from 'node:assert/strict';
import { it } from 'node:test';

import isCustomFunction from '../isCustomFunction.mjs';

it('isCustomFunction', () => {
	assert.ok(isCustomFunction('--custom-function'));
	assert.ok(!isCustomFunction('calc'));
	assert.ok(!isCustomFunction('$sass-variable'));
	assert.ok(!isCustomFunction('@less-variable'));
	assert.ok(!isCustomFunction('var(--something)'));
	assert.ok(!isCustomFunction('var(  --something  )'));
});
