import { it } from 'node:test';

import ruleMessages from '../ruleMessages.mjs';

it('ruleMessages with simple messages', (t) => {
	t.assert.deepStrictEqual(
		ruleMessages('foo', {
			good: 'GOOD',
			bad: 'BAD',
		}),
		{
			good: 'GOOD (foo)',
			bad: 'BAD (foo)',
		},
	);
});

it('ruleMessages with message functions', (t) => {
	let withRuleName;
	let result;
	const fooOriginal = {
		good: (x) => `GOOD ${x}`,
		bad: (x, y, z) => `GOOD ${x} [${y} and ${z}]`,
	};
	const fooWithRuleName = ruleMessages('bar', fooOriginal);

	withRuleName = fooWithRuleName.good('baz');
	result = `${fooOriginal.good('baz')} (bar)`;
	t.assert.strictEqual(withRuleName, result);

	withRuleName = fooWithRuleName.bad('baz', 2, 'hoohah');
	result = `${fooOriginal.bad('baz', 2, 'hoohah')} (bar)`;
	t.assert.strictEqual(withRuleName, result);
});
