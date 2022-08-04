'use strict';

const report = require('../report');
const postcss = require('postcss');

test('without disabledRanges', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 2, column: 1 }, end: { line: 2, column: 2 } }),
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with irrelevant general disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [{ start: 5, end: 8 }],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 2, column: 1 }, end: { line: 2, column: 2 } }),
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with relevant general disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [{ start: 5, end: 8 }],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test('with irrelevant rule-specific disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [],
					bar: [{ start: 5, end: 8 }],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with relevant rule-specific disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [],
					foo: [{ start: 5, end: 8 }],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test('with relevant general disabledRange, among others', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [
						{ start: 1, end: 3 },
						{ start: 5, end: 8 },
					],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test('with relevant rule-specific disabledRange, among others', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [],
					foo: [
						{ start: 1, end: 3, rules: ['foo'] },
						{ start: 5, end: 8, rules: ['foo'] },
					],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test('with relevant rule-specific disabledRange with range report', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				disabledRanges: {
					all: [],
					foo: [{ start: 2, end: 2 }],
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 2, column: 1 }, end: { line: 5, column: 1 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test("with quiet mode on and rule severity of 'warning'", () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				quiet: true,
				ruleSeverities: {
					foo: 'warning',
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test("with quiet mode on and rule severity of 'error'", () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				quiet: true,
				ruleSeverities: {
					foo: 'error',
				},
			},
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(1);
});

test('restoration of the `rangeBy` method if not present', () => {
	const node = postcss.parse('a {}').first;

	node.rangeBy = undefined;

	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
		},
		message: 'bar',
		node,
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(1);
});
