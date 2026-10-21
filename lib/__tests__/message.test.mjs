import { fileURLToPath } from 'node:url';
import { it } from 'node:test';
import path from 'node:path';

import standalone from '../standalone.mjs';

const fixturesDir = fileURLToPath(new URL('./fixtures', import.meta.url));

it('standalone loading YAML with custom message', async (t) => {
	const { results } = await standalone({
		code: 'a { color: pink; }',
		configFile: path.join(fixturesDir, 'config-color-named-custom-message.yaml'),
	});

	t.assert.strictEqual(results[0].warnings.length, 1);
	t.assert.strictEqual(results[0].warnings[0].text, 'Unacceptable (color-named)');
});
