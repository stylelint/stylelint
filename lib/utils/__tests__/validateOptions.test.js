'use strict';

const validateOptions = require('../validateOptions');

function mockResult() {
	return { warn: jest.fn() };
}

describe('validateOptions for primary options', () => {
	const result = mockResult();

	it('passing string equivalence', () => {
		validateOptions(result, 'foo', {
			possible: ['a', 'b', 'c'],
			actual: 'a',
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('failing string equivalence', () => {
		validateOptions(result, 'foo', {
			possible: ['a', 'b', 'c'],
			actual: 'd',
		});
		expect(result.warn).toHaveBeenCalledTimes(1);
		expect(result.warn.mock.calls[0][0]).toEqual('Invalid option value "d" for rule "foo"');
	});

	it('passing boolean equivalence', () => {
		validateOptions(result, 'foo', {
			possible: [true, false],
			actual: false,
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('failing boolean equivalence', () => {
		validateOptions(result, 'foo', {
			possible: [true, false],
			actual: 'a',
		});
		expect(result.warn).toHaveBeenCalledTimes(1);
		expect(result.warn.mock.calls[0][0]).toEqual('Invalid option value "a" for rule "foo"');
	});

	it('passing evaluation', () => {
		validateOptions(result, 'bar', {
			possible: ['a', (x) => x > 2, 'c'],
			actual: 3,
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('failing evaluation', () => {
		validateOptions(result, 'bar', {
			possible: ['a', (x) => x > 2, 'c'],
			actual: 1,
		});
		expect(result.warn).toHaveBeenCalledTimes(1);
		expect(result.warn.mock.calls[0][0]).toEqual('Invalid option value "1" for rule "bar"');
	});

	it('undefined `actual` with `possible` values and no `optional` option', () => {
		validateOptions(result, 'foo', {
			possible: [true, false],
			actual: undefined,
		});
		expect(result.warn).toHaveBeenCalledTimes(1);
		expect(result.warn.mock.calls[0][0]).toEqual('Expected option value for rule "foo"');
	});
});

describe('validateOptions for secondary options objects', () => {
	const result = mockResult();

	const schema = {
		foo: ['always', 'never'],
		bar: [(x) => typeof x === 'number', 'tab'],
	};

	it('valid secondary options', () => {
		validateOptions(result, 'foo', {
			possible: schema,
			actual: { foo: 'always', bar: 2 },
		});
		expect(result.warn).toHaveBeenCalledTimes(0);

		validateOptions(result, 'foo', {
			possible: schema,
			actual: { foo: 'never', bar: 'tab' },
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('invalid secondary options', () => {
		validateOptions(result, 'bar', {
			possible: schema,
			actual: { foo: 'neveer', bar: false },
		});
		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual(
			'Invalid value "neveer" for option "foo" of rule "bar"',
		);
		expect(result.warn.mock.calls[1][0]).toEqual(
			'Invalid value "false" for option "bar" of rule "bar"',
		);
		result.warn.mockClear();

		validateOptions(result, 'bar', {
			possible: schema,
			actual: { foo: 'never', barr: 1 },
		});
		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual('Invalid option name "barr" for rule "bar"');
	});

	it('undefined `actual` with `possible` values and an `optional` option', () => {
		validateOptions(result, 'foo', {
			possible: [true, false],
			actual: undefined,
			optional: true,
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('possible is actual but actual is non-object', () => {
		validateOptions(result, 'foo', {
			possible: schema,
			actual: 2,
		});
		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual(
			'Invalid option value 2 for rule "foo": should be an object',
		);
	});

	it(`should have "possible" if "optional" is set`, () => {
		validateOptions(result, 'foo', {
			optional: true,
			actual: { foo: 'always' },
		});

		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual(
			'Incorrect configuration for rule "foo". Rule should have "possible" values for options validation',
		);
	});
});

it('validateOptions for secondary options objects with subarrays', () => {
	const result = mockResult();

	const schema = {
		bar: ['one', 'two', 'three', 'four'],
	};

	validateOptions(result, 'foo', {
		possible: schema,
		actual: { bar: ['one', 'three'] },
	});
	expect(result.warn).toHaveBeenCalledTimes(0);

	validateOptions(result, 'foo', {
		possible: schema,
		actual: { bar: ['one', 'three', 'floor'] },
	});
	expect(result.warn.mock.calls[0]).toHaveLength(2);
	expect(result.warn.mock.calls[0][0]).toEqual(
		'Invalid value "floor" for option "bar" of rule "foo"',
	);
});

describe('validateOptions for `*-no-*` rule with no valid options', () => {
	const result = mockResult();

	it('with empty array as `possible`', () => {
		validateOptions(result, 'no-dancing', {
			possible: [],
			actual: undefined,
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('with `possible` left undefined', () => {
		validateOptions(result, 'no-dancing', {
			actual: undefined,
		});
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('with options', () => {
		validateOptions(result, 'no-dancing', {
			actual: 'foo',
		});
		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual(
			'Unexpected option value "foo" for rule "no-dancing"',
		);
		result.warn.mockClear();

		validateOptions(result, 'no-dancing', {
			actual: false,
		});
		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual(
			'Unexpected option value "false" for rule "no-dancing"',
		);
	});
});

it('validateOptions for multiple actual/possible pairs, checking return value', () => {
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

	expect(validOptions).toBe(true);
	expect(result.warn).toHaveBeenCalledTimes(0);

	const invalidOptions = validateOptions(
		result,
		'foo',
		{
			possible: ['one', 'two'],
			actual: 'onne',
		},
		{
			possible: ['three', 'four'],
			actual: 'threee',
		},
	);

	expect(invalidOptions).toBe(false);
	expect(result.warn.mock.calls[0]).toHaveLength(2);
	expect(result.warn.mock.calls[0][0]).toEqual('Invalid option value "onne" for rule "foo"');
	expect(result.warn.mock.calls[1][0]).toEqual('Invalid option value "threee" for rule "foo"');
});

describe("validateOptions with a function for 'possible'", () => {
	const result = mockResult();
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

	it('explicitly named string passes', () => {
		const validExplicitlyNamedString = validateOptions(result, 'foo', {
			possible: schema,
			actual: 'bar',
		});

		expect(validExplicitlyNamedString).toBe(true);
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('array of strings passes', () => {
		const validArrayOfStrings = validateOptions(result, 'foo', {
			possible: schema,
			actual: ['one', 'two', 'three'],
		});

		expect(validArrayOfStrings).toBe(true);
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('array of objects passes', () => {
		const validArrayOfObjects = validateOptions(result, 'foo', {
			possible: schema,
			actual: [{ properties: ['one'] }, { properties: ['two', 'three'] }],
		});

		expect(validArrayOfObjects).toBe(true);
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('array of mixed objects and strings passes', () => {
		const validArrayOfObjectsAndStrings = validateOptions(result, 'foo', {
			possible: schema,
			actual: [{ properties: ['one'] }, { properties: ['two', 'three'] }, 'four'],
		});

		expect(validArrayOfObjectsAndStrings).toBe(true);
		expect(result.warn).toHaveBeenCalledTimes(0);
	});

	it('object of mixed objects and strings passes', () => {
		const invalidObject = validateOptions(result, 'foo', {
			possible: schema,
			actual: { properties: ['one'] },
		});

		expect(invalidObject).toBe(false);
		expect(result.warn.mock.calls[0]).toHaveLength(2);
		expect(result.warn.mock.calls[0][0]).toEqual(
			'Invalid option "{"properties":["one"]}" for rule foo',
		);
	});
});

it('validateOptions for null instead of array', () => {
	const result = mockResult();

	validateOptions(result, 'no-dancing', {
		actual: null,
		possible: [(v) => typeof v === 'string'],
	});
	expect(result.warn).toHaveBeenCalledTimes(0);
});

it('validateOptions for arrayed null instead of array', () => {
	const result = mockResult();

	validateOptions(result, 'no-dancing', {
		actual: [null],
		possible: [(v) => typeof v === 'string'],
	});
	expect(result.warn).toHaveBeenCalledTimes(0);
});
