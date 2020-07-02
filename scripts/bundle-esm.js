'use strict';

/* eslint-disable node/no-extraneous-require -- these are all installed as part of `parcel` */

const bundleReport = require('@parcel/reporter-cli/lib/bundleReport').default;
const defaultConfigContents = require('@parcel/config-default');
const defaultConfigFilePath = require.resolve('@parcel/config-default');
const Parcel = require('@parcel/core').default;
const { createWorkerFarm } = require('@parcel/core');

/* eslint-enable node/no-extraneous-require */

// TODO: maybe it's worth verifying that all syntaxes are bundled?
// Though this is unlikely to change very often.

const config = {
	browser: {
		target: { distDir: 'dist' },
		entry: 'lib/browser.js',
	},
	'syntax-css-in-js': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-css-in-js.js',
	},
	'syntax-html': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-html.js',
	},
	'syntax-less': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-less.js',
	},
	'syntax-markdown': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-markdown.js',
	},
	'syntax-sass': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-sass.js',
	},
	'syntax-scss': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-scss.js',
	},
	'syntax-sugarss': {
		target: { distDir: 'dist' },
		entry: 'lib/syntaxes/syntax-sugarss.js',
	},
};

// Workers have a startup cost. We can keep the workers around between runs,
// then shut them down when all bundles have been created.
let workerFarm = createWorkerFarm();

let tasks = [];

// eslint-disable-next-line guard-for-in -- meh
for (const module in config) {
	let task = async () => {
		let bundler = new Parcel({
			entries: config[module].entry,
			targets: { [module]: config[module].target },
			defaultConfig: {
				...defaultConfigContents,
				filePath: defaultConfigFilePath,
			},
			defaultEngines: {
				browsers: ['> 0.25%'],
			},
			includeNodeModules: true,
			isLibrary: false,
			logLevel: 'warn',
			minify: true,
			mode: 'production',
			outputFormat: 'esmodule',
			patchConsole: false,
			workerFarm,
		});

		const bundleGraph = await bundler.run();
		const options = bundler._getResolvedParcelOptions(); // hackety hack. Not a public API

		// log stats to console. This is similar to setting `logLevel: verbose`, but skips the progress spinner to avoid unnecessary output
		await bundleReport(bundleGraph, options.outputFS, options.projectRoot, options.detailedReport);

		return bundleGraph;
	};

	tasks.push(task);
}

(async () => {
	try {
		for (const task of tasks) {
			await task();
		}
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
	} finally {
		await workerFarm.end(); // finished bundling, so we can shut the farm.
	}
})();
