import { it } from 'node:test';

import isCustomProperty from '../isCustomProperty.mjs';

it('isCustomProperty', (t) => {
	t.assert.ok(isCustomProperty('--custom-property'));
	t.assert.ok(!isCustomProperty('border-top-left-radius'));
	t.assert.ok(!isCustomProperty('-webkit-appearance'));
	t.assert.ok(!isCustomProperty('$sass-variable'));
	t.assert.ok(!isCustomProperty('@less-variable'));
	t.assert.ok(!isCustomProperty('var(--something)'));
	t.assert.ok(!isCustomProperty('var(  --something  )'));
});
