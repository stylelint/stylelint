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
		const report = linted.descriptionlessDisables;

		expect(report).toHaveLength(1);
		expect(report[0].ranges).toEqual([
			{
				start: 12,
				end: 14,
				rule: 'all',
				unusedRule: 'all',
			},
			{
				start: 16,
				end: 16,
				rule: 'block-no-empty',
				unusedRule: 'block-no-empty',
			},
			{
				start: 19,
				end: 19,
				rule: 'block-no-empty',
				unusedRule: 'block-no-empty',
			},
		]);
	});
});
