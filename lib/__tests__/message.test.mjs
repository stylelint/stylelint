import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { it } from 'node:test';
import path from 'node:path';

import standalone from '../standalone.mjs';

const fixturesDir = fileURLToPath(new URL('./fixtures', import.meta.url));

it('standalone loading YAML with custom message', async () => {
	const { results } = await standalone({
		code: 'a { color: pink; }',
		configFile: path.join(fixturesDir, 'config-color-named-custom-message.yaml'),
	});

	assert.equal(results[0].warnings.length, 1);
	assert.equal(results[0].warnings[0].text, 'Unacceptable (color-named)');
});
