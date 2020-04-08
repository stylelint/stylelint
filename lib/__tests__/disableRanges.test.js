'use strict';

const assignDisabledRanges = require('../assignDisabledRanges');
const less = require('postcss-less');
const postcss = require('postcss');
const scss = require('postcss-scss');

it('no disabling', () => {
	return testDisableRanges('a {}').then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({ all: [] });
	});
});

it('disable without re-enabling', () => {
	return testDisableRanges('/* stylelint-disable */\na {}').then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [
				{
					start: 1,
					strictStart: true,
				},
			],
		});
	});
});

it('disable and re-enable', () => {
	return testDisableRanges(`a {}
    /* stylelint-disable */
    b {}
    /* stylelint-enable */
    .foo {}`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [
				{
					start: 2,
					end: 4,
					strictStart: true,
					strictEnd: true,
				},
			],
		});
	});
});

it('disable and re-enable twice', () => {
	return testDisableRanges(`a {}
    /* stylelint-disable */
    b {}
    /* stylelint-enable */
    .foo {}
    /* stylelint-disable */
    b {}
    /* stylelint-enable */
    .foo {}`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [
				{
					start: 2,
					end: 4,
					strictStart: true,
					strictEnd: true,
				},
				{
					start: 6,
					end: 8,
					strictStart: true,
					strictEnd: true,
				},
			],
		});
	});
});

it('disable rule without re-enabling', () => {
	return testDisableRanges('/* stylelint-disable foo-bar */\na {}')
		.then((result) => {
			expect(result.stylelint.disabledRanges).toEqual({
				all: [],
				'foo-bar': [
					{
						start: 1,
						strictStart: true,
						end: undefined,
						strictEnd: undefined,
					},
				],
			});
		})
		.then(() => {
			return testDisableRanges(
				'/* stylelint-disable selector-combinator-space-before */\n' + 'a {}',
			).then((result) => {
				expect(result.stylelint.disabledRanges).toEqual({
					all: [],
					'selector-combinator-space-before': [
						{
							start: 1,
							strictStart: true,
							end: undefined,
							strictEnd: undefined,
						},
					],
				});
			});
		});
});

it('mixed disabling of specific and all rules, enabling of all', () => {
	return testDisableRanges(`a {}
    /* stylelint-disable foo-bar */
    b {}
    /* stylelint-enable */
    .foo {}
    /* stylelint-disable foo-bar,baz-maz */
    b {}
    /* stylelint-enable */
    .foo {}`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [],
			'foo-bar': [
				{
					start: 2,
					end: 4,
					strictStart: true,
					strictEnd: false,
				},
				{
					start: 6,
					end: 8,
					strictStart: true,
					strictEnd: false,
				},
			],
			'baz-maz': [
				{
					start: 6,
					end: 8,
					strictStart: true,
					strictEnd: false,
				},
			],
		});
	});
});

it('disable rules with newline in rule list', () => {
	return testDisableRanges('/* stylelint-disable foo-bar, hoo-hah,\n\tslime */\n' + 'b {}\n').then(
		(result) => {
			expect(result.stylelint.disabledRanges).toEqual({
				all: [],
				'foo-bar': [
					{
						start: 1,
						strictStart: true,
					},
				],
				'hoo-hah': [
					{
						start: 1,
						strictStart: true,
					},
				],
				slime: [
					{
						start: 1,
						strictStart: true,
					},
				],
			});
		},
	);
});

it('disable single line all rules', () => {
	return testDisableRanges('a {} /* stylelint-disable-line */').then((result) => {
		expect(result.stylelint.disabledRanges).toEqual(
			{
				all: [
					{
						start: 1,
						end: 1,
						strictStart: true,
						strictEnd: true,
					},
				],
			},
			'disabling all rules',
		);
	});
});

it('disable single line one rule', () => {
	return testDisableRanges('a {} /* stylelint-disable-line block-no-empty */').then((result) => {
		expect(result.stylelint.disabledRanges).toEqual(
			{
				all: [],
				'block-no-empty': [
					{
						start: 1,
						end: 1,
						strictStart: true,
						strictEnd: true,
					},
				],
			},
			'disabling a single rule',
		);
	});
});

it('disable single line multiple rules', () => {
	return testDisableRanges('b {}\n\na {} /* stylelint-disable-line block-no-empty, blergh */').then(
		(result) => {
			expect(result.stylelint.disabledRanges).toEqual(
				{
					all: [],
					'block-no-empty': [
						{
							start: 3,
							end: 3,
							strictStart: true,
							strictEnd: true,
						},
					],
					blergh: [
						{
							start: 3,
							end: 3,
							strictStart: true,
							strictEnd: true,
						},
					],
				},
				'disabling multiple specific rules',
			);
		},
	);
});

it('disable single line one rule and re-enable all', () => {
	return testDisableRanges(
		'a {} /* stylelint-disable-line block-no-empty */\n/* stylelint-enable */',
		() => {
			throw new Error('should have errored');
		},
	).catch((err) => {
		expect(err.reason).toBe('No rules have been disabled');
	});
});

it('disable next line all rules', () => {
	return testDisableRanges('/* stylelint-disable-next-line */\na {} ').then((result) => {
		expect(result.stylelint.disabledRanges).toEqual(
			{
				all: [
					{
						start: 2,
						end: 2,
						strictStart: true,
						strictEnd: true,
					},
				],
			},
			'disabling all rules',
		);
	});
});

it('disable next line one rule', () => {
	return testDisableRanges('/* stylelint-disable-next-line block-no-empty */\na {}').then(
		(result) => {
			expect(result.stylelint.disabledRanges).toEqual(
				{
					all: [],
					'block-no-empty': [
						{
							start: 2,
							end: 2,
							strictStart: true,
							strictEnd: true,
						},
					],
				},
				'disabling a single rule',
			);
		},
	);
});

it('disable next line multiple rules', () => {
	return testDisableRanges(
		`
    b {}

    /* stylelint-disable-next-line block-no-empty, blergh */
    a {}`,
		(result) => {
			expect(result.stylelint.disabledRanges).toEqual(
				{
					all: [],
					'block-no-empty': [
						{
							start: 5,
							end: 5,
							strictStart: true,
							strictEnd: true,
						},
					],
					blergh: [
						{
							start: 5,
							end: 5,
							strictStart: true,
							strictEnd: true,
						},
					],
				},
				'disabling multiple specific rules',
			);
		},
	);
});

it('SCSS // line-disabling comment', () => {
	const scssSource = `a {
    color: pink !important; // stylelint-disable-line declaration-no-important
  }`;

	return postcss()
		.use(assignDisabledRanges)
		.process(scssSource, { syntax: scss, from: undefined })
		.then((result) => {
			expect(result.stylelint.disabledRanges).toEqual({
				all: [],
				'declaration-no-important': [
					{
						start: 2,
						end: 2,
						strictStart: true,
						strictEnd: true,
					},
				],
			});
		});
});

it('Less // line-disabling comment', () => {
	const lessSource = `a {
    color: pink !important; // stylelint-disable-line declaration-no-important
  }`;

	return postcss()
		.use(assignDisabledRanges)
		.process(lessSource, { syntax: less, from: undefined })
		.then((result) => {
			expect(result.stylelint.disabledRanges).toEqual({
				all: [],
				'declaration-no-important': [
					{
						start: 2,
						end: 2,
						strictStart: true,
						strictEnd: true,
					},
				],
			});
		});
});

it('nested ranges all rule-specific', () => {
	return testDisableRanges(`/* stylelint-disable foo */
    /* stylelint-disable bar */
    /* stylelint-disable baz, hop */
    /* stylelint-enable bar */
    /* stylelint-enable foo, hop */
    /* stylelint-enable baz */`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [],
			foo: [
				{
					start: 1,
					end: 5,
					strictStart: true,
					strictEnd: true,
				},
			],
			bar: [
				{
					start: 2,
					end: 4,
					strictStart: true,
					strictEnd: true,
				},
			],
			baz: [
				{
					start: 3,
					end: 6,
					strictStart: true,
					strictEnd: true,
				},
			],
			hop: [
				{
					start: 3,
					end: 5,
					strictStart: true,
					strictEnd: true,
				},
			],
		});
	});
});

it('nested ranges all for all rules', () => {
	return testDisableRanges(`/* stylelint-disable */
    /* stylelint-enable bar */
    /* stylelint-disable bar */
    /* stylelint-enable */`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [
				{
					start: 1,
					end: 4,
					strictStart: true,
					strictEnd: true,
				},
			],
			bar: [
				{
					start: 1,
					end: 2,
					strictStart: false,
					strictEnd: true,
				},
				{
					start: 3,
					end: 4,
					strictStart: true,
					strictEnd: false,
				},
			],
		});
	});
});

it('nested ranges disable rules enable all', () => {
	return testDisableRanges(`/* stylelint-disable foo */
    /* stylelint-disable bar, baz */
    /* stylelint-enable */`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [],
			foo: [
				{
					start: 1,
					end: 3,
					strictStart: true,
					strictEnd: false,
				},
			],
			bar: [
				{
					start: 2,
					end: 3,
					strictStart: true,
					strictEnd: false,
				},
			],
			baz: [
				{
					start: 2,
					end: 3,
					strictStart: true,
					strictEnd: false,
				},
			],
		});
	});
});

it('nested ranges mix disabling enabling all rules and specific rules', () => {
	return testDisableRanges(`/* stylelint-disable */
    /* stylelint-enable foo */
    /* stylelint-enable */
    /* stylelint-disable bar */`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [
				{
					start: 1,
					end: 3,
					strictStart: true,
					strictEnd: true,
				},
			],
			foo: [
				{
					start: 1,
					end: 2,
					strictStart: false,
					strictEnd: true,
				},
			],
			bar: [
				{
					start: 1,
					end: 3,
					strictStart: false,
					strictEnd: false,
				},
				{
					start: 4,
					strictStart: true,
					strictEnd: undefined,
					end: undefined,
				},
			],
		});
	});
});

it('nested ranges another mix', () => {
	return testDisableRanges(`/* stylelint-disable */
    /* stylelint-enable bar */
    /* stylelint-enable foo */
    /* stylelint-disable foo */
    /* stylelint-enable */`).then((result) => {
		expect(result.stylelint.disabledRanges).toEqual({
			all: [
				{
					start: 1,
					end: 5,
					strictStart: true,
					strictEnd: true,
				},
			],
			foo: [
				{
					start: 1,
					end: 3,
					strictStart: false,
					strictEnd: true,
				},
				{
					start: 4,
					end: 5,
					strictStart: true,
					strictEnd: false,
				},
			],
			bar: [
				{
					start: 1,
					end: 2,
					strictStart: false,
					strictEnd: true,
				},
			],
		});
	});
});

it('disable line for all rules after disabling all', () => {
	return testDisableRanges(
		`/* stylelint-disable */
    a {} /* stylelint-disable-line */`,
		() => {
			throw new Error('should have errored');
		},
	).catch((err) => {
		expect(err.reason).toBe('All rules have already been disabled');
	});
});

it('disable line for one rule after disabling all', () => {
	return testDisableRanges(
		`/* stylelint-disable */
    a {} /* stylelint-disable-line foo */`,
		() => {
			throw new Error('should have errored');
		},
	).catch((err) => {
		expect(err.reason).toBe('All rules have already been disabled');
	});
});

it('disable line for rule after disabling rule', () => {
	return testDisableRanges(
		`/* stylelint-disable foo */
    a {} /* stylelint-disable-line foo */`,
		() => {
			throw new Error('should have errored');
		},
	).catch((err) => {
		expect(err.reason).toBe('"foo" has already been disabled');
	});
});

it('disable all twice on the same line', () => {
	return testDisableRanges('/* stylelint-disable */ /* stylelint-disable */', () => {
		throw new Error('should have errored');
	}).catch((err) => {
		expect(err.reason).toBe('All rules have already been disabled');
	});
});

it('disable rule twice on the same line', () => {
	return testDisableRanges('/* stylelint-disable foo */ /* stylelint-disable foo*/', () => {
		throw new Error('should have errored');
	}).catch((err) => {
		expect(err.reason).toBe('"foo" has already been disabled');
	});
});

it('enable all without disabling any', () => {
	return testDisableRanges('/* stylelint-enable */', () => {
		throw new Error('should have errored');
	}).catch((err) => {
		expect(err.reason).toBe('No rules have been disabled');
	});
});

it('enable rule without disabling any', () => {
	return testDisableRanges('/* stylelint-enable foo */', () => {
		throw new Error('should have errored');
	}).catch((err) => {
		expect(err.reason).toBe('"foo" has not been disabled');
	});
});

it('enable rule without disabling rule', () => {
	return testDisableRanges(
		`/* stylelint-disable */
    /* stylelint-enable bar */
    /* stylelint-enable foo */
    /* stylelint-disable foo */
    /* stylelint-enable bar */
    /* stylelint-enable */`,
		() => {
			throw new Error('should have errored');
		},
	).catch((err) => {
		expect(err.reason).toBe('"bar" has not been disabled');
	});
});

function testDisableRanges(source, cb) {
	return postcss().use(assignDisabledRanges).process(source, { from: undefined }).then(cb);
}
