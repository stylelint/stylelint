import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { stripIndent } from 'common-tags';

import replaceBackslashes from '../testUtils/replaceBackslashes.js';
import standalone from '../standalone.js';

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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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
	expect(results[0].errored).toBe(true);
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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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

	expect(results).toHaveLength(3);
	expect(needlessDisables(results[0].warnings)).toEqual([
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

	expect(needlessDisables(results[1].warnings)).toEqual([
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

	expect(needlessDisables(results[2].warnings)).toHaveLength(0);
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

	expect(results).toHaveLength(1);
	expect(needlessDisables(results[0].warnings)).toEqual([
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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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
	expect(results[0].errored).toBe(false);
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

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toEqual([
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
