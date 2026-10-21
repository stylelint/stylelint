import { beforeEach, describe, it, mock } from 'node:test';

import validateOptions from '../validateOptions.mjs';

function mockResult() {
	return {
		warn: mock.fn(),
		stylelint: { config: { validate: true } },
	};
}

describe('validateOptions for primary options', () => {
	const result = mockResult();

	beforeEach(() => result.warn.mock.resetCalls());

	it('passing string equivalence', (t) => {
		validateOptions(result, 'foo', {
			possible: ['a', 'b', 'c'],
			actual: 'a',
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('failing string equivalence', (t) => {
		validateOptions(result, 'foo', {
			possible: ['a', 'b', 'c'],
			actual: 'd',
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 1);
		t.assert.strictEqual(
			result.warn.mock.calls[0].arguments[0],
			'Invalid option value "d" for rule "foo"',
		);
	});

	it('passing null equivalence', (t) => {
		validateOptions(result, 'foo', {
			possible: [true, null],
			actual: null,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('failing null equivalence', (t) => {
		validateOptions(result, 'foo', {
			possible: [true, null],
			actual: 'a',
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 1);
		t.assert.strictEqual(
			result.warn.mock.calls[0].arguments[0],
			'Invalid option value "a" for rule "foo"',
		);
	});

	it('passing evaluation', (t) => {
		validateOptions(result, 'bar', {
			possible: ['a', (x) => x > 2, 'c'],
			actual: 3,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('failing evaluation', (t) => {
		validateOptions(result, 'bar', {
			possible: ['a', (x) => x > 2, 'c'],
			actual: 1,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 1);
		t.assert.strictEqual(
			result.warn.mock.calls[0].arguments[0],
			'Invalid option value "1" for rule "bar"',
		);
	});

	it('undefined `actual` with `possible` value and no `optional` option', (t) => {
		validateOptions(result, 'foo', {
			possible: [true],
			actual: undefined,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 1);
		t.assert.strictEqual(
			result.warn.mock.calls[0].arguments[0],
			'Expected option value for rule "foo"',
		);
	});

	it('false `actual` for report* properties', (t) => {
		validateOptions(result, 'reportInvalidScopeDisables', {
			possible: [true, false],
			actual: false,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('false `actual` for rules named report*', (t) => {
		validateOptions(result, 'report-bar-qux', {
			possible: [true, false],
			actual: false,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 1);
	});
});

describe('validateOptions for secondary options objects', () => {
	const result = mockResult();

	beforeEach(() => result.warn.mock.resetCalls());

	const schema = {
		foo: ['always', 'never'],
		bar: [(x) => typeof x === 'number', 'tab'],
	};

	it('valid secondary options', (t) => {
		validateOptions(result, 'foo', {
			possible: schema,
			actual: { foo: 'always', bar: 2 },
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);

		validateOptions(result, 'foo', {
			possible: schema,
			actual: { foo: 'never', bar: 'tab' },
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('invalid secondary options', (t) => {
		validateOptions(result, 'bar', {
			possible: schema,
			actual: { foo: 'neveer', bar: false },
		});
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Invalid value "neveer" for option "foo" of rule "bar"',
			{ stylelintType: 'invalidOption' },
		]);
		t.assert.strictEqual(
			result.warn.mock.calls[1].arguments[0],
			'Invalid value "false" for option "bar" of rule "bar"',
		);
		result.warn.mock.resetCalls();

		validateOptions(result, 'bar', {
			possible: schema,
			actual: { foo: 'never', barr: 1 },
		});
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Invalid option name "barr" for rule "bar"',
			{ stylelintType: 'invalidOption' },
		]);
	});

	it('undefined `actual` with `possible` value and an `optional` option', (t) => {
		validateOptions(result, 'foo', {
			possible: [true],
			actual: undefined,
			optional: true,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('possible is actual but actual is non-object', (t) => {
		validateOptions(result, 'foo', {
			possible: schema,
			actual: 2,
		});
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Invalid option value "2" for rule "foo": should be an object',
			{ stylelintType: 'invalidOption' },
		]);
	});

	it(`should have "possible" if "optional" is set`, (t) => {
		validateOptions(result, 'foo', {
			optional: true,
			actual: { foo: 'always' },
		});

		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Incorrect configuration for rule "foo". Rule should have "possible" values for options validation',
			{ stylelintType: 'invalidOption' },
		]);
	});
});

it('validateOptions for secondary options objects with subarrays', (t) => {
	const result = mockResult();

	const schema = {
		bar: ['one', 'two', 'three', 'four'],
	};

	validateOptions(result, 'foo', {
		possible: schema,
		actual: { bar: ['one', 'three'] },
	});
	t.assert.strictEqual(result.warn.mock.callCount(), 0);

	validateOptions(result, 'foo', {
		possible: schema,
		actual: { bar: ['one', 'three', { floor: 1 }] },
	});
	t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
		'Invalid value "{"floor":1}" for option "bar" of rule "foo"',
		{ stylelintType: 'invalidOption' },
	]);
});

describe('validateOptions for `*-no-*` rule with no valid options', () => {
	const result = mockResult();

	beforeEach(() => result.warn.mock.resetCalls());

	it('with empty array as `possible`', (t) => {
		validateOptions(result, 'no-dancing', {
			possible: [],
			actual: undefined,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('with empty object as `possible`', (t) => {
		validateOptions(result, 'no-dancing', {
			possible: {},
			actual: undefined,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('with undefined as `possible`', (t) => {
		validateOptions(result, 'no-dancing', {
			possible: undefined,
			actual: undefined,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('with null as `possible`', (t) => {
		validateOptions(result, 'no-dancing', {
			possible: null,
			actual: undefined,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('with `possible` left undefined', (t) => {
		validateOptions(result, 'no-dancing', {
			actual: undefined,
		});
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('with options (string)', (t) => {
		validateOptions(result, 'no-dancing', {
			actual: 'foo',
		});
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Unexpected option value "foo" for rule "no-dancing"',
			{ stylelintType: 'invalidOption' },
		]);
	});

	it('with options (boolean)', (t) => {
		validateOptions(result, 'no-dancing', {
			actual: false,
		});
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Invalid option value "false" for rule "no-dancing". Are you trying to disable this rule? If so use "null" instead',
			{ stylelintType: 'invalidOption' },
		]);
	});

	it('with options (object)', (t) => {
		validateOptions(result, 'no-dancing', {
			actual: { bar: 1 },
		});
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Unexpected option value "{"bar":1}" for rule "no-dancing"',
			{ stylelintType: 'invalidOption' },
		]);
	});
});

it('validateOptions for multiple actual/possible pairs, checking return value', (t) => {
	const result = mockResult();

	const validOptions = validateOptions(
		result,
		'foo',
		{
			possible: ['one', 'two'],
			actual: 'one',
		},
		{
			possible: ['three', 'four'],
			actual: 'three',
		},
	);

	t.assert.strictEqual(validOptions, true);
	t.assert.strictEqual(result.warn.mock.callCount(), 0);

	const invalidOptions = validateOptions(
		result,
		'foo',
		{
			possible: ['one', 'two'],
			actual: 'onne',
		},
		{
			possible: ['three', 'four'],
			actual: { three_: 1 },
		},
	);

	t.assert.strictEqual(invalidOptions, false);
	t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
		'Invalid option value "onne" for rule "foo"',
		{ stylelintType: 'invalidOption' },
	]);
	t.assert.strictEqual(
		result.warn.mock.calls[1].arguments[0],
		'Invalid option value "{"three_":1}" for rule "foo"',
	);
});

describe("validateOptions with a function for 'possible'", () => {
	const result = mockResult();

	beforeEach(() => result.warn.mock.resetCalls());

	const schema = (x) => {
		if (x === 'bar') {
			return true;
		}

		if (!Array.isArray(x)) {
			return false;
		}

		if (x.every((item) => typeof item === 'string' || Boolean(item.properties))) {
			return true;
		}

		return false;
	};

	it('explicitly named string passes', (t) => {
		const validExplicitlyNamedString = validateOptions(result, 'foo', {
			possible: schema,
			actual: 'bar',
		});

		t.assert.strictEqual(validExplicitlyNamedString, true);
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('array of strings passes', (t) => {
		const validArrayOfStrings = validateOptions(result, 'foo', {
			possible: schema,
			actual: ['one', 'two', 'three'],
		});

		t.assert.strictEqual(validArrayOfStrings, true);
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('array of objects passes', (t) => {
		const validArrayOfObjects = validateOptions(result, 'foo', {
			possible: schema,
			actual: [{ properties: ['one'] }, { properties: ['two', 'three'] }],
		});

		t.assert.strictEqual(validArrayOfObjects, true);
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('array of mixed objects and strings passes', (t) => {
		const validArrayOfObjectsAndStrings = validateOptions(result, 'foo', {
			possible: schema,
			actual: [{ properties: ['one'] }, { properties: ['two', 'three'] }, 'four'],
		});

		t.assert.strictEqual(validArrayOfObjectsAndStrings, true);
		t.assert.strictEqual(result.warn.mock.callCount(), 0);
	});

	it('object of mixed objects and strings passes', (t) => {
		const invalidObject = validateOptions(result, 'foo', {
			possible: schema,
			actual: { properties: ['one'] },
		});

		t.assert.strictEqual(invalidObject, false);
		t.assert.deepStrictEqual(result.warn.mock.calls[0].arguments, [
			'Invalid option "{"properties":["one"]}" for rule "foo"',
			{ stylelintType: 'invalidOption' },
		]);
	});
});

it('validateOptions for null instead of array', (t) => {
	const result = mockResult();

	validateOptions(result, 'no-dancing', {
		actual: null,
		possible: [(v) => typeof v === 'string'],
	});
	t.assert.strictEqual(result.warn.mock.callCount(), 0);
});

it('validateOptions for arrayed null instead of array', (t) => {
	const result = mockResult();

	validateOptions(result, 'no-dancing', {
		actual: [null],
		possible: [(v) => typeof v === 'string'],
	});
	t.assert.strictEqual(result.warn.mock.callCount(), 0);
});
