import { fileURLToPath } from 'node:url';

import standalone from '../../../standalone.js';

it('glob has parent directory', async () => {
	const { results } = await standalone({
		files: '../parent-folder-style.css',
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
