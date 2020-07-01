'use strict';

/* eslint-disable no-console */
/* eslint-disable guard-for-in */
/* eslint-disable node/no-extraneous-require */

const defaultConfigContents = require('@parcel/config-default');
const Parcel = require('@parcel/core').default;
const { createWorkerFarm } = require('@parcel/core');

const config = {
	browser: {
		target: { distDir: 'dist' },
		entry: 'lib/browser.js',
		// dest: 'dist/stylelint-esm.js',
	},
	'syntax-css-in-js': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-less.js',
		// dest: 'dist/syntax-less.js',
	},
	'syntax-html': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-html.js',
	},
	'syntax-less': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-less.js',
		// dest: 'dist/syntax-less.js',
	},
	'syntax-markdown': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-markdown.js',
		// dest: 'dist/syntax-markdown.js',
	},
	'syntax-sass': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-sass.js',
		// dest: 'dist/syntax-sass.js',
	},
	'syntax-scss': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-scss.js',
		// dest: 'dist/syntax-scss.js',
	},
	'syntax-sugarss': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-sugarss.js',
		// dest: 'dist/syntax-sugarss.js',
	},
};

let tasks = [];
let workerFarm = createWorkerFarm();

for (const module in config) {
	let task = async () => {
		let bundler = new Parcel({
			entries: config[module].entry,
			targets: { [module]: config[module].target },
			defaultConfig: {
				...defaultConfigContents,
				filePath: require.resolve('@parcel/config-default'),
			},
			defaultEngines: {
				browsers: ['> 0.25%'],
			},
			includeNodeModules: true,
			isLibrary: false,
			logLevel: 'verbose',
			minify: true,
			mode: 'production',
			outputFormat: 'esmodule',
			patchConsole: false,
			workerFarm,
		});

		return await bundler.run();
	};

	tasks.push([module, task]);
}

(async () => {
	try {
		for (const [module, task] of tasks) {
			const res = await task();

			console.log(res.getBundles()[0].stats);
			console.log(`bundled ${module}`, res);
		}
	} catch (error) {
		console.error(error);
	} finally {
		await workerFarm.end();
	}
})();

/* eslint-enable no-console */
/* eslint-enable guard-for-in */
/* eslint-enable node/no-extraneous-require */

// tasks = [
//   async () => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log(`waited: 1000ms`);
//   },
//   async () => {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     console.log(`waited: 500ms`);
//   },
// ];
