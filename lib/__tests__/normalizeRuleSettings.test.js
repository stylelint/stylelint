'use strict';

const normalizeRuleSettings = require('../normalizeRuleSettings');

describe('rules whose primary option IS NOT an array', () => {
	it('solo null returns null', () => {
		expect(normalizeRuleSettings(null, 'foo')).toBeNull();
	});

	it('arrayed null returns null', () => {
		expect(normalizeRuleSettings([null], 'foo')).toBeNull();
	});

	it('solo number returns arrayed number', () => {
		const actual = normalizeRuleSettings(2, 'foo');
		const expected = [2];

		expect(actual).toEqual(expected);
	});

	it('arrayed number returns arrayed number if rule is not special', () => {
		const actual = normalizeRuleSettings([2], 'foo');
		const expected = [2];

		expect(actual).toEqual(expected);
	});

	it('arrayed number with secondary options returns same', () => {
		const actual = normalizeRuleSettings([2, { severity: 'warning' }], 'block-no-empty');
		const expected = [2, { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('solo string returns arrayed string', () => {
		const actual = normalizeRuleSettings('always', 'foo');
		const expected = ['always'];

		expect(actual).toEqual(expected);
	});

	it('arrayed string returns arrayed string', () => {
		const actual = normalizeRuleSettings(['always'], 'foo');
		const expected = ['always'];

		expect(actual).toEqual(expected);
	});

	it('arrayed string with secondary options returns same', () => {
		const actual = normalizeRuleSettings(['always', { severity: 'warning' }], 'foo');
		const expected = ['always', { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('solo boolean returns arrayed boolean', () => {
		const actual = normalizeRuleSettings(true, 'foo');
		const expected = [true];

		expect(actual).toEqual(expected);
	});

	it('arrayed boolean returns arrayed boolean if rule is not special', () => {
		const actual = normalizeRuleSettings([false], 'foo');
		const expected = [false];

		expect(actual).toEqual(expected);
	});

	it('arrayed boolean with secondary options returns same', () => {
		const actual = normalizeRuleSettings([true, { severity: 'warning' }], 'block-no-empty');
		const expected = [true, { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});
});

describe('rules whose primary option CAN BE an array', () => {
	it('solo null returns null', () => {
		expect(normalizeRuleSettings(null, 'foo')).toBeNull();
	});

	it('arrayed null returns null', () => {
		expect(normalizeRuleSettings([null], 'foo')).toBeNull();
	});

	it('solo primary option array is nested within an array', () => {
		const actual = normalizeRuleSettings(['calc', 'rgba'], 'function-whitelist', true);
		const expected = [['calc', 'rgba']];

		expect(actual).toEqual(expected);
	});

	it('primary option array in an array', () => {
		const actual = normalizeRuleSettings([['calc', 'rgba']], 'function-whitelist', true);
		const expected = [['calc', 'rgba']];

		expect(actual).toEqual(expected);
	});

	it('nested primary option array returns same', () => {
		const actual = normalizeRuleSettings(
			[['calc', 'rgba'], { severity: 'warning' }],
			'function-whitelist',
			true,
		);
		const expected = [['calc', 'rgba'], { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('string as first primary option returns same', () => {
		const actual = normalizeRuleSettings(['alphabetical', { severity: 'warning' }], 'rulename-bar');
		const expected = ['alphabetical', { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('primary option array with length of 2', () => {
		const actual = normalizeRuleSettings([{ foo: 1 }, { foo: 2 }], 'rulename-bar', true);
		const expected = [[{ foo: 1 }, { foo: 2 }]];

		expect(actual).toEqual(expected);
	});

	it('primary option array with length of 2 and secondary options', () => {
		const actual = normalizeRuleSettings(
			[[{ foo: 1 }, { foo: 2 }], { severity: 'warning' }],
			'rulename-bar',
			true,
		);
		const expected = [[{ foo: 1 }, { foo: 2 }], { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});
});
