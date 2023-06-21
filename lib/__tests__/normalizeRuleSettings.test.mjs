import createPlugin from '../createPlugin.js';
import normalizeRuleSettings from '../normalizeRuleSettings.js';
import rules from '../rules/index.js';

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

	it('arrayed number with secondary options returns same', () => {
		const actual = normalizeRuleSettings([2, { severity: 'warning' }], rules['block-no-empty']);
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

	it('arrayed boolean with secondary options returns same', () => {
		const actual = normalizeRuleSettings([true, { severity: 'warning' }], rules['block-no-empty']);
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

	it('solo primary option array is nested within an array', () => {
		const actual = normalizeRuleSettings(['calc', 'rgba'], rules['function-allowed-list']);
		const expected = [['calc', 'rgba']];

		expect(actual).toEqual(expected);
	});

	it('primary option array in an array', () => {
		const actual = normalizeRuleSettings([['calc', 'rgba']], rules['function-allowed-list']);
		const expected = [['calc', 'rgba']];

		expect(actual).toEqual(expected);
	});

	it('nested primary option array returns same', () => {
		const actual = normalizeRuleSettings(
			[['calc', 'rgba'], { severity: 'warning' }],
			rules['function-allowed-list'],
		);
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
