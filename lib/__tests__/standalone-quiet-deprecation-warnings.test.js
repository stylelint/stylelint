'use strict';

const standalone = require('../standalone');

it('standalone with input css does not silence deprecation warnings by default', async () => {
	const config = {
		rules: {
			'color-hex-case': 'lower',
		},
	};

	const { results } = await standalone({ code: 'a { color: #FFF }', config });

	expect(results[0].deprecations).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
});

it('standalone with input css and quiet deprecation warnings mode (in config)', async () => {
	const config = {
		quietDeprecationWarnings: true,
		rules: {
			'color-hex-case': 'lower',
		},
	};

	const { results } = await standalone({ code: 'a { color: #FFF }', config });

	expect(results[0].deprecations).toHaveLength(0);
	expect(results[0].warnings).toHaveLength(1);
});

it('standalone with input css and quiet deprecation warnings mode (in option)', async () => {
	const config = {
		rules: {
			'color-hex-case': 'lower',
		},
	};

	const { results } = await standalone({
		code: 'a { color: #FFF }',
		config,
		quietDeprecationWarnings: true,
	});

	expect(results[0].deprecations).toHaveLength(0);
	expect(results[0].warnings).toHaveLength(1);
});
