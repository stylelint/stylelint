import { it } from 'node:test';

import isCustomSelector from '../isCustomSelector.mjs';

it('isCustomSelector', (t) => {
	t.assert.ok(isCustomSelector(':--custom-selector'));
	t.assert.ok(!isCustomSelector('a'));
	t.assert.ok(!isCustomSelector('#div'));
	t.assert.ok(!isCustomSelector(':hover'));
	t.assert.ok(!isCustomSelector(':before'));
	t.assert.ok(!isCustomSelector('::before'));
});
