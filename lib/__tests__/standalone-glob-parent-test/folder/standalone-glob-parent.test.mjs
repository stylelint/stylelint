import { fileURLToPath } from 'node:url';
import { it } from 'node:test';

import standalone from '../../../standalone.mjs';

it('glob has parent directory', async (t) => {
	const { results } = await standalone({
		files: '../parent-folder-style.css',
		config: { rules: { 'block-no-empty': true } },
		cwd: fileURLToPath(new URL('.', import.meta.url)),
	});

	t.assert.strictEqual(results.length, 1);
	t.assert.strictEqual(results[0].errored, true);
	t.assert.partialDeepStrictEqual(results[0].warnings[0], {
		rule: 'block-no-empty',
		severity: 'error',
	});
});
