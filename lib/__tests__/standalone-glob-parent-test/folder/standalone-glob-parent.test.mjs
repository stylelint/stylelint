import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { it } from 'node:test';

import standalone from '../../../standalone.mjs';

it('glob has parent directory', async () => {
	const { results } = await standalone({
		files: '../parent-folder-style.css',
		config: { rules: { 'block-no-empty': true } },
		cwd: fileURLToPath(new URL('.', import.meta.url)),
	});

	assert.equal(results.length, 1);
	assert.equal(results[0].errored, true);
	assert.partialDeepStrictEqual(results[0].warnings[0], {
		rule: 'block-no-empty',
		severity: 'error',
	});
});
