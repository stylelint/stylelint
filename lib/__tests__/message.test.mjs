import { fileURLToPath } from 'node:url';
import path from 'node:path';

import standalone from '../standalone.mjs';

const fixturesDir = fileURLToPath(new URL('./fixtures', import.meta.url));

it('standalone loading YAML with custom message', async () => {
	const { results } = await standalone({
		code: 'a { color: pink; }',
		configFile: path.join(fixturesDir, 'config-color-named-custom-message.yaml'),
	});

	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0].text).toBe('Unacceptable');
});
