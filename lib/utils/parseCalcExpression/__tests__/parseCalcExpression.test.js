'use strict';

const parse = require('..');

it('parseCalcExpression parse to ast', () => {
	expect(parse('calc(100% - 80px)')).toEqual({
		left: {
			source: { end: { index: 9 }, start: { index: 5 } },
			type: 'PercentageValue',
			unit: '%',
			value: 100,
		},
		operator: '-',
		right: {
			source: { end: { index: 16 }, start: { index: 12 } },
			type: 'LengthValue',
			unit: 'px',
			value: 80,
		},
		source: {
			end: { index: 17 },
			operator: { end: { index: 11 }, start: { index: 10 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(100% - 80px / 2)')).toEqual({
		left: {
			source: { end: { index: 9 }, start: { index: 5 } },
			type: 'PercentageValue',
			unit: '%',
			value: 100,
		},
		operator: '-',
		right: {
			left: {
				source: { end: { index: 16 }, start: { index: 12 } },
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			operator: '/',
			right: {
				source: { end: { index: 20 }, start: { index: 19 } },
				type: 'Value',
				value: 2,
			},
			source: {
				end: { index: 20 },
				operator: { end: { index: 18 }, start: { index: 17 } },
				start: { index: 12 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 21 },
			operator: { end: { index: 11 }, start: { index: 10 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});

	expect(parse('calc(80px)')).toEqual({
		source: { end: { index: 10 }, start: { index: 0 } },
		type: 'LengthValue',
		unit: 'px',
		value: 80,
	});
	expect(parse('calc(-100 * -80px)')).toEqual({
		left: {
			source: { end: { index: 9 }, start: { index: 5 } },
			type: 'Value',
			sign: '-',
			value: -100,
		},
		operator: '*',
		right: {
			source: { end: { index: 17 }, start: { index: 12 } },
			type: 'LengthValue',
			unit: 'px',
			sign: '-',
			value: -80,
		},
		source: {
			end: { index: 18 },
			operator: { end: { index: 11 }, start: { index: 10 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(-100px * -2)')).toEqual({
		left: {
			source: { end: { index: 11 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			sign: '-',
			value: -100,
		},
		operator: '*',
		right: {
			source: { end: { index: 16 }, start: { index: 14 } },
			type: 'Value',
			sign: '-',
			value: -2,
		},
		source: {
			end: { index: 17 },
			operator: { end: { index: 13 }, start: { index: 12 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(+100 * +80px)')).toEqual({
		left: {
			source: { end: { index: 9 }, start: { index: 5 } },
			type: 'Value',
			sign: '+',
			value: 100,
		},
		operator: '*',
		right: {
			source: { end: { index: 17 }, start: { index: 12 } },
			type: 'LengthValue',
			unit: 'px',
			sign: '+',
			value: 80,
		},
		source: {
			end: { index: 18 },
			operator: { end: { index: 11 }, start: { index: 10 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(+100px * +2)')).toEqual({
		left: {
			source: { end: { index: 11 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			sign: '+',
			value: 100,
		},
		operator: '*',
		right: {
			source: { end: { index: 16 }, start: { index: 14 } },
			type: 'Value',
			sign: '+',
			value: 2,
		},
		source: {
			end: { index: 17 },
			operator: { end: { index: 13 }, start: { index: 12 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
});

it('parseCalcExpression case insensitive', () => {
	expect(parse('CALC(100% - 80PX + VAR(--FOO))')).toEqual({
		left: {
			left: {
				source: { end: { index: 9 }, start: { index: 5 } },
				type: 'PercentageValue',
				unit: '%',
				value: 100,
			},
			operator: '-',
			right: {
				source: { end: { index: 16 }, start: { index: 12 } },
				type: 'LengthValue',
				unit: 'PX',
				value: 80,
			},
			source: {
				end: { index: 16 },
				operator: { end: { index: 11 }, start: { index: 10 } },
				start: { index: 5 },
			},
			type: 'MathExpression',
		},
		operator: '+',
		right: {
			source: { end: { index: 29 }, start: { index: 19 } },
			type: 'Function',
			value: 'VAR(--FOO)',
		},
		source: {
			end: { index: 30 },
			operator: { end: { index: 18 }, start: { index: 17 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
});

it('parseCalcExpression parse to ast (no spaces)', () => {
	expect(parse('calc(80px/2)')).toEqual({
		left: {
			source: { end: { index: 9 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			value: 80,
		},
		operator: '/',
		right: {
			source: { end: { index: 11 }, start: { index: 10 } },
			type: 'Value',
			value: 2,
		},
		source: {
			end: { index: 12 },
			operator: { end: { index: 10 }, start: { index: 9 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});

	expect(parse('calc(80px*2)')).toEqual({
		left: {
			source: { end: { index: 9 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			value: 80,
		},
		operator: '*',
		right: {
			source: { end: { index: 11 }, start: { index: 10 } },
			type: 'Value',
			value: 2,
		},
		source: {
			end: { index: 12 },
			operator: { end: { index: 10 }, start: { index: 9 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
});

it('parseCalcExpression precedence', () => {
	expect(parse('calc(100% + 80px - 70px)')).toMatchObject({
		left: {
			left: {
				type: 'PercentageValue',
				unit: '%',
				value: 100,
			},
			operator: '+',
			right: {
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			type: 'MathExpression',
		},
		operator: '-',
		right: {
			type: 'LengthValue',
			unit: 'px',
			value: 70,
		},
		type: 'MathExpression',
	});
	expect(parse('calc(100% + 80px * 2)')).toMatchObject({
		left: {
			type: 'PercentageValue',
			unit: '%',
			value: 100,
		},
		operator: '+',
		right: {
			left: {
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			operator: '*',
			right: {
				type: 'Value',
				value: 2,
			},
			type: 'MathExpression',
		},
		type: 'MathExpression',
	});
	expect(parse('calc(100% + 80px * 2 / 4)')).toMatchObject({
		left: {
			type: 'PercentageValue',
			unit: '%',
			value: 100,
		},
		operator: '+',
		right: {
			left: {
				left: {
					type: 'LengthValue',
					unit: 'px',
					value: 80,
				},
				operator: '*',
				right: {
					type: 'Value',
					value: 2,
				},
				type: 'MathExpression',
			},
			operator: '/',
			right: {
				type: 'Value',
				value: 4,
			},
			type: 'MathExpression',
		},
		type: 'MathExpression',
	});

	expect(parse('calc(100% + (80px - 70px))')).toMatchObject({
		left: {
			type: 'PercentageValue',
			unit: '%',
			value: 100,
		},
		operator: '+',
		right: {
			left: {
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			operator: '-',
			right: {
				type: 'LengthValue',
				unit: 'px',
				value: 70,
			},
			type: 'MathExpression',
		},
		type: 'MathExpression',
	});
	expect(parse('calc((100% + 80px) * 2)')).toMatchObject({
		left: {
			left: {
				type: 'PercentageValue',
				unit: '%',
				value: 100,
			},
			operator: '+',
			right: {
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			type: 'MathExpression',
		},
		operator: '*',
		right: {
			type: 'Value',
			value: 2,
		},
		type: 'MathExpression',
	});
});
it('parseCalcExpression type length', () => {
	// Relative length units
	expect(parse('80em').type).toBe('LengthValue');
	expect(parse('80ex').type).toBe('LengthValue');
	expect(parse('80ch').type).toBe('LengthValue');
	expect(parse('80rem').type).toBe('LengthValue');
	// Viewport-percentage lengths
	expect(parse('80vh').type).toBe('LengthValue');
	expect(parse('80vw').type).toBe('LengthValue');
	expect(parse('80vmin').type).toBe('LengthValue');
	expect(parse('80vmax').type).toBe('LengthValue');
	expect(parse('80vm').type).toBe('LengthValue');
	// Absolute length units
	expect(parse('80px').type).toBe('LengthValue');
	expect(parse('80mm').type).toBe('LengthValue');
	expect(parse('80cm').type).toBe('LengthValue');
	expect(parse('80in').type).toBe('LengthValue');
	expect(parse('80pt').type).toBe('LengthValue');
	expect(parse('80pc').type).toBe('LengthValue');
	expect(parse('80q').type).toBe('LengthValue');
	// Flexible length units
	expect(parse('80fr').type).toBe('LengthValue');

	// Relative length units
	expect(parse('80EM').type).toBe('LengthValue');
	expect(parse('80EX').type).toBe('LengthValue');
	expect(parse('80CH').type).toBe('LengthValue');
	expect(parse('80REM').type).toBe('LengthValue');
	// Viewport-percentage lengths
	expect(parse('80VH').type).toBe('LengthValue');
	expect(parse('80VW').type).toBe('LengthValue');
	expect(parse('80VMIN').type).toBe('LengthValue');
	expect(parse('80VMAX').type).toBe('LengthValue');
	expect(parse('80VM').type).toBe('LengthValue');
	// Absolute length units
	expect(parse('80PX').type).toBe('LengthValue');
	expect(parse('80MM').type).toBe('LengthValue');
	expect(parse('80CM').type).toBe('LengthValue');
	expect(parse('80IN').type).toBe('LengthValue');
	expect(parse('80PT').type).toBe('LengthValue');
	expect(parse('80PC').type).toBe('LengthValue');
	expect(parse('80Q').type).toBe('LengthValue');
	// Flexible length units
	expect(parse('80FR').type).toBe('LengthValue');
});
it('parseCalcExpression type angle', () => {
	expect(parse('80deg').type).toBe('AngleValue');
	expect(parse('80grad').type).toBe('AngleValue');
	expect(parse('80turn').type).toBe('AngleValue');
	expect(parse('80rad').type).toBe('AngleValue');

	expect(parse('80DEG').type).toBe('AngleValue');
	expect(parse('80GRAD').type).toBe('AngleValue');
	expect(parse('80TURN').type).toBe('AngleValue');
	expect(parse('80RAD').type).toBe('AngleValue');
});
it('parseCalcExpression type time', () => {
	expect(parse('80s').type).toBe('TimeValue');
	expect(parse('80ms').type).toBe('TimeValue');

	expect(parse('80S').type).toBe('TimeValue');
	expect(parse('80MS').type).toBe('TimeValue');
});
it('parseCalcExpression type frequency', () => {
	expect(parse('80Hz').type).toBe('FrequencyValue');
	expect(parse('80kHz').type).toBe('FrequencyValue');

	expect(parse('80hz').type).toBe('FrequencyValue');
	expect(parse('80khz').type).toBe('FrequencyValue');

	expect(parse('80HZ').type).toBe('FrequencyValue');
	expect(parse('80KHZ').type).toBe('FrequencyValue');
});
it('parseCalcExpression type resolution', () => {
	expect(parse('80dpi').type).toBe('ResolutionValue');
	expect(parse('80dpcm').type).toBe('ResolutionValue');
	expect(parse('80dppx').type).toBe('ResolutionValue');

	expect(parse('80DPI').type).toBe('ResolutionValue');
	expect(parse('80DPCM').type).toBe('ResolutionValue');
	expect(parse('80DPPX').type).toBe('ResolutionValue');
});
it('parseCalcExpression type percentage', () => {
	expect(parse('80%').type).toBe('PercentageValue');
});
it('parseCalcExpression type unknown', () => {
	expect(parse('80un').type).toBe('UnknownValue');
});
it('parseCalcExpression type function', () => {
	expect(parse('var(--bar)').type).toBe('Function');

	expect(parse('var(--BAR)').type).toBe('Function');

	expect(parse('VAR(--bar)').type).toBe('Function');
});
it('parseCalcExpression type value', () => {
	expect(parse('80').type).toBe('Value');
});

it('parseCalcExpression scss', () => {
	expect(parse('calc(100% - #{$foo} + #{$bar} * #{$baz})')).toEqual({
		left: {
			left: {
				source: { end: { index: 9 }, start: { index: 5 } },
				type: 'PercentageValue',
				unit: '%',
				value: 100,
			},
			operator: '-',
			right: {
				source: { end: { index: 19 }, start: { index: 12 } },
				type: 'UnknownValue',
				unit: '',
				value: '#{$foo}',
			},
			source: {
				end: { index: 19 },
				operator: { end: { index: 11 }, start: { index: 10 } },
				start: { index: 5 },
			},
			type: 'MathExpression',
		},
		operator: '+',
		right: {
			left: {
				source: { end: { index: 29 }, start: { index: 22 } },
				type: 'UnknownValue',
				unit: '',
				value: '#{$bar}',
			},
			operator: '*',
			right: {
				source: { end: { index: 39 }, start: { index: 32 } },
				type: 'UnknownValue',
				unit: '',
				value: '#{$baz}',
			},
			source: {
				end: { index: 39 },
				operator: { end: { index: 31 }, start: { index: 30 } },
				start: { index: 22 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 40 },
			operator: { end: { index: 21 }, start: { index: 20 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(100% - $foo + $bar * baz())')).toEqual({
		left: {
			left: {
				source: { end: { index: 9 }, start: { index: 5 } },
				type: 'PercentageValue',
				unit: '%',
				value: 100,
			},
			operator: '-',
			right: {
				source: { end: { index: 16 }, start: { index: 12 } },
				type: 'UnknownValue',
				unit: '',
				value: '$foo',
			},
			source: {
				end: { index: 16 },
				operator: { end: { index: 11 }, start: { index: 10 } },
				start: { index: 5 },
			},
			type: 'MathExpression',
		},
		operator: '+',
		right: {
			left: {
				source: { end: { index: 23 }, start: { index: 19 } },
				type: 'UnknownValue',
				unit: '',
				value: '$bar',
			},
			operator: '*',
			right: {
				source: { end: { index: 31 }, start: { index: 26 } },
				type: 'Function',
				value: 'baz()',
			},
			source: {
				end: { index: 31 },
				operator: { end: { index: 25 }, start: { index: 24 } },
				start: { index: 19 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 32 },
			operator: { end: { index: 18 }, start: { index: 17 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(foo($bar, $baz))')).toEqual({
		source: { end: { index: 21 }, start: { index: 0 } },
		type: 'Function',
		value: 'foo($bar, $baz)',
	});
});

it('parseCalcExpression less', () => {
	expect(parse('calc(100% - @foo + @bar[key] * baz())')).toEqual({
		left: {
			left: {
				source: { end: { index: 9 }, start: { index: 5 } },
				type: 'PercentageValue',
				unit: '%',
				value: 100,
			},
			operator: '-',
			right: {
				source: { end: { index: 16 }, start: { index: 12 } },
				type: 'UnknownValue',
				unit: '',
				value: '@foo',
			},
			source: {
				end: { index: 16 },
				operator: { end: { index: 11 }, start: { index: 10 } },
				start: { index: 5 },
			},
			type: 'MathExpression',
		},
		operator: '+',
		right: {
			left: {
				source: { end: { index: 28 }, start: { index: 19 } },
				type: 'UnknownValue',
				unit: '',
				value: '@bar[key]',
			},
			operator: '*',
			right: {
				source: { end: { index: 36 }, start: { index: 31 } },
				type: 'Function',
				value: 'baz()',
			},
			source: {
				end: { index: 36 },
				operator: { end: { index: 30 }, start: { index: 29 } },
				start: { index: 19 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 37 },
			operator: { end: { index: 18 }, start: { index: 17 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(foo(@bar, @baz))')).toEqual({
		source: { end: { index: 21 }, start: { index: 0 } },
		type: 'Function',
		value: 'foo(@bar, @baz)',
	});
});

it('parseCalcExpression nested calc', () => {
	expect(parse('calc(100px - calc(80px * 2))')).toEqual({
		left: {
			source: { end: { index: 10 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			value: 100,
		},
		operator: '-',
		right: {
			left: {
				source: { end: { index: 22 }, start: { index: 18 } },
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			operator: '*',
			right: {
				source: { end: { index: 26 }, start: { index: 25 } },
				type: 'Value',
				value: 2,
			},
			source: {
				end: { index: 27 },
				operator: { end: { index: 24 }, start: { index: 23 } },
				start: { index: 13 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 28 },
			operator: { end: { index: 12 }, start: { index: 11 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(100px - (80px + calc(80px * 2)))')).toEqual({
		left: {
			source: { end: { index: 10 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			value: 100,
		},
		operator: '-',
		right: {
			left: {
				source: { end: { index: 18 }, start: { index: 14 } },
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			operator: '+',
			right: {
				left: {
					source: { end: { index: 30 }, start: { index: 26 } },
					type: 'LengthValue',
					unit: 'px',
					value: 80,
				},
				operator: '*',
				right: {
					source: { end: { index: 34 }, start: { index: 33 } },
					type: 'Value',
					value: 2,
				},
				source: {
					end: { index: 35 },
					operator: { end: { index: 32 }, start: { index: 31 } },
					start: { index: 21 },
				},
				type: 'MathExpression',
			},
			source: {
				end: { index: 36 },
				operator: { end: { index: 20 }, start: { index: 19 } },
				start: { index: 13 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 37 },
			operator: { end: { index: 12 }, start: { index: 11 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
	expect(parse('calc(100px - (80px + fn(calc(80px * 2))))')).toEqual({
		left: {
			source: { end: { index: 10 }, start: { index: 5 } },
			type: 'LengthValue',
			unit: 'px',
			value: 100,
		},
		operator: '-',
		right: {
			left: {
				source: { end: { index: 18 }, start: { index: 14 } },
				type: 'LengthValue',
				unit: 'px',
				value: 80,
			},
			operator: '+',
			right: {
				source: { end: { index: 39 }, start: { index: 21 } },
				type: 'Function',
				value: 'fn(calc(80px * 2))',
			},
			source: {
				end: { index: 40 },
				operator: { end: { index: 20 }, start: { index: 19 } },
				start: { index: 13 },
			},
			type: 'MathExpression',
		},
		source: {
			end: { index: 41 },
			operator: { end: { index: 12 }, start: { index: 11 } },
			start: { index: 0 },
		},
		type: 'MathExpression',
	});
});

it('parseCalcExpression syntax error', () => {
	expect(() => parse('calc()')).toThrow();

	// expect(() => parse("calc(100% -80px)")).toThrow();
	expect(() => parse('calc(100% 80px)')).toThrow();
	expect(() => parse('calc(100% 80px 20px)')).toThrow();
	expect(() => parse('calc(- 100%)')).toThrow();
	expect(() => parse('calc(100% -)')).toThrow();
	expect(() => parse('calc(100% - - 80px)')).toThrow();
	expect(() => parse('calc(100% - -)')).toThrow();
	expect(() => parse('calc(- - -)')).toThrow();
	expect(() => parse('calc(- 100% 80px)')).toThrow();

	expect(() => parse('calc(100% - () - 80px)')).toThrow();

	expect(() => parse('calc(100% - - -#{$foo})')).toThrow();
	expect(() => parse('calc(100% - - -@foo)')).toThrow();
	expect(() => parse('calc(100% - -foo())')).toThrow();
	expect(() => parse('calc(100% - -foo(bar, baz))')).toThrow();
	expect(() => parse('calc(--100)')).toThrow();
	expect(() => parse('calc(++100)')).toThrow();
	expect(() => parse('calc(+-100)')).toThrow();
	expect(() => parse('calc(-+100)')).toThrow();
	expect(() => parse('calc(+var(foo))')).toThrow();
});
