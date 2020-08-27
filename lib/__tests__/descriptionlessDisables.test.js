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
    /* stylelint-disable */
    a { color: pink; }
    /* stylelint-enable */
    a {
      b { color: pink; } /* stylelint-disable-line block-no-empty */
    }
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
				start: 7,
				end: 9,
				rule: 'all',
				unusedRule: 'all',
			},
			{
				start: 11,
				end: 11,
				rule: 'block-no-empty',
				unusedRule: 'block-no-empty',
			},
		]);
	});
});
