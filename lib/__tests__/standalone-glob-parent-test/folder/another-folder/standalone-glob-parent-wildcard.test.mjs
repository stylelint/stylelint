import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { it } from 'node:test';

import standalone from '../../../../standalone.mjs';

it('glob contains a parent directory and ** wildcard', async () => {
	const { results } = await standalone({
		files: '../**/sibling-style.css',
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
