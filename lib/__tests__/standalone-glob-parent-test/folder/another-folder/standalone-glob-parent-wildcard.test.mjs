import { fileURLToPath } from 'node:url';
import { it } from 'node:test';

import standalone from '../../../../standalone.mjs';

it('glob contains a parent directory and ** wildcard', async (t) => {
	const { results } = await standalone({
		files: '../**/sibling-style.css',
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
