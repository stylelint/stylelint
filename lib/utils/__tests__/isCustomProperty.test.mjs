import assert from 'node:assert/strict';
import { it } from 'node:test';

import isCustomProperty from '../isCustomProperty.mjs';

it('isCustomProperty', () => {
	assert.ok(isCustomProperty('--custom-property'));
	assert.ok(!isCustomProperty('border-top-left-radius'));
	assert.ok(!isCustomProperty('-webkit-appearance'));
	assert.ok(!isCustomProperty('$sass-variable'));
	assert.ok(!isCustomProperty('@less-variable'));
	assert.ok(!isCustomProperty('var(--something)'));
	assert.ok(!isCustomProperty('var(  --something  )'));
});
