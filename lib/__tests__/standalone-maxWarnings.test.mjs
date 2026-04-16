import path from 'node:path';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = replaceBackslashes(new URL('./fixtures', import.meta.url));

it('standalone with input css and `maxWarnings`', async () => {
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

	expect(maxWarningsExceeded).toMatchObject({ maxWarnings: 0, foundWarnings: 1 });
});

it('standalone with input file(s) and `maxWarnings`', async () => {
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

	expect(maxWarningsExceeded).toMatchObject({ maxWarnings: 0, foundWarnings: 1 });
});

it('standalone with `maxWarnings` in config', async () => {
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

	expect(maxWarningsExceeded).toMatchObject({ maxWarnings: 0, foundWarnings: 1 });
});

it('standalone with `maxWarnings` in option overrides config', async () => {
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

	expect(maxWarningsExceeded).toBeUndefined();
});
