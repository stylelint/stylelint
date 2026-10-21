import { it } from 'node:test';

import isCustomMediaQuery from '../isCustomMediaQuery.mjs';

it('isCustomMediaQuery', (t) => {
	t.assert.ok(isCustomMediaQuery('--custom-media-query'));
	t.assert.ok(!isCustomMediaQuery('border-top-left-radius'));
	t.assert.ok(!isCustomMediaQuery('-webkit-appearance'));
	t.assert.ok(!isCustomMediaQuery('$sass-variable'));
	t.assert.ok(!isCustomMediaQuery('@less-variable'));
	t.assert.ok(!isCustomMediaQuery('var(--something)'));
	t.assert.ok(!isCustomMediaQuery('var(  --something  )'));
});
