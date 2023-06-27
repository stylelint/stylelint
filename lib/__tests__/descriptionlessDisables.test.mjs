import standalone from '../standalone.js';
import { stripIndent } from 'common-tags';

it('descriptionlessDisables', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable -- Description */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty -- Description */
		}
		/* stylelint-disable-next-line block-no-empty
		 * --
		 * Description */
		a {}

		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable-next-line block-no-empty */
		a {}`;

	const { results } = await standalone({
		config,
		code: css,
		reportDescriptionlessDisables: true,
	});

	expect(results).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toEqual([
		{
			line: 12,
			column: 1,
			endLine: 12,
			endColumn: 23,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "all" is missing a description',
		},
		{
			line: 16,
			column: 7,
			endLine: 16,
			endColumn: 49,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "block-no-empty" is missing a description',
		},
		{
			line: 18,
			column: 1,
			endLine: 18,
			endColumn: 48,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "block-no-empty" is missing a description',
		},
	]);
});

it('descriptionlessDisables from config', async () => {
	const config = {
		reportDescriptionlessDisables: true,
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable -- Description */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty -- Description */
		}
		/* stylelint-disable-next-line block-no-empty
		 * --
		 * Description */
		a {}

		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable-next-line block-no-empty */
		a {}`;

	const { results } = await standalone({
		config,
		code: css,
	});

	expect(results).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toEqual([
		{
			line: 12,
			column: 1,
			endLine: 12,
			endColumn: 23,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "all" is missing a description',
		},
		{
			line: 16,
			column: 7,
			endLine: 16,
			endColumn: 49,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "block-no-empty" is missing a description',
		},
		{
			line: 18,
			column: 1,
			endLine: 18,
			endColumn: 48,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "block-no-empty" is missing a description',
		},
	]);
});

it('descriptionlessDisables true except', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable -- Description */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty -- Description */
		}
		/* stylelint-disable-next-line block-no-empty
		 * --
		 * Description */
		a {}

		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line invalid-hex-case */
		}
		/* stylelint-disable-next-line block-no-empty */
		a {}`;

	const { results } = await standalone({
		config,
		code: css,
		reportDescriptionlessDisables: [true, { except: ['invalid-hex-case'] }],
	});

	expect(results).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toEqual([
		{
			line: 12,
			column: 1,
			endLine: 12,
			endColumn: 23,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "all" is missing a description',
		},
		{
			line: 18,
			column: 1,
			endLine: 18,
			endColumn: 48,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "block-no-empty" is missing a description',
		},
	]);
});

it('descriptionlessDisables false except', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable -- Description */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty -- Description */
		}
		/* stylelint-disable-next-line block-no-empty
		 * --
		 * Description */
		a {}

		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line invalid-hex-case */
		}
		/* stylelint-disable-next-line block-no-empty */
		a {}`;

	const { results } = await standalone({
		config,
		code: css,
		reportDescriptionlessDisables: [false, { except: ['invalid-hex-case'] }],
	});

	expect(results).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toEqual([
		{
			line: 16,
			column: 7,
			endLine: 16,
			endColumn: 51,
			rule: '--report-descriptionless-disables',
			severity: 'error',
			text: 'Disable for "invalid-hex-case" is missing a description',
		},
	]);
});

it('descriptionlessDisables severity', async () => {
	const config = {
		rules: { 'block-no-empty': true },
	};

	const css = stripIndent`
		/* stylelint-disable -- Description */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty -- Description */
		}
		/* stylelint-disable-next-line block-no-empty
		 * --
		 * Description */
		a {}

		/* stylelint-disable */
		a {}
		/* stylelint-enable */
		a {
			b {} /* stylelint-disable-line block-no-empty */
		}
		/* stylelint-disable-next-line block-no-empty */
		a {}`;

	const { results } = await standalone({
		config,
		code: css,
		reportDescriptionlessDisables: [true, { severity: 'warning' }],
	});

	expect(results).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toEqual([
		{
			line: 12,
			column: 1,
			endLine: 12,
			endColumn: 23,
			rule: '--report-descriptionless-disables',
			severity: 'warning',
			text: 'Disable for "all" is missing a description',
		},
		{
			line: 16,
			column: 7,
			endLine: 16,
			endColumn: 49,
			rule: '--report-descriptionless-disables',
			severity: 'warning',
			text: 'Disable for "block-no-empty" is missing a description',
		},
		{
			line: 18,
			column: 1,
			endLine: 18,
			endColumn: 48,
			rule: '--report-descriptionless-disables',
			severity: 'warning',
			text: 'Disable for "block-no-empty" is missing a description',
		},
	]);
});

it('descriptionlessDisables only', async () => {
	const config = {
		rules: {},
	};
	const css = '/* stylelint-disable */';

	const { results } = await standalone({
		config,
		code: css,
		reportDescriptionlessDisables: true,
	});

	expect(results).toHaveLength(1);
	expect(results[0].errored).toBe(true);
	expect(results[0].warnings).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toHaveLength(1);
});

it('descriptionlessDisables only with warning severity', async () => {
	const config = {
		rules: {},
	};
	const css = '/* stylelint-disable */';

	const { results } = await standalone({
		config,
		code: css,
		reportDescriptionlessDisables: [true, { severity: 'warning' }],
	});

	expect(results).toHaveLength(1);
	expect(results[0].errored).toBe(false);
	expect(results[0].warnings).toHaveLength(1);
	expect(descriptionlessWarnings(results[0])).toHaveLength(1);
});

function descriptionlessWarnings(result) {
	return result.warnings.filter(({ rule }) => rule === '--report-descriptionless-disables');
}
