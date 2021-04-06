'use strict';

const postcssPlugin = require('../postcssPlugin');

it('`defaultSeverity` option set to warning', async () => {
	const config = {
		defaultSeverity: 'warning',
		rules: {
			'block-no-empty': true,
		},
	};

	const result = await postcssPlugin.process('a {}', { from: undefined }, config);

	expect(result.warnings()).toMatchObject([
		expect.objectContaining({
			text: expect.stringContaining('block-no-empty'),
			severity: 'warning',
		}),
	]);
});
