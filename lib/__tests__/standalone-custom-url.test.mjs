import standalone from '../standalone.mjs';

it('standalone with input css and custom url', async () => {
	const config = {
		rules: {
			'block-no-empty': [true, { url: 'https://example.org/your-custom-doc/' }],
		},
	};

	const { results } = await standalone({ code: 'a {}', config });

	expect(results[0].warnings[0].url).toBe('https://example.org/your-custom-doc/');
});
