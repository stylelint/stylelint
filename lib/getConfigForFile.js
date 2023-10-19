'use strict';

const path = require('path');
const { cosmiconfig, defaultLoadersSync } = require('cosmiconfig');

const configurationError = require('./utils/configurationError');
const { augmentConfigFull } = require('./augmentConfig');
const { assert } = require('./utils/validateTypes');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').CosmiconfigResult} StylelintCosmiconfigResult */

/**
 * @param {StylelintInternalApi} instance
 * @param {string} [filepath]
 */
const getAugmentedConfig = (instance, filepath) => {
	const { config, cwd } = instance._options;

	assert(config);
	const cached = instance._specifiedConfigCache.get(config);

	// If config has overrides the resulting config might be different for some files.
	// Cache results only if resulted config is the same for all linted files.
	if (cached && !config.overrides) {
		return cached;
	}

	const augmentedResult = augmentConfigFull(instance, filepath, {
		config,
		// Add the extra path part so that we can get the directory without being
		// confused
		filepath: path.join(cwd, 'argument-config'),
	});

	instance._specifiedConfigCache.set(config, augmentedResult);

	return augmentedResult;
};

/**
 * @param {StylelintInternalApi} instance
 * @param {{ searchPath: string, filePath?: string }} opts
 */
const createCosmiconfig = async (instance, opts) => {
	const { configFile, cwd } = instance._options;
	const configExplorer = cosmiconfig('stylelint', {
		transform: (cosmiconfigResult) => augmentConfigFull(instance, opts.filePath, cosmiconfigResult),
		loaders: {
			'.cjs': (cjsPath, cjsContent) =>
				Promise.resolve(defaultLoadersSync['.cjs'](cjsPath, cjsContent)),
			'.js': (jsPath, cjsContent) => Promise.resolve(defaultLoadersSync['.js'](jsPath, cjsContent)),
		},
		stopDir: STOP_DIR,
	});

	let config = configFile
		? await configExplorer.load(configFile)
		: await configExplorer.search(opts.searchPath);

	if (!config) {
		config = await configExplorer.search(cwd);
	}

	if (!config) {
		return Promise.reject(
			configurationError(
				`No configuration provided${opts.searchPath ? ` for ${opts.searchPath}` : ''}`,
			),
		);
	}

	return config;
};

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string} [searchPath]
 * @param {string} [filePath]
 * @returns {Promise<StylelintCosmiconfigResult>}
 */
module.exports = async function getConfigForFile(
	stylelint,
	searchPath = stylelint._options.cwd,
	filePath,
) {
	const { config, mergeRules } = stylelint._options;

	if (config && !mergeRules) {
		return getAugmentedConfig(stylelint, filePath);
	}

	const cosmiconfigResult = await createCosmiconfig(stylelint, { filePath, searchPath });

	if (config?.rules && mergeRules) {
		cosmiconfigResult.config.rules = { ...cosmiconfigResult.config.rules, ...config.rules };
		config.rules = cosmiconfigResult.config.rules;
		// merging rules ought to be only performed once
		// i.e. on the second call the config can be cached
		// e.g. lintSource calls getConfigForFile twice
		stylelint._options.mergeRules = false;
	}

	return cosmiconfigResult;
};
