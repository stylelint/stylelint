'use strict';

const postcss = require('postcss');
const postcssPlugin = require('../postcssPlugin');

it('`defaultSeverity` option set to warning', async () => {
	const config = {
		defaultSeverity: 'warning',
		rules: {
			'block-no-empty': true,
		},
	};

	const result = await postcss([postcssPlugin(config)]).process('a {}', { from: undefined });

	expect(result.warnings()).toMatchObject([
		expect.objectContaining({
			text: expect.stringContaining('block-no-empty'),
			severity: 'warning',
		}),
	]);
});
