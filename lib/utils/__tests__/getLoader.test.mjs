import { describe, it } from 'node:test';

import getLoader from '../getLoader.mjs';

describe('getLoader', () => {
	it('returns a loader for `postcss-import`', async (t) => {
		const loader = await getLoader('postcss-import');

		t.assert.ok(loader);
	});

	it('returns a loader for a esm loader', async (t) => {
		const loader = await getLoader(
			'./__tests__/fixtures/node_modules/@stylelint/loader-a/index.mjs',
		);

		t.assert.ok(loader);
	});

	it('returns a loader for a cjs loader', async (t) => {
		const loader = await getLoader(
			'./__tests__/fixtures/node_modules/@stylelint/loader-b/index.cjs',
		);

		t.assert.ok(loader);
	});

	it('returns the same loader function as provided directly', async (t) => {
		const loader = () => {
			return {
				postcssPlugin: 'loader',
				Once() {
					// do nothing
				},
			};
		};

		loader.postcss = true;

		const loaderB = await getLoader(loader);

		t.assert.ok(loaderB);
		t.assert.strictEqual(loader, loaderB);
	});

	it('returns the same loader object as provided directly', async (t) => {
		const loader = {
			postcssPlugin: 'loader',
			Once() {
				// do nothing
			},
		};

		const loaderB = await getLoader(loader);

		t.assert.ok(loaderB);
		t.assert.strictEqual(loader, loaderB);
	});

	it('throws when not a plugin', async (t) => {
		const { message } = await getLoader(false).catch((e) => e);

		t.assert.ok(message.includes('Loader must be a string or a PostCSS plugin'));
	});
});
