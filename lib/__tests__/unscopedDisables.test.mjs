import assert from 'node:assert/strict';
import { it } from 'node:test';

import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

it('does report unscoped configuration comments even when they are needless', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`/* stylelint-disable-next-line */
		a { color: red; }`;

	const { results } = await standalone({
		config,
		code: css,
		reportUnscopedDisables: [true],
	});

	assert.equal(results[0].warnings.length, 1);
	assertItemsPartialDeepStrictEqual(unscopedWarnings(results[0]), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 33,
			rule: '--report-unscoped-disables',
			severity: 'error',
			text: 'Configuration comment must be scoped',
		},
	]);
});

it('unscopedDisables true', async () => {
	const config = {
		rules: {
			'selector-type-case': 'lower',
		},
	};

	const css = stripIndent`
		/* stylelint-disable */
		a {}
		/* stylelint-enable */

		a {} /* stylelint-disable-line */

		/* stylelint-disable-next-line */
		a {}
	`;

	const { results } = await standalone({
		config,
		code: css,
		reportUnscopedDisables: [true],
	});

	const common = {
		rule: '--report-unscoped-disables',
		severity: 'error',
		text: 'Configuration comment must be scoped',
	};

	assert.equal(results[0].warnings.length, 3);
	assertItemsPartialDeepStrictEqual(unscopedWarnings(results[0]), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
			...common,
		},
		{
			line: 5,
			column: 6,
			endLine: 5,
			endColumn: 33,
			...common,
		},
		{
			line: 7,
			column: 1,
			endLine: 7,
			endColumn: 33,
			...common,
		},
	]);
});

it('unscopedDisables false', async () => {
	const config = {
		rules: {
			'selector-type-case': 'lower',
		},
	};
	const css = stripIndent`a {} /* stylelint-disable-line */`;

	const { results } = await standalone({
		config,
		code: css,
		reportUnscopedDisables: [false],
	});

	assert.equal(results[0].warnings.length, 0);
});

it('unscopedDisables false except empty', async () => {
	const config = {
		rules: {
			'selector-type-case': 'lower',
		},
	};
	const css = stripIndent`a {} /* stylelint-disable-line */`;

	const { results } = await standalone({
		config,
		code: css,
		reportUnscopedDisables: [false, { except: [] }],
	});

	assert.equal(results[0].warnings.length, 0);
});

it('unscopedDisables false except / same line', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
			'selector-type-case': 'lower',
		},
	};
	const css = stripIndent`
		A {} /* stylelint-disable-line */

		A {} /* stylelint-disable-line block-no-empty */
		A {} /* stylelint-disable-line selector-type-case */
	`;

	const { results } = await standalone({
		config,
		code: css,
		reportUnscopedDisables: [false, { except: ['selector-type-case', 'block-no-empty'] }],
	});

	assert.equal(results[0].warnings.length, 3);
	assertItemsPartialDeepStrictEqual(unscopedWarnings(results[0]), [
		{
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 33,
			rule: '--report-unscoped-disables',
			severity: 'error',
			text: 'Configuration comment must be scoped',
		},
	]);
});

it('unscopedDisables false except / separate lines', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
			'selector-type-case': 'lower',
		},
	};
	const css = stripIndent`
		a {} /* stylelint-disable-line */
		A { color:red } /* stylelint-disable-line */
		a { color:red } /* stylelint-disable-line */
	`;

	const { results } = await standalone({
		config,
		code: css,
		reportUnscopedDisables: [false, { except: ['selector-type-case', 'block-no-empty'] }],
	});

	assert.equal(results[0].warnings.length, 2);
	assertItemsPartialDeepStrictEqual(unscopedWarnings(results[0]), [
		{
			line: 1,
			column: 6,
			endLine: 1,
			endColumn: 33,
			rule: '--report-unscoped-disables',
			severity: 'error',
			text: 'Configuration comment must be scoped',
		},
		{
			line: 2,
			column: 17,
			endLine: 2,
			endColumn: 44,
			rule: '--report-unscoped-disables',
			severity: 'error',
			text: 'Configuration comment must be scoped',
		},
	]);
});

function unscopedWarnings(result) {
	return result.warnings.filter(({ rule }) => rule === '--report-unscoped-disables');
}
