import { describe, it } from 'node:test';

import createPlugin from '../createPlugin.mjs';
import normalizeRuleSettings from '../normalizeRuleSettings.mjs';
import rules from '../rules/index.mjs';

const mockRule = createPlugin('mock-rule', () => () => {});
const mockRuleWithPrimaryOptionArray = createPlugin(
	'mock-rule-with-primary-option-array',
	() => () => {},
);

mockRuleWithPrimaryOptionArray.primaryOptionArray = true;

describe('rules whose primary option IS NOT an array', () => {
	it('solo null returns null', (t) => {
		t.assert.strictEqual(normalizeRuleSettings(null, mockRule), null);
	});

	it('arrayed null returns null', (t) => {
		t.assert.strictEqual(normalizeRuleSettings([null], mockRule), null);
	});

	it('solo number returns arrayed number', (t) => {
		const actual = normalizeRuleSettings(2, mockRule);
		const expected = [2];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('arrayed number returns arrayed number if rule is not special', (t) => {
		const actual = normalizeRuleSettings([2], mockRule);
		const expected = [2];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('arrayed number with secondary options returns same', async (t) => {
		const rule = await rules['block-no-empty'];
		const actual = normalizeRuleSettings([2, { severity: 'warning' }], rule);
		const expected = [2, { severity: 'warning' }];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('solo string returns arrayed string', (t) => {
		const actual = normalizeRuleSettings('always', mockRule);
		const expected = ['always'];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('arrayed string returns arrayed string', (t) => {
		const actual = normalizeRuleSettings(['always'], mockRule);
		const expected = ['always'];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('arrayed string with secondary options returns same', (t) => {
		const actual = normalizeRuleSettings(['always', { severity: 'warning' }], mockRule);
		const expected = ['always', { severity: 'warning' }];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('solo boolean returns arrayed boolean', (t) => {
		const actual = normalizeRuleSettings(true, mockRule);
		const expected = [true];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('arrayed boolean returns arrayed boolean if rule is not special', (t) => {
		const actual = normalizeRuleSettings([false], mockRule);
		const expected = [false];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('arrayed boolean with secondary options returns same', async (t) => {
		const rule = await rules['block-no-empty'];
		const actual = normalizeRuleSettings([true, { severity: 'warning' }], rule);
		const expected = [true, { severity: 'warning' }];

		t.assert.deepStrictEqual(actual, expected);
	});
});

describe('rules whose primary option CAN BE an array', () => {
	it('solo null returns null', (t) => {
		t.assert.strictEqual(normalizeRuleSettings(null, mockRule), null);
	});

	it('arrayed null returns null', (t) => {
		t.assert.strictEqual(normalizeRuleSettings([null], mockRule), null);
	});

	it('solo primary option array is nested within an array', async (t) => {
		const rule = await rules['function-allowed-list'];
		const actual = normalizeRuleSettings(['calc', 'rgba'], rule);
		const expected = [['calc', 'rgba']];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('primary option array in an array', async (t) => {
		const rule = await rules['function-allowed-list'];
		const actual = normalizeRuleSettings([['calc', 'rgba']], rule);
		const expected = [['calc', 'rgba']];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('nested primary option array returns same', async (t) => {
		const rule = await rules['function-allowed-list'];
		const actual = normalizeRuleSettings([['calc', 'rgba'], { severity: 'warning' }], rule);
		const expected = [['calc', 'rgba'], { severity: 'warning' }];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('string as first primary option returns same', (t) => {
		const actual = normalizeRuleSettings(['alphabetical', { severity: 'warning' }], mockRule);
		const expected = ['alphabetical', { severity: 'warning' }];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('primary option array with length of 2', (t) => {
		const actual = normalizeRuleSettings([{ foo: 1 }, { foo: 2 }], mockRuleWithPrimaryOptionArray);
		const expected = [[{ foo: 1 }, { foo: 2 }]];

		t.assert.deepStrictEqual(actual, expected);
	});

	it('primary option array with length of 2 and secondary options', (t) => {
		const actual = normalizeRuleSettings(
			[[{ foo: 1 }, { foo: 2 }], { severity: 'warning' }],
			mockRuleWithPrimaryOptionArray,
		);
		const expected = [[{ foo: 1 }, { foo: 2 }], { severity: 'warning' }];

		t.assert.deepStrictEqual(actual, expected);
	});
});
