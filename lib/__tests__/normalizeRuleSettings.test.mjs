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
	it('solo null returns null', () => {
		expect(normalizeRuleSettings(null, mockRule)).toBeNull();
	});

	it('arrayed null returns null', () => {
		expect(normalizeRuleSettings([null], mockRule)).toBeNull();
	});

	it('solo number returns arrayed number', () => {
		const actual = normalizeRuleSettings(2, mockRule);
		const expected = [2];

		expect(actual).toEqual(expected);
	});

	it('arrayed number returns arrayed number if rule is not special', () => {
		const actual = normalizeRuleSettings([2], mockRule);
		const expected = [2];

		expect(actual).toEqual(expected);
	});

	it('arrayed number with secondary options returns same', async () => {
		const rule = await rules['block-no-empty'];
		const actual = normalizeRuleSettings([2, { severity: 'warning' }], rule);
		const expected = [2, { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('solo string returns arrayed string', () => {
		const actual = normalizeRuleSettings('always', mockRule);
		const expected = ['always'];

		expect(actual).toEqual(expected);
	});

	it('arrayed string returns arrayed string', () => {
		const actual = normalizeRuleSettings(['always'], mockRule);
		const expected = ['always'];

		expect(actual).toEqual(expected);
	});

	it('arrayed string with secondary options returns same', () => {
		const actual = normalizeRuleSettings(['always', { severity: 'warning' }], mockRule);
		const expected = ['always', { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('solo boolean returns arrayed boolean', () => {
		const actual = normalizeRuleSettings(true, mockRule);
		const expected = [true];

		expect(actual).toEqual(expected);
	});

	it('arrayed boolean returns arrayed boolean if rule is not special', () => {
		const actual = normalizeRuleSettings([false], mockRule);
		const expected = [false];

		expect(actual).toEqual(expected);
	});

	it('arrayed boolean with secondary options returns same', async () => {
		const rule = await rules['block-no-empty'];
		const actual = normalizeRuleSettings([true, { severity: 'warning' }], rule);
		const expected = [true, { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});
});

describe('rules whose primary option CAN BE an array', () => {
	it('solo null returns null', () => {
		expect(normalizeRuleSettings(null, mockRule)).toBeNull();
	});

	it('arrayed null returns null', () => {
		expect(normalizeRuleSettings([null], mockRule)).toBeNull();
	});

	it('solo primary option array is nested within an array', async () => {
		const rule = await rules['function-allowed-list'];
		const actual = normalizeRuleSettings(['calc', 'rgba'], rule);
		const expected = [['calc', 'rgba']];

		expect(actual).toEqual(expected);
	});

	it('primary option array in an array', async () => {
		const rule = await rules['function-allowed-list'];
		const actual = normalizeRuleSettings([['calc', 'rgba']], rule);
		const expected = [['calc', 'rgba']];

		expect(actual).toEqual(expected);
	});

	it('nested primary option array returns same', async () => {
		const rule = await rules['function-allowed-list'];
		const actual = normalizeRuleSettings([['calc', 'rgba'], { severity: 'warning' }], rule);
		const expected = [['calc', 'rgba'], { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('string as first primary option returns same', () => {
		const actual = normalizeRuleSettings(['alphabetical', { severity: 'warning' }], mockRule);
		const expected = ['alphabetical', { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});

	it('primary option array with length of 2', () => {
		const actual = normalizeRuleSettings([{ foo: 1 }, { foo: 2 }], mockRuleWithPrimaryOptionArray);
		const expected = [[{ foo: 1 }, { foo: 2 }]];

		expect(actual).toEqual(expected);
	});

	it('primary option array with length of 2 and secondary options', () => {
		const actual = normalizeRuleSettings(
			[[{ foo: 1 }, { foo: 2 }], { severity: 'warning' }],
			mockRuleWithPrimaryOptionArray,
		);
		const expected = [[{ foo: 1 }, { foo: 2 }], { severity: 'warning' }];

		expect(actual).toEqual(expected);
	});
});
