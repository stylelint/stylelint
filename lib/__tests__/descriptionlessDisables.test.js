'use strict';

const standalone = require('../standalone');
const stripIndent = require('common-tags').stripIndent;

it('descriptionlessDisables', () => {
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
    a {}
    `;

	return standalone({
		config,
		code: css,
		reportDescriptionlessDisables: true,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		const warnings = results[0].warnings.filter(
			(warning) => warning.rule === '--report-descriptionless-disables',
		);

		expect(warnings).toEqual([
			{
				line: 12,
				column: 1,
				rule: '--report-descriptionless-disables',
				severity: 'error',
				text: 'Disable for "all" is missing a description',
			},
			{
				line: 16,
				column: 8,
				rule: '--report-descriptionless-disables',
				severity: 'error',
				text: 'Disable for "block-no-empty" is missing a description',
			},
			{
				line: 18,
				column: 1,
				rule: '--report-descriptionless-disables',
				severity: 'error',
				text: 'Disable for "block-no-empty" is missing a description',
			},
		]);
	});
});
