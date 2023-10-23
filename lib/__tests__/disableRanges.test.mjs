import assignDisabledRanges from '../assignDisabledRanges.js';
import merge from 'deepmerge';
import postcss from 'postcss';
import postcssLess from 'postcss-less';
import postcssScss from 'postcss-scss';

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect*"] }] */

it('no disabling', async () => {
	const result = await testDisableRanges('a {}');

	expect(result.stylelint.disabledRanges).toEqual({ all: [] });
});

it('disable without re-enabling', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable */
		a {}`,
	);

	expectDisableRanges(result, {
		all: [
			{
				start: 1,
				strictStart: true,
			},
		],
	});
});

it('disable and re-enable', async () => {
	const result = await testDisableRanges(
		`a {}
		/* stylelint-disable */
		b {}
		/* stylelint-enable */
		.foo {}`,
	);

	expectDisableRanges(result, {
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

it('disable and re-enable twice', async () => {
	const result = await testDisableRanges(
		`a {}
		/* stylelint-disable */
		b {}
		/* stylelint-enable */
		.foo {}
		/* stylelint-disable */
		b {}
		/* stylelint-enable */
		.foo {}`,
	);

	expectDisableRanges(result, {
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

it('disable rule without re-enabling', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable foo-bar */
		a {}`,
	);

	expectDisableRanges(result, {
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

	const result_2 = await testDisableRanges(
		`/* stylelint-disable selector-combinator-space-before */
		a {}`,
	);

	expectDisableRanges(result_2, {
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

it('mixed disabling of specific and all rules, enabling of all', async () => {
	const result = await testDisableRanges(
		`a {}
		/* stylelint-disable foo-bar */
		b {}
		/* stylelint-enable */
		.foo {}
		/* stylelint-disable foo-bar,baz-maz */
		b {}
		/* stylelint-enable */
		.foo {}`,
	);

	expectDisableRanges(result, {
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

it('disable rules with newline in rule list', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable foo-bar, hoo-hah,
		slime */
		b {}`,
	);

	expectDisableRanges(result, {
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
});

it('disable single line all rules', async () => {
	const result = await testDisableRanges('a {} /* stylelint-disable-line */');

	expectDisableRanges(result, {
		all: [
			{
				start: 1,
				end: 1,
				strictStart: true,
				strictEnd: true,
			},
		],
	});
});

it('disable single line one rule', async () => {
	const result = await testDisableRanges('a {} /* stylelint-disable-line block-no-empty */');

	expectDisableRanges(result, {
		all: [],
		'block-no-empty': [
			{
				start: 1,
				end: 1,
				strictStart: true,
				strictEnd: true,
			},
		],
	});
});

it('disable single line multiple rules', async () => {
	const result = await testDisableRanges(
		`b {}

		a {} /* stylelint-disable-line block-no-empty, blergh */`,
	);

	expectDisableRanges(result, {
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
	});
});

it('disable single line one rule and re-enable all', () => {
	return expect(
		testDisableRanges(
			`a {} /* stylelint-disable-line block-no-empty */
			/* stylelint-enable */`,
		),
	).rejects.toThrow('No rules have been disabled');
});

it('disable next line all rules', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable-next-line */
		a {} `,
	);

	expectDisableRanges(result, {
		all: [
			{
				start: 2,
				end: 2,
				strictStart: true,
				strictEnd: true,
			},
		],
	});
});

it('disable next line one rule', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable-next-line block-no-empty */
		a {}`,
	);

	expectDisableRanges(result, {
		all: [],
		'block-no-empty': [
			{
				start: 2,
				end: 2,
				strictStart: true,
				strictEnd: true,
			},
		],
	});
});

it('disable next line multiple rules', async () => {
	const result = await testDisableRanges(
		`
		b {}

		/* stylelint-disable-next-line block-no-empty, blergh */
		a {}`,
	);

	expectDisableRanges(result, {
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
	});
});

it('SCSS // line-disabling comment', async () => {
	const result = await testDisableRangesScss(
		`a {
			color: pink !important; // stylelint-disable-line declaration-no-important
		}`,
	);

	expectDisableRanges(result, {
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

it('Less // line-disabling comment', async () => {
	const result = await testDisableRangesLess(
		`a {
			color: pink !important; // stylelint-disable-line declaration-no-important
		}`,
	);

	expectDisableRanges(result, {
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

it('nested ranges all rule-specific', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable foo */
		/* stylelint-disable bar */
		/* stylelint-disable baz, hop */
		/* stylelint-enable bar */
		/* stylelint-enable foo, hop */
		/* stylelint-enable baz */`,
	);

	expectDisableRanges(result, {
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

it('nested ranges all for all rules', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable */
		/* stylelint-enable bar */
		/* stylelint-disable bar */
		/* stylelint-enable */`,
	);

	expectDisableRanges(result, {
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

it('nested ranges disable rules enable all', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable foo */
		/* stylelint-disable bar, baz */
		/* stylelint-enable */`,
	);

	expectDisableRanges(result, {
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

it('nested ranges mix disabling enabling all rules and specific rules', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable */
		/* stylelint-enable foo */
		/* stylelint-enable */
		/* stylelint-disable bar */`,
	);

	expectDisableRanges(result, {
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

it('nested ranges another mix', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable */
		/* stylelint-enable bar */
		/* stylelint-enable foo */
		/* stylelint-disable foo */
		/* stylelint-enable */`,
	);

	expectDisableRanges(result, {
		all: [
			{
				start: 1,
				end: 5,
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
	});
});

it('disable line for all rules after disabling all', () => {
	return expect(
		testDisableRanges(
			`/* stylelint-disable */
			a {} /* stylelint-disable-line */`,
		),
	).rejects.toThrow('All rules have already been disabled');
});

it('disable line for one rule after disabling all', () => {
	return expect(
		testDisableRanges(
			`/* stylelint-disable */
			a {} /* stylelint-disable-line foo */`,
		),
	).rejects.toThrow('All rules have already been disabled');
});

it('disable line for rule after disabling rule', async () => {
	return expect(
		testDisableRanges(
			`/* stylelint-disable foo */
			a {} /* stylelint-disable-line foo */`,
		),
	).rejects.toThrow('"foo" has already been disabled');
});

it('disable all twice on the same line', async () => {
	return expect(
		testDisableRanges('/* stylelint-disable */ /* stylelint-disable */'),
	).rejects.toThrow('All rules have already been disabled');
});

it('disable rule twice on the same line', async () => {
	return expect(
		testDisableRanges('/* stylelint-disable foo */ /* stylelint-disable foo*/'),
	).rejects.toThrow('"foo" has already been disabled');
});

it('enable all without disabling any', async () => {
	return expect(testDisableRanges('/* stylelint-enable */')).rejects.toThrow(
		'No rules have been disabled',
	);
});

it('enable rule without disabling any', async () => {
	return expect(testDisableRanges('/* stylelint-enable foo */')).rejects.toThrow(
		'"foo" has not been disabled',
	);
});

it('enable rule without disabling rule', async () => {
	return expect(
		testDisableRanges(
			`/* stylelint-disable */
			/* stylelint-enable bar */
			/* stylelint-enable foo */
			/* stylelint-disable foo */
			/* stylelint-enable bar */
			/* stylelint-enable */`,
		),
	).rejects.toThrow('"bar" has not been disabled');
});

// Command comment descriptions.

it('disable (with description) without re-enabling', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable -- Description */
		a {}`,
	);

	expectDisableRanges(result, {
		all: [
			{
				start: 1,
				strictStart: true,
				description: 'Description',
			},
		],
	});
});

it('disable and re-enable (with descriptions)', async () => {
	const result = await testDisableRanges(
		`a {}
		/* stylelint-disable -- Description */
		b {}
		/* stylelint-enable -- Description */
		.foo {}`,
	);

	expectDisableRanges(result, {
		all: [
			{
				start: 2,
				end: 4,
				strictStart: true,
				strictEnd: true,
				description: 'Description',
			},
		],
	});
});

it('disable rule (with description) without re-enabling', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable foo-bar -- Description */
		a {}`,
	);

	expectDisableRanges(result, {
		all: [],
		'foo-bar': [
			{
				start: 1,
				strictStart: true,
				end: undefined,
				strictEnd: undefined,
				description: 'Description',
			},
		],
	});
});

it('disable rules (with description) with newline in rule list', async () => {
	const result = await testDisableRanges(
		`/* stylelint-disable foo-bar, hoo-hah,
		slime -- Description */
		b {}`,
	);

	expectDisableRanges(result, {
		all: [],
		'foo-bar': [
			{
				start: 1,
				strictStart: true,
				description: 'Description',
			},
		],
		'hoo-hah': [
			{
				start: 1,
				strictStart: true,
				description: 'Description',
			},
		],
		slime: [
			{
				start: 1,
				strictStart: true,
				description: 'Description',
			},
		],
	});
});

it('SCSS // line-disabling comment (with description)', async () => {
	const result = await testDisableRangesScss(
		`a {
			color: pink !important; // stylelint-disable-line declaration-no-important -- Description
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				end: 2,
				strictStart: true,
				strictEnd: true,
				description: 'Description',
			},
		],
	});
});

it('SCSS // disable next-line comment (with multi-line description)', async () => {
	const result = await testDisableRangesScss(
		`a {
			// stylelint-disable-next-line declaration-no-important
			// --
			// Long-winded description
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 5,
				end: 5,
				strictStart: true,
				strictEnd: true,
				description: 'Long-winded description',
			},
		],
	});
});

it('SCSS // disable comment (with // comment after blank line)', async () => {
	const result = await testDisableRangesScss(
		`a {
			// stylelint-disable declaration-no-important

			// Unrelated
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				strictStart: true,
			},
		],
	});
});

it('SCSS // disable comment (with // comment immediately after)', async () => {
	const result = await testDisableRangesScss(
		`a {
			// stylelint-disable declaration-no-important
			// Unrelated
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				strictStart: true,
			},
		],
	});
});

it('SCSS /* disable comment (with // comment after blank line)', async () => {
	const result = await testDisableRangesScss(
		`a {
			/* stylelint-disable declaration-no-important */

			// Unrelated
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				strictStart: true,
			},
		],
	});
});

it('SCSS // disable comment (with // comment immediately before)', async () => {
	const result = await testDisableRangesScss(
		`a {
			// Unrelated
			// stylelint-disable declaration-no-important
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 3,
				strictStart: true,
			},
		],
	});
});

it('SCSS two adjacent // disable comments', async () => {
	const result = await testDisableRangesScss(
		`a {
			// stylelint-disable declaration-no-important
			// stylelint-disable foo-bar
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				strictStart: true,
			},
		],
		'foo-bar': [
			{
				start: 3,
				strictStart: true,
			},
		],
	});
});

it('SCSS two adjacent // disable comments with multi-line descriptions', async () => {
	const result = await testDisableRangesScss(
		`a {
			// stylelint-disable declaration-no-important --
			// Description 1
			// stylelint-disable foo-bar
			// --
			// Description 2
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				strictStart: true,
				description: 'Description 1',
			},
		],
		'foo-bar': [
			{
				start: 4,
				strictStart: true,
				description: 'Description 2',
			},
		],
	});
});

it('SCSS two // disable comments with an unrelated comment between them', async () => {
	const result = await testDisableRangesScss(
		`a {
			// stylelint-disable declaration-no-important
			// Unrelated
			// stylelint-disable foo-bar
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				strictStart: true,
			},
		],
		'foo-bar': [
			{
				start: 4,
				strictStart: true,
			},
		],
	});
});

it('Less // line-disabling comment (with description)', async () => {
	const result = await testDisableRangesLess(
		`a {
			color: pink !important; // stylelint-disable-line declaration-no-important -- Description
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 2,
				end: 2,
				strictStart: true,
				strictEnd: true,
				description: 'Description',
			},
		],
	});
});

// eslint-disable-next-line jest/no-disabled-tests -- see #5348
it.skip('Less // disable next-line comment (with multi-line description)', async () => {
	const result = await testDisableRangesLess(
		`a {
			// stylelint-disable-next-line declaration-no-important
			// --
			// Long-winded description
			color: pink !important;
		}`,
	);

	expectDisableRanges(result, {
		all: [],
		'declaration-no-important': [
			{
				start: 5,
				end: 5,
				strictStart: true,
				strictEnd: true,
				description: 'Long-winded description',
			},
		],
	});
});

function expectDisableRanges(result, expected) {
	const actual = result.stylelint.disabledRanges;

	expect(Object.keys(actual)).toEqual(Object.keys(expected));

	for (const [name, expectedRanges] of Object.entries(expected)) {
		const actualRanges = actual[name];

		expect(actualRanges).toHaveLength(expectedRanges.length);

		for (const [i, expectedRange] of expectedRanges.entries()) {
			expectDisableRange(actualRanges[i], expectedRange);
		}
	}
}

function expectDisableRange(actual, expected) {
	const expectedMutable = merge({}, expected);

	if ('comment' in actual) {
		expectedMutable.comment = actual.comment;
	}

	expect(actual).toEqual(expectedMutable);
}

function testDisableRanges(source, options) {
	return postcss()
		.use(assignDisabledRanges)
		.process(source, { from: undefined, ...options });
}

function testDisableRangesLess(source) {
	return testDisableRanges(source, { syntax: postcssLess });
}

function testDisableRangesScss(source) {
	return testDisableRanges(source, { syntax: postcssScss });
}
