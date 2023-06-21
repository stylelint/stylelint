import { fileURLToPath } from 'node:url';

import standalone from '../../../../standalone.js';

it('glob contains a parent directory and ** wildcard', async () => {
	const { results } = await standalone({
		files: '../**/sibling-style.css',
		config: { rules: { 'block-no-empty': true } },
		cwd: fileURLToPath(new URL('.', import.meta.url)),
	});

	expect(results).toHaveLength(1);
	expect(results[0].errored).toBe(true);
	expect(results[0].warnings[0]).toEqual(
		expect.objectContaining({
			rule: 'block-no-empty',
			severity: 'error',
		}),
	);
});
