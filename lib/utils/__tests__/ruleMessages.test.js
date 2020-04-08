'use strict';

const ruleMessages = require('../ruleMessages');

it('ruleMessages with simple messages', () => {
	expect(
		ruleMessages('foo', {
			good: 'GOOD',
			bad: 'BAD',
		}),
	).toEqual({
		good: 'GOOD (foo)',
		bad: 'BAD (foo)',
	});
});

it('ruleMessages with message functions', () => {
	let withRuleName;
	let result;
	const fooOriginal = {
		good: (x) => `GOOD ${x}`,
		bad: (x, y, z) => `GOOD ${x} [${y} and ${z}]`,
	};
	const fooWithRuleName = ruleMessages('bar', fooOriginal);

	withRuleName = fooWithRuleName.good('baz');
	result = `${fooOriginal.good('baz')} (bar)`;
	expect(withRuleName).toBe(result);

	withRuleName = fooWithRuleName.bad('baz', 2, 'hoohah');
	result = `${fooOriginal.bad('baz', 2, 'hoohah')} (bar)`;
	expect(withRuleName).toBe(result);
});
