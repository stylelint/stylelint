import { it } from 'node:test';

import isCustomFunction from '../isCustomFunction.mjs';

it('isCustomFunction', (t) => {
	t.assert.ok(isCustomFunction('--custom-function'));
	t.assert.ok(!isCustomFunction('calc'));
	t.assert.ok(!isCustomFunction('$sass-variable'));
	t.assert.ok(!isCustomFunction('@less-variable'));
	t.assert.ok(!isCustomFunction('var(--something)'));
	t.assert.ok(!isCustomFunction('var(  --something  )'));
});
