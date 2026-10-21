import { it } from 'node:test';

import path from 'node:path';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = replaceBackslashes(new URL('./fixtures', import.meta.url));

it('standalone with input css and `maxWarnings`', async (t) => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
		},
	};

	const { maxWarningsExceeded } = await standalone({
		code: 'a {}',
		config,
		maxWarnings: 0,
	});

	t.assert.partialDeepStrictEqual(maxWarningsExceeded, { maxWarnings: 0, foundWarnings: 1 });
});

it('standalone with input file(s) and `maxWarnings`', async (t) => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
		},
	};

	const { maxWarningsExceeded } = await standalone({
		files: replaceBackslashes(path.join(fixturesPath, 'empty-block.css')),
		config,
		maxWarnings: 0,
	});

	t.assert.partialDeepStrictEqual(maxWarningsExceeded, { maxWarnings: 0, foundWarnings: 1 });
});

it('standalone with `maxWarnings` in config', async (t) => {
	const { maxWarningsExceeded } = await standalone({
		code: 'a {}',
		config: {
			maxWarnings: 0,
			quiet: true,
			rules: {
				'block-no-empty': true,
			},
		},
	});

	t.assert.partialDeepStrictEqual(maxWarningsExceeded, { maxWarnings: 0, foundWarnings: 1 });
});

it('standalone with `maxWarnings` in option overrides config', async (t) => {
	const { maxWarningsExceeded } = await standalone({
		code: 'a {}',
		config: {
			maxWarnings: 0,
			quiet: true,
			rules: {
				'block-no-empty': true,
			},
		},
		maxWarnings: 1,
	});

	t.assert.strictEqual(maxWarningsExceeded, undefined);
});
