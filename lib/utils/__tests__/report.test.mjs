import report from '../report.mjs';

import { jest } from '@jest/globals';

const defaultRangeBy = () => ({ start: { line: 2, column: 1 }, end: { line: 2, column: 2 } });

test('without disabledRanges', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				ruleSeverities: {},
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
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
				ruleSeverities: {},
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
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
				ruleSeverities: {},
				fixersData: {},
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
				ruleSeverities: {},
				fixersData: {},
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
				ruleSeverities: {},
				fixersData: {},
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
				ruleSeverities: {},
				fixersData: {},
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
				ruleSeverities: {},
				fixersData: {},
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
				ruleSeverities: {},
				fixersData: {},
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
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
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
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(1);
});

test('with custom rule severity', () => {
	const v = {
		ruleName: 'foo',
		severity: 'warning',
		result: {
			warn: jest.fn(),
			stylelint: {
				ruleSeverities: {
					foo: 'error',
				},
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar');
	expect(spyArgs[1].severity).toBe('warning');
	expect(spyArgs[1].node).toBe(v.node);
});

test("with quiet mode on and custom rule severity of 'error'", () => {
	const v = {
		ruleName: 'foo',
		severity: 'error',
		result: {
			warn: jest.fn(),
			stylelint: {
				quiet: true,
				ruleSeverities: {
					foo: 'warning',
				},
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(1);
});

test("with quiet mode on and custom rule severity of 'warning'", () => {
	const v = {
		ruleName: 'foo',
		severity: 'warning',
		result: {
			warn: jest.fn(),
			stylelint: {
				quiet: true,
				ruleSeverities: {
					foo: 'error',
				},
				fixersData: {},
			},
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test("with quiet mode on and with functional rule severity of 'error'", () => {
	const customSeverity = jest.fn(() => 'error');
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				quiet: true,
				ruleSeverities: {
					foo: customSeverity,
				},
				fixersData: {},
			},
		},
		message: 'bar',
		messageArgs: ['baz'],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	expect(customSeverity).toHaveBeenCalledTimes(1);
	expect(customSeverity.mock.calls[0][0]).toBe('baz');
	expect(v.result.warn).toHaveBeenCalledTimes(1);
});

test("with quiet mode on and with functional rule severity of 'warning'", () => {
	const customSeverity = jest.fn(() => 'warning');
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				quiet: true,
				ruleSeverities: {
					foo: customSeverity,
				},
				fixersData: {},
			},
		},
		message: 'bar',
		messageArgs: ['baz'],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	expect(customSeverity).toHaveBeenCalledTimes(1);
	expect(customSeverity.mock.calls[0][0]).toBe('baz');
	expect(v.result.warn).toHaveBeenCalledTimes(0);
});

test('with message function', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				ruleSeverities: {},
				fixersData: {},
			},
		},
		message: (a, b, c, d) => `a=${a}, b=${b}, c=${c}, d=${d}`,
		messageArgs: ['str', true, 10, /regex/],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('a=str, b=true, c=10, d=/regex/');
	expect(spyArgs[1].node).toBe(v.node);
});

describe('with fix callback', () => {
	test('fixing', () => {
		const fixersData = {};
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: {
					ruleMetadata: { foo: { fixable: true } },
					ruleSeverities: {},
					fixersData,
					config: {
						fix: true,
					},
				},
			},
			index: 0,
			endIndex: 1,
			node: { rangeBy: defaultRangeBy },
			fix: jest.fn(() => ({
				start: { line: 1, column: 1 },
				end: { line: 1, column: 2 },
			})),
		};

		report(v);
		expect(v.result.warn).toHaveBeenCalledTimes(0);
		expect(v.fix).toHaveBeenCalledTimes(1);

		const fixerData = fixersData.foo[0];
		const position = expect.objectContaining({
			line: expect.any(Number),
			column: expect.any(Number),
		});

		expect(fixerData.range).toMatchObject({
			start: position,
			end: position,
		});
		expect(fixerData.fixed).toBe(true);
	});

	test('not fixing', () => {
		const fixersData = {};
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: {
					ruleMetadata: { foo: { fixable: true } },
					ruleSeverities: {},
					fixersData,
					config: {
						fix: false,
					},
				},
			},
			message: 'bar',
			index: 0,
			endIndex: 1,
			node: { rangeBy: defaultRangeBy },
			fix: jest.fn(),
		};

		report(v);
		expect(v.result.warn).toHaveBeenCalledTimes(1);
		expect(v.fix).toHaveBeenCalledTimes(0);

		const fixerData = fixersData.foo[0];

		expect(fixerData.fixed).toBe(false);
		expect(fixerData.range).toBeUndefined();
	});

	test('failing due to non-fixable metadata', () => {
		const v = {
			ruleName: 'foo',
			result: {
				stylelint: {
					ruleMetadata: { foo: { fixable: false } },
					ruleSeverities: {},
					fixersData: {},
				},
			},
			node: {
				rangeBy: defaultRangeBy,
			},
			fix: () => {},
		};

		expect(() => report(v)).toThrow('The "foo" rule requires "fixable=true" metadata for autofix');
	});
});

test('with fix callback missing', () => {
	const fixersData = { foo: [{}] };
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				ruleSeverities: {},
				fixersData,
			},
		},
		index: 0,
		message: 'bar',
		node: { rangeBy: defaultRangeBy },
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(1);

	const fixerData = fixersData.foo[1];

	expect(fixerData.fixed).toBe(false);
	expect(fixerData.range).toBeUndefined();
});

test('with custom message', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				customMessages: { foo: 'A custom message: %s, %s, %d, %s' },
				ruleSeverities: {},
				fixersData: {},
			},
		},
		message: 'bar',
		messageArgs: ['str', true, 10, /regex/, 'should_be_ignored'],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('A custom message: str, true, 10, /regex/');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with custom message function', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: {
				customMessages: { foo: (a, b) => `a=${a}, b=${b}` },
				ruleSeverities: {},
				fixersData: {},
			},
		},
		message: 'bar',
		messageArgs: ['str', 123],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('a=str, b=123');
	expect(spyArgs[1].node).toBe(v.node);
});

test('without node nor line', () => {
	const v = {
		ruleName: 'foo',
		result: {
			stylelint: {
				ruleSeverities: {},
				fixersData: {},
			},
		},
	};

	expect(() => report(v)).toThrow(
		'The "foo" rule failed to pass either a node or a line number to the `report()` function.',
	);
});
