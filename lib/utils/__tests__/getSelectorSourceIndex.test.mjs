import { it } from 'node:test';

import getSelectorSourceIndex from '../getSelectorSourceIndex.mjs';
import parseSelector from '../parseSelector.mjs';

it('getSelectorSourceIndex', (t) => {
	t.assert.strictEqual(getSelectorSourceIndex(parseSelector('a')), 0);
	t.assert.strictEqual(getSelectorSourceIndex(parseSelector('a').nodes[0]), 0);
	t.assert.strictEqual(getSelectorSourceIndex(parseSelector('a,b').nodes[1]), 2);

	// Check that source indices are whitespace exclusive
	t.assert.strictEqual(getSelectorSourceIndex(parseSelector('a, b').nodes[1]), 3);

	// Check that we fallback to the selector source index when a selector node has no children
	t.assert.strictEqual(getSelectorSourceIndex(parseSelector('a,,b').nodes[1]), 2);
});
