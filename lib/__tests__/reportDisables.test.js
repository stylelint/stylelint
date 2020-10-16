'use strict';

const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

describe('reportDisables', () => {
	it('reports a disabled comment', () => {
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

		return standalone({ config, code: css }).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			const warnings = results[0].warnings;

			expect(warnings).toEqual([
				{
					line: 1,
					column: 1,
					text: 'Rule "block-no-empty" may not be disabled',
					rule: 'reportDisables',
					severity: 'error',
				},
				{
					line: 5,
					column: 8,
					text: 'Rule "block-no-empty" may not be disabled',
					rule: 'reportDisables',
					severity: 'error',
				},
			]);
		});
	});

	it('reports an ignored disabled comment', () => {
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

		return standalone({
			config,
			code: css,
			ignoreDisables: true,
		}).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			const warnings = results[0].warnings;

			expect(warnings.filter((warning) => warning.rule === 'reportDisables')).toEqual([
				{
					line: 1,
					column: 1,
					text: 'Rule "block-no-empty" may not be disabled',
					rule: 'reportDisables',
					severity: 'error',
				},
				{
					line: 5,
					column: 8,
					text: 'Rule "block-no-empty" may not be disabled',
					rule: 'reportDisables',
					severity: 'error',
				},
			]);
		});
	});

	it("doesn't report disables by default", () => {
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

		return standalone({ config, code: css }).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});
	});

	// This should be handled by the global `reportUnscopedDisables` option (#2292).
	it("doesn't report unscoped disables", () => {
		const config = {
			rules: { 'block-no-empty': [true, { reportDisables: true }] },
		};

		const css = stripIndent`
    a {} /* stylelint-disable-line */
    `;

		return standalone({ config, code: css }).then((linted) => {
			const results = linted.results;

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});
	});
});
