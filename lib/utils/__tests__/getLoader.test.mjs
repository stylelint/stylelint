import getLoader from '../getLoader.mjs';

describe('getLoader', () => {
	it('returns a loader for `postcss-import`', async () => {
		const loader = await getLoader('postcss-import');

		expect(loader).toBeTruthy();
	});

	it('returns a loader for a esm loader', async () => {
		const loader = await getLoader('./__tests__/fixtures/node_modules/@stylelint/loader-a');

		expect(loader).toBeTruthy();
	});

	it('returns a loader for a cjs loader', async () => {
		const loader = await getLoader('./__tests__/fixtures/node_modules/@stylelint/loader-b');

		expect(loader).toBeTruthy();
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

		expect(loaderB).toBeTruthy();
		expect(loader).toBe(loaderB);
	});

	it('returns the same loader object as provided directly', async () => {
		const loader = {
			postcssPlugin: 'loader',
			Once() {
				// do nothing
			},
		};

		const loaderB = await getLoader(loader);

		expect(loaderB).toBeTruthy();
		expect(loader).toBe(loaderB);
	});

	it('throws when not a plugin', async () => {
		const { message } = await getLoader(false).catch((e) => e);

		expect(message).toContain('Loader must be a string or a PostCSS plugin');
	});
});
