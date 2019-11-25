'use strict';

const postcssPlugin = require('../postcssPlugin');

it('`defaultSeverity` option set to warning', () => {
	const config = {
		defaultSeverity: 'warning',
		rules: {
			'block-no-empty': true,
		},
	};

	return postcssPlugin.process('a {}', { from: undefined }, config).then((result) => {
		const warnings = result.warnings();

		expect(warnings).toHaveLength(1);
		expect(warnings[0].text).toContain('block-no-empty');
		expect(warnings[0].severity).toBe('warning');
	});
});
