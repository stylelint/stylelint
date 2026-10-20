import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { it } from 'node:test';
import path from 'node:path';

import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

function fixture(name) {
	const dir = fileURLToPath(new URL('./fixtures/disableOptions', import.meta.url));

	return replaceBackslashes(path.join(dir, name));
}

it('needlessDisables simple case', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable */
		a { color: pink; }
		/* stylelint-enable */
		a {
			b { color: pink; } /* stylelint-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportNeedlessDisables: true,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 7,
			column: 1,
			endLine: 7,
			endColumn: 23,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 11,
			column: 21,
			endLine: 11,
			endColumn: 63,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
	assert.equal(results[0].errored, true);
});

it('needlessDisables with config', async () => {
	const config = {
		reportNeedlessDisables: true,
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable */
		a { color: pink; }
		/* stylelint-enable */
		a {
			b { color: pink; } /* stylelint-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 7,
			column: 1,
			endLine: 7,
			endColumn: 23,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 11,
			column: 21,
			endLine: 11,
			endColumn: 63,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
});

it('needlessDisables with multiple rules', async () => {
	const config = {
		rules: { 'block-no-empty': true, 'color-named': true },
	};

	const css = stripIndent`
		/* stylelint-disable-next-line block-no-empty, color-named */
		a {}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportNeedlessDisables: true,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 61,
			text: 'Needless disable for "color-named"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
});

it('needlessDisables complex case', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
			'color-named': 'never',
		},
	};

	const { results } = await standalone({
		config,
		files: [
			fixture('disabled-ranges-1.css'),
			fixture('disabled-ranges-2.css'),
			// ignore files contain `CssSyntaxError`
			fixture('disabled-ranges-3.css'),
		],
		reportNeedlessDisables: true,
	});

	assert.equal(results.length, 3);
	assertItemsPartialDeepStrictEqual(needlessDisables(results[0].warnings), [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 35,
			text: 'Needless disable for "color-named"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 5,
			column: 1,
			endLine: 5,
			endColumn: 38,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);

	assertItemsPartialDeepStrictEqual(needlessDisables(results[1].warnings), [
		{
			line: 6,
			column: 19,
			endLine: 6,
			endColumn: 61,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 8,
			column: 1,
			endLine: 8,
			endColumn: 38,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 5,
			column: 6,
			endLine: 5,
			endColumn: 45,
			text: 'Needless disable for "color-named"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);

	assert.equal(needlessDisables(results[2].warnings).length, 0);
});

it('needlessDisables ignored case', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const { results } = await standalone({
		config,
		files: [fixture('disabled-ranges-1.css'), fixture('ignored-file.css')],
		reportNeedlessDisables: true,
		ignorePath: [fixture('.stylelintignore')],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(needlessDisables(results[0].warnings), [
		{
			line: 10,
			column: 19,
			endLine: 10,
			endColumn: 46,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 35,
			text: 'Needless disable for "color-named"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 5,
			column: 1,
			endLine: 5,
			endColumn: 38,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
});

it('needlessDisables true except', async () => {
	const config = {
		rules: { 'color-named': 'always-where-possible' },
	};

	const css = stripIndent`
		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable */
		a { color: pink; }
		/* stylelint-enable */
		a {
			b { color: pink; } /* stylelint-disable-line color-named */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportNeedlessDisables: [true, { except: 'block-no-empty' }],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 7,
			column: 1,
			endLine: 7,
			endColumn: 23,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 11,
			column: 21,
			endLine: 11,
			endColumn: 60,
			text: 'Needless disable for "color-named"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
});

it('needlessDisables false except', async () => {
	const config = {
		rules: { 'color-named': 'always-where-possible' },
	};

	const css = stripIndent`
		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable */
		a { color: pink; }
		/* stylelint-enable */
		a {
			b { color: pink; } /* stylelint-disable-line color-named */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportNeedlessDisables: [false, { except: 'color-named' }],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 11,
			column: 21,
			endLine: 11,
			endColumn: 60,
			text: 'Needless disable for "color-named"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
});

it('needlessDisables severity', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable */
		a { color: pink; }
		/* stylelint-enable */
		a {
			b { color: pink; } /* stylelint-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportNeedlessDisables: [true, { severity: 'warning' }],
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 7,
			column: 1,
			endLine: 7,
			endColumn: 23,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'warning',
		},
		{
			line: 11,
			column: 21,
			endLine: 11,
			endColumn: 63,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'warning',
		},
	]);
	assert.equal(results[0].errored, false);
});

it('needlessDisables with configurationComment', async () => {
	const config = {
		rules: { 'block-no-empty': true },
		configurationComment: 'stylelint-special-rules',
	};

	const css = stripIndent`
		/* stylelint-special-rules-disable */
		a {}
		/* stylelint-special-rules-enable */
		a {
			b {} /* stylelint-special-rules-disable-line block-no-empty */
		}
		/* stylelint-special-rules-disable */
		a { color: pink; }
		/* stylelint-special-rules-enable */
		a {
			b { color: pink; } /* stylelint-special-rules-disable-line block-no-empty */
		}
		`;

	const { results } = await standalone({
		config,
		code: css,
		reportNeedlessDisables: true,
	});

	assert.equal(results.length, 1);
	assertItemsPartialDeepStrictEqual(results[0].warnings, [
		{
			line: 7,
			column: 1,
			endLine: 7,
			endColumn: 37,
			text: 'Needless disable for "all"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
		{
			line: 11,
			column: 21,
			endLine: 11,
			endColumn: 77,
			text: 'Needless disable for "block-no-empty"',
			rule: '--report-needless-disables',
			severity: 'error',
		},
	]);
});

function needlessDisables(warnings) {
	return warnings.filter((warning) => warning.rule === '--report-needless-disables');
}
