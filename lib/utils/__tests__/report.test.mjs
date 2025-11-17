import postcss from 'postcss';
import process from 'node:process';

import report from '../report.mjs';

import { jest } from '@jest/globals';

const defaultRangeBy = () => ({ start: { line: 2, column: 1 }, end: { line: 2, column: 2 } });

const resultStylelint = (props) => ({
	ruleSeverities: {},
	ruleMetadata: {},
	customMessages: {},
	customUrls: {},
	disabledRanges: {},
	fixersData: {},
	rangesOfComputedEditInfos: [],
	...props,
});

let emitWarning;

beforeEach(() => {
	emitWarning = import.meta.jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
});

afterEach(() => {
	emitWarning.mockRestore();
});

test('without disabledRanges', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint(),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with irrelevant general disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				disabledRanges: {
					all: [{ start: 5, end: 8 }],
				},
			}),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with relevant general disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				disabledRanges: {
					all: [{ start: 5, end: 8 }],
				},
			}),
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
			stylelint: resultStylelint({
				disabledRanges: {
					all: [],
					bar: [{ start: 5, end: 8 }],
				},
			}),
		},
		message: 'bar',
		node: {
			rangeBy: () => ({ start: { line: 6, column: 1 }, end: { line: 6, column: 2 } }),
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with relevant rule-specific disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				disabledRanges: {
					all: [],
					foo: [{ start: 5, end: 8 }],
				},
			}),
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
			stylelint: resultStylelint({
				disabledRanges: {
					all: [
						{ start: 1, end: 3 },
						{ start: 5, end: 8 },
					],
				},
			}),
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
			stylelint: resultStylelint({
				disabledRanges: {
					all: [],
					foo: [
						{ start: 1, end: 3, rules: ['foo'] },
						{ start: 5, end: 8, rules: ['foo'] },
					],
				},
			}),
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
			stylelint: resultStylelint({
				disabledRanges: {
					all: [],
					foo: [{ start: 2, end: 2 }],
				},
			}),
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
			stylelint: resultStylelint({
				quiet: true,
				ruleSeverities: {
					foo: 'warning',
				},
			}),
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
			stylelint: resultStylelint({
				quiet: true,
				ruleSeverities: {
					foo: 'error',
				},
			}),
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
			stylelint: resultStylelint({
				ruleSeverities: {
					foo: 'error',
				},
			}),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('bar (foo)');
	expect(spyArgs[1].severity).toBe('warning');
	expect(spyArgs[1].node).toBe(v.node);
});

test("with quiet mode on and custom rule severity of 'error'", () => {
	const v = {
		ruleName: 'foo',
		severity: 'error',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				quiet: true,
				ruleSeverities: {
					foo: 'warning',
				},
			}),
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
			stylelint: resultStylelint({
				quiet: true,
				ruleSeverities: {
					foo: 'error',
				},
			}),
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
			stylelint: resultStylelint({
				quiet: true,
				ruleSeverities: {
					foo: customSeverity,
				},
			}),
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
			stylelint: resultStylelint({
				quiet: true,
				ruleSeverities: {
					foo: customSeverity,
				},
			}),
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
			stylelint: resultStylelint(),
		},
		message: (a, b, c, d) => `a=${a}, b=${b}, c=${c}, d=${d}`,
		messageArgs: ['str', true, 10, /regex/],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('a=str, b=true, c=10, d=/regex/ (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

describe('with fix callback', () => {
	test('fixing', () => {
		const fixersData = {};
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData,
					config: {
						fix: true,
					},
				}),
			},
			index: 0,
			endIndex: 1,
			node: { rangeBy: defaultRangeBy },
			fix: jest.fn(),
		};

		report(v);
		expect(v.result.warn).toHaveBeenCalledTimes(0);
		expect(v.fix).toHaveBeenCalledTimes(1);
		expect(fixersData.foo).toBe(1);
	});

	test('not fixing', () => {
		const fixersData = {};
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData,
					config: {
						fix: false,
					},
				}),
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
		expect(fixersData.foo).toBeUndefined();
	});

	test('failing due to non-fixable metadata', () => {
		const v = {
			ruleName: 'foo',
			result: {
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: false } },
				}),
			},
			node: {
				rangeBy: defaultRangeBy,
			},
			fix: () => {},
		};

		expect(() => report(v)).toThrow(
			'The "foo" rule requires "meta.fixable" to be truthy if the "fix" callback is being passed',
		);
	});
});

test('with fix callback missing', () => {
	const fixersData = {};
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				fixersData,
			}),
		},
		index: 0,
		endIndex: 1,
		message: 'bar',
		node: { rangeBy: defaultRangeBy },
	};

	report(v);
	expect(v.result.warn).toHaveBeenCalledTimes(1);
	expect(fixersData.foo).toBeUndefined();
});

describe('with fix object', () => {
	test('computing replaced text and range', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData: {},
					config: {
						computeEditInfo: true,
					},
				}),
			},
			message: 'bar',
			index: 0,
			endIndex: 1,
			node,
			fix: {
				apply: jest.fn(() => (node.selector = 'bar')),
				node,
			},
		};

		report(v);

		expect(v.result.warn).toHaveBeenCalledTimes(1);
		expect(v.fix.apply).toHaveBeenCalledTimes(1);

		const spyArgs1 = v.result.warn.mock.calls[0];

		expect(spyArgs1[0]).toBe('bar (foo)');
		expect(spyArgs1[1].fix.range).toMatchObject([0, 3]);
		expect(spyArgs1[1].fix.text).toBe('bar');

		// A second report for the same range should not produce a fix, only a warning
		v.message = 'qux';

		report(v);

		expect(v.result.warn).toHaveBeenCalledTimes(2);
		expect(v.fix.apply).toHaveBeenCalledTimes(1);

		const spyArgs2 = v.result.warn.mock.calls[1];

		expect(spyArgs2[0]).toBe('qux (foo)');
		expect(spyArgs2[1].fix).toBeUndefined();
	});

	test('not computing replaced text and range', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData: {},
					config: {
						computeEditInfo: false,
					},
				}),
			},
			message: 'bar',
			index: 0,
			endIndex: 1,
			node,
			fix: {
				apply: jest.fn(() => (node.selector = 'bar')),
				node,
			},
		};

		report(v);

		expect(v.result.warn).toHaveBeenCalledTimes(1);
		expect(v.fix.apply).toHaveBeenCalledTimes(0);

		const spyArgs = v.result.warn.mock.calls[0];

		expect(spyArgs[0]).toBe('bar (foo)');
		expect(spyArgs[1].fix).toBeUndefined();
	});

	test('with a constructed node', () => {
		const parentNode = postcss.parse('foo {}').first;
		const childNode = postcss.decl({ prop: 'color', value: 'red' });

		parentNode.append(childNode);

		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData: {},
					config: {
						computeEditInfo: true,
					},
				}),
			},
			message: 'bar',
			index: 0,
			endIndex: 1,
			node: parentNode,
			fix: {
				apply: jest.fn(() => (childNode.value = 'green')),
				node: childNode,
			},
		};

		report(v);

		expect(v.result.warn).toHaveBeenCalledTimes(1);
		expect(v.fix.apply).toHaveBeenCalledTimes(0);

		const spyArgs = v.result.warn.mock.calls[0];

		expect(spyArgs[0]).toBe('bar (foo)');
		expect(spyArgs[1].fix).toBeUndefined();
	});

	test('without apply function', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData: {},
					config: {
						computeEditInfo: true,
					},
				}),
			},
			message: 'bar',
			index: 0,
			endIndex: 1,
			node,
			fix: {
				node,
			},
		};

		report(v);

		expect(v.result.warn).toHaveBeenCalledTimes(1);

		const spyArgs = v.result.warn.mock.calls[0];

		expect(spyArgs[0]).toBe('bar (foo)');
		expect(spyArgs[1].fix).toBeUndefined();
	});

	test('without node', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint({
					ruleMetadata: { foo: { fixable: true } },
					fixersData: {},
					config: {
						computeEditInfo: true,
					},
				}),
			},
			message: 'bar',
			index: 0,
			endIndex: 1,
			node,
			fix: {
				apply: jest.fn(() => (node.selector = 'bar')),
			},
		};

		report(v);

		expect(v.result.warn).toHaveBeenCalledTimes(1);

		const spyArgs = v.result.warn.mock.calls[0];

		expect(spyArgs[0]).toBe('bar (foo)');
		expect(spyArgs[1].fix).toBeUndefined();
	});
});

test('with custom message', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				customMessages: { foo: 'A custom message: %s, %s, %d, %s' },
			}),
		},
		message: 'bar',
		messageArgs: ['str', true, 10, /regex/, 'should_be_ignored'],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('A custom message: str, true, 10, /regex/ (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with custom message (missing rule name)', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				customMessages: { foo: 'A custom message with appended rule name' },
			}),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('A custom message with appended rule name (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with custom message (appended rule name)', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				customMessages: { foo: 'A custom message with appended rule name (foo)' },
			}),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('A custom message with appended rule name (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('with custom message function', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({
				customMessages: { foo: (a, b) => `a=${a}, b=${b}` },
			}),
		},
		message: 'bar',
		messageArgs: ['str', 123],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0];

	expect(spyArgs[0]).toBe('a=str, b=123 (foo)');
	expect(spyArgs[1].node).toBe(v.node);
});

test('without node nor line', () => {
	const v = {
		ruleName: 'foo',
		result: {
			stylelint: resultStylelint(),
		},
	};

	expect(() => report(v)).toThrow(
		'The "foo" rule failed to pass either a node or a line number to the `report()` function.',
	);
});

test('without node', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint(),
		},
		message: 'bar',
	};

	try {
		report(v);
	} catch {
		// noop
	}

	expect(emitWarning).toHaveBeenCalledWith(
		expect.stringMatching(
			/Omitting the `node` argument in the `utils.report\(\)` function is deprecated \("foo"\)\./,
		),
		expect.objectContaining({
			code: 'stylelint:007',
			detail: 'Please pass a `node` argument in the `utils.report()` function of "foo".',
			type: 'DeprecationWarning',
		}),
	);
});

test('with quietDeprecationWarnings mode on and without node', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint({ quietDeprecationWarnings: true }),
		},
		message: 'bar',
	};

	try {
		report(v);
	} catch {
		// noop
	}

	expect(emitWarning).toHaveBeenCalledTimes(0);
});

test('with line', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint(),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
		line: 1,
	};

	report(v);

	expect(emitWarning).toHaveBeenCalledWith(
		expect.stringMatching(
			/Providing the `line` argument in the `utils.report\(\)` function is deprecated \("foo"\)\./,
		),
		expect.objectContaining({
			code: 'stylelint:007',
			detail:
				'Please pass both `index` and `endIndex` as arguments in the `utils.report()` function of "foo" instead.',
			type: 'DeprecationWarning',
		}),
	);
});

test('with index without endIndex', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: jest.fn(),
			stylelint: resultStylelint(),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
		index: 0,
	};

	report(v);

	expect(emitWarning).toHaveBeenCalledWith(
		expect.stringMatching(
			/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
		),
		expect.objectContaining({
			code: 'stylelint:007',
			detail:
				'Please pass both `index` and `endIndex` as arguments in the `utils.report()` function of "foo".',
			type: 'DeprecationWarning',
		}),
	);
});

describe('with endIndex without index', () => {
	it('has an endIndex of `0`', () => {
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			endIndex: 0,
		};

		report(v);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(
				/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
			),
			expect.objectContaining({
				code: 'stylelint:007',
				detail:
					'Please pass both `index` and `endIndex` as arguments in the `utils.report()` function of "foo".',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('has a non-zero endIndex', () => {
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			endIndex: 1,
		};

		report(v);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(
				/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
			),
			expect.objectContaining({
				code: 'stylelint:007',
				detail:
					'Please pass both `index` and `endIndex` as arguments in the `utils.report()` function of "foo".',
				type: 'DeprecationWarning',
			}),
		);
	});
});

describe('with incorrect start or end', () => {
	it('has no start', () => {
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			end: {
				line: 1,
				column: 2,
			},
		};

		report(v);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(
				/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
			),
			expect.objectContaining({
				code: 'stylelint:007',
				detail:
					'Please pass both a valid `start` and `end` argument in the `utils.report()` function of "foo".',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('has an invalid start', () => {
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			start: {
				line: 1,
			},
			end: {
				line: 1,
				column: 2,
			},
		};

		report(v);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(
				/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
			),
			expect.objectContaining({
				code: 'stylelint:007',
				detail:
					'Please pass both a valid `start` and `end` argument in the `utils.report()` function of "foo".',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('has no end', () => {
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			start: {
				line: 1,
				column: 1,
			},
		};

		report(v);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(
				/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
			),
			expect.objectContaining({
				code: 'stylelint:007',
				detail:
					'Please pass both a valid `start` and `end` argument in the `utils.report()` function of "foo".',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('has an invalid end', () => {
		const v = {
			ruleName: 'foo',
			result: {
				warn: jest.fn(),
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			start: {
				line: 1,
				column: 1,
			},
			end: {
				offset: 2,
			},
		};

		report(v);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(
				/Partial position information in the `utils.report\(\)` function is deprecated \("foo"\)\./,
			),
			expect.objectContaining({
				code: 'stylelint:007',
				detail:
					'Please pass both a valid `start` and `end` argument in the `utils.report()` function of "foo".',
				type: 'DeprecationWarning',
			}),
		);
	});
});
