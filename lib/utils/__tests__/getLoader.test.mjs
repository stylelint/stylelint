import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import getLoader from '../getLoader.mjs';

describe('getLoader', () => {
	it('returns a loader for `postcss-import`', async () => {
		const loader = await getLoader('postcss-import');

		assert.ok(loader);
	});

	it('returns a loader for a esm loader', async () => {
		const loader = await getLoader(
			'./__tests__/fixtures/node_modules/@stylelint/loader-a/index.mjs',
		);

		assert.ok(loader);
	});

	it('returns a loader for a cjs loader', async () => {
		const loader = await getLoader(
			'./__tests__/fixtures/node_modules/@stylelint/loader-b/index.cjs',
		);

		assert.ok(loader);
	});

	it('returns the same loader function as provided directly', async () => {
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

		assert.ok(loaderB);
		assert.equal(loader, loaderB);
	});

	it('returns the same loader object as provided directly', async () => {
		const loader = {
			postcssPlugin: 'loader',
			Once() {
				// do nothing
			},
		};

		const loaderB = await getLoader(loader);

		assert.ok(loaderB);
		assert.equal(loader, loaderB);
	});

	it('throws when not a plugin', async () => {
		const { message } = await getLoader(false).catch((e) => e);

		assert.ok(message.includes('Loader must be a string or a PostCSS plugin'));
	});
});
