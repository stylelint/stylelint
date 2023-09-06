import standalone from '../standalone.mjs';

it('standalone with input css and quiet mode (in config)', async () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	const { results } = await standalone({ code: 'a {}', config });

	expect(results[0].warnings).toEqual([]);
});

it('standalone with input css and quiet mode (in option)', async () => {
	const config = {
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	const { results } = await standalone({
		code: 'a {}',
		config,
		quiet: true,
	});

	expect(results[0].warnings).toEqual([]);
});
