import { describe, it, mock, test } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import assertItemsPartialDeepStrictEqual from '../../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import report from '../report.mjs';

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

test('without disabledRanges', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
			stylelint: resultStylelint(),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'bar (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('with irrelevant general disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'bar (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('with relevant general disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test('with irrelevant rule-specific disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'bar (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('with relevant rule-specific disabledRange', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test('with relevant general disabledRange, among others', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test('with relevant rule-specific disabledRange, among others', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test('with relevant rule-specific disabledRange with range report', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test("with quiet mode on and rule severity of 'warning'", () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test("with quiet mode on and rule severity of 'error'", () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 1);
});

test('with custom rule severity', () => {
	const v = {
		ruleName: 'foo',
		severity: 'warning',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'bar (foo)');
	assert.equal(spyArgs[1].severity, 'warning');
	assert.equal(spyArgs[1].node, v.node);
});

test("with quiet mode on and custom rule severity of 'error'", () => {
	const v = {
		ruleName: 'foo',
		severity: 'error',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 1);
});

test("with quiet mode on and custom rule severity of 'warning'", () => {
	const v = {
		ruleName: 'foo',
		severity: 'warning',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test("with quiet mode on and with functional rule severity of 'error'", () => {
	const customSeverity = mock.fn(() => 'error');
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(customSeverity.mock.callCount(), 1);
	assert.equal(customSeverity.mock.calls[0].arguments[0], 'baz');
	assert.equal(v.result.warn.mock.callCount(), 1);
});

test("with quiet mode on and with functional rule severity of 'warning'", () => {
	const customSeverity = mock.fn(() => 'warning');
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(customSeverity.mock.callCount(), 1);
	assert.equal(customSeverity.mock.calls[0].arguments[0], 'baz');
	assert.equal(v.result.warn.mock.callCount(), 0);
});

test('with message function', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
			stylelint: resultStylelint(),
		},
		message: (a, b, c, d) => `a=${a}, b=${b}, c=${c}, d=${d}`,
		messageArgs: ['str', true, 10, /regex/],
		node: {
			rangeBy: defaultRangeBy,
		},
	};

	report(v);
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'a=str, b=true, c=10, d=/regex/ (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

describe('with fix callback', () => {
	test('fixing', () => {
		const fixersData = {};
		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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
			fix: mock.fn(),
		};

		report(v);
		assert.equal(v.result.warn.mock.callCount(), 0);
		assert.equal(v.fix.mock.callCount(), 1);
		assert.equal(fixersData.foo, 1);
	});

	test('not fixing', () => {
		const fixersData = {};
		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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
			fix: mock.fn(),
		};

		report(v);

		assert.equal(v.result.warn.mock.callCount(), 1);
		assert.equal(v.fix.mock.callCount(), 0);
		assert.equal(fixersData.foo, undefined);
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

		assert.throws(() => report(v), {
			message:
				'The "foo" rule requires "meta.fixable" to be truthy if the "fix" callback is being passed',
		});
	});
});

test('with fix callback missing', () => {
	const fixersData = {};
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	assert.equal(v.result.warn.mock.callCount(), 1);
	assert.equal(fixersData.foo, undefined);
});

describe('with fix object', () => {
	test('computing replaced text and range', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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
				apply: mock.fn(() => (node.selector = 'bar')),
				node,
			},
		};

		report(v);

		assert.equal(v.result.warn.mock.callCount(), 1);
		assert.equal(v.fix.apply.mock.callCount(), 1);

		const spyArgs1 = v.result.warn.mock.calls[0].arguments;

		assert.equal(spyArgs1[0], 'bar (foo)');
		assertItemsPartialDeepStrictEqual(spyArgs1[1].fix.range, [0, 3]);
		assert.equal(spyArgs1[1].fix.text, 'bar');

		// A second report for the same range should not produce a fix, only a warning
		v.message = 'qux';

		report(v);

		assert.equal(v.result.warn.mock.callCount(), 2);
		assert.equal(v.fix.apply.mock.callCount(), 1);

		const spyArgs2 = v.result.warn.mock.calls[1].arguments;

		assert.equal(spyArgs2[0], 'qux (foo)');
		assert.equal(spyArgs2[1].fix, undefined);
	});

	test('not computing replaced text and range', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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
				apply: mock.fn(() => (node.selector = 'bar')),
				node,
			},
		};

		report(v);

		assert.equal(v.result.warn.mock.callCount(), 1);
		assert.equal(v.fix.apply.mock.callCount(), 0);

		const spyArgs = v.result.warn.mock.calls[0].arguments;

		assert.equal(spyArgs[0], 'bar (foo)');
		assert.equal(spyArgs[1].fix, undefined);
	});

	test('with a constructed node', () => {
		const parentNode = postcss.parse('foo {}').first;
		const childNode = postcss.decl({ prop: 'color', value: 'red' });

		parentNode.append(childNode);

		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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
				apply: mock.fn(() => (childNode.value = 'green')),
				node: childNode,
			},
		};

		report(v);

		assert.equal(v.result.warn.mock.callCount(), 1);
		assert.equal(v.fix.apply.mock.callCount(), 0);

		const spyArgs = v.result.warn.mock.calls[0].arguments;

		assert.equal(spyArgs[0], 'bar (foo)');
		assert.equal(spyArgs[1].fix, undefined);
	});

	test('without apply function', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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

		assert.equal(v.result.warn.mock.callCount(), 1);

		const spyArgs = v.result.warn.mock.calls[0].arguments;

		assert.equal(spyArgs[0], 'bar (foo)');
		assert.equal(spyArgs[1].fix, undefined);
	});

	test('without node', () => {
		const node = postcss.parse('foo {}').first;

		const v = {
			ruleName: 'foo',
			result: {
				warn: mock.fn(),
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
				apply: mock.fn(() => (node.selector = 'bar')),
			},
		};

		report(v);

		assert.equal(v.result.warn.mock.callCount(), 1);

		const spyArgs = v.result.warn.mock.calls[0].arguments;

		assert.equal(spyArgs[0], 'bar (foo)');
		assert.equal(spyArgs[1].fix, undefined);
	});
});

test('with custom message', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'A custom message: str, true, 10, /regex/ (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('with custom message (missing rule name)', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'A custom message with appended rule name (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('with custom message (appended rule name)', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'A custom message with appended rule name (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('with custom message function', () => {
	const v = {
		ruleName: 'foo',
		result: {
			warn: mock.fn(),
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
	const spyArgs = v.result.warn.mock.calls[0].arguments;

	assert.equal(spyArgs[0], 'a=str, b=123 (foo)');
	assert.equal(spyArgs[1].node, v.node);
});

test('without node', () => {
	const v = {
		ruleName: 'foo',
		result: {
			stylelint: resultStylelint(),
		},
	};

	assert.throws(() => report(v), {
		message:
			'The "foo" rule provided incorrect position arguments to `utils.report()`. To fix, pass a PostCSS `node` to the function.',
	});
});

test('with index without endIndex', () => {
	const v = {
		ruleName: 'foo',
		result: {
			stylelint: resultStylelint(),
		},
		message: 'bar',
		node: {
			rangeBy: defaultRangeBy,
		},
		index: 0,
	};

	assert.throws(() => report(v), {
		message:
			'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `index` and `endIndex` as numbers to the function.',
	});
});

describe('with endIndex without index', () => {
	it('has an endIndex of `0`', () => {
		const v = {
			ruleName: 'foo',
			result: {
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			endIndex: 0,
		};

		assert.throws(() => report(v), {
			message:
				'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `index` and `endIndex` as numbers to the function.',
		});
	});

	it('has a non-zero endIndex', () => {
		const v = {
			ruleName: 'foo',
			result: {
				stylelint: resultStylelint(),
			},
			message: 'bar',
			node: {
				rangeBy: defaultRangeBy,
			},
			endIndex: 1,
		};

		assert.throws(() => report(v), {
			message:
				'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `index` and `endIndex` as numbers to the function.',
		});
	});
});

describe('with incorrect start or end', () => {
	it('has no start', () => {
		const v = {
			ruleName: 'foo',
			result: {
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

		assert.throws(() => report(v), {
			message:
				'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `start` and `end` as valid positions to the function.',
		});
	});

	it('has an invalid start', () => {
		const v = {
			ruleName: 'foo',
			result: {
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

		assert.throws(() => report(v), {
			message:
				'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `start` and `end` as valid positions to the function.',
		});
	});

	it('has no end', () => {
		const v = {
			ruleName: 'foo',
			result: {
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

		assert.throws(() => report(v), {
			message:
				'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `start` and `end` as valid positions to the function.',
		});
	});

	it('has an invalid end', () => {
		const v = {
			ruleName: 'foo',
			result: {
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

		assert.throws(() => report(v), {
			message:
				'The "foo" rule provided incomplete position arguments to `utils.report()`. To fix, provide both `start` and `end` as valid positions to the function.',
		});
	});
});
