import { it } from 'node:test';

import standalone from '../standalone.mjs';

it('standalone with input css and custom url', async (t) => {
	const config = {
		rules: {
			'block-no-empty': [true, { url: 'https://example.org/your-custom-doc/' }],
		},
	};

	const { results } = await standalone({ code: 'a {}', config });

	t.assert.strictEqual(results[0].warnings[0].url, 'https://example.org/your-custom-doc/');
});
