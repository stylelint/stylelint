import standalone from '../standalone.mjs';
import { stripIndent } from 'common-tags';

describe('reportDisables', () => {
	it('reports a disabled comment', async () => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    /* stylelint-disable block-no-empty */
    a {}
    /* stylelint-enable block-no-empty */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    `;

		const { results } = await standalone({ config, code: css });

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toEqual([
			{
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 38,
				text: 'Rule "block-no-empty" may not be disabled',
				rule: 'reportDisables',
				severity: 'error',
			},
			{
				line: 5,
				column: 8,
				endLine: 5,
				endColumn: 50,
				text: 'Rule "block-no-empty" may not be disabled',
				rule: 'reportDisables',
				severity: 'error',
			},
		]);
		expect(results[0].errored).toBe(true);
	});

	it('reports an ignored disabled comment', async () => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    /* stylelint-disable block-no-empty */
    a {}
    /* stylelint-enable block-no-empty */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    `;

		const { results } = await standalone({
			config,
			code: css,
			ignoreDisables: true,
		});

		expect(results).toHaveLength(1);
		expect(results[0].warnings.filter((warning) => warning.rule === 'reportDisables')).toEqual([
			{
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 38,
				text: 'Rule "block-no-empty" may not be disabled',
				rule: 'reportDisables',
				severity: 'error',
			},
			{
				line: 5,
				column: 8,
				endLine: 5,
				endColumn: 50,
				text: 'Rule "block-no-empty" may not be disabled',
				rule: 'reportDisables',
				severity: 'error',
			},
		]);
	});

	it("doesn't report disables by default", async () => {
		const config = {
			rules: { 'block-no-empty': [true] },
		};

		const css = stripIndent`
    /* stylelint-disable block-no-empty */
    a {}
    /* stylelint-enable block-no-empty */
    a {
      b {} /* stylelint-disable-line block-no-empty */
    }
    `;

		const { results } = await standalone({ config, code: css });

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(0);
	});

	// This should be handled by the global `reportUnscopedDisables` option (#2292).
	it("doesn't report unscoped disables", async () => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    a {} /* stylelint-disable-line */
    `;

		const { results } = await standalone({ config, code: css });

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(0);
	});
});
