import standalone from '../standalone.js';

// eslint-disable-next-line jest/no-disabled-tests
it.skip('standalone does not silence deprecation warnings by default', async () => {
	const config = {
		rules: {
			'color-hex-case': 'lower',
		},
	};

	const { results } = await standalone({ code: 'a { color: #FFF }', config });

	expect(results[0].deprecations).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
});

// eslint-disable-next-line jest/no-disabled-tests
it.skip('standalone silences deprecation warnings when passed --quiet-deprecation-warnings', async () => {
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
