'use strict';

const configurationError = require('./utils/configurationError');
const path = require('path');
const { augmentConfigFull } = require('./augmentConfig');
const { cosmiconfig } = require('cosmiconfig');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').Config} StylelintConfig */
/** @typedef {import('stylelint').CosmiconfigResult} StylelintCosmiconfigResult */

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string} [searchPath]
 * @param {string} [filePath]
 * @returns {Promise<StylelintCosmiconfigResult>}
 */
module.exports = async function getConfigForFile(stylelint, searchPath = process.cwd(), filePath) {
	const optionsConfig = stylelint._options.config;

	if (optionsConfig !== undefined) {
		const cached = stylelint._specifiedConfigCache.get(optionsConfig);

		// If config has overrides the resulting config might be different for some files.
		// Cache results only if resulted config is the same for all linted files.
		if (cached && !optionsConfig.overrides) {
			return cached;
		}

		const augmentedResult = augmentConfigFull(stylelint, filePath, {
			config: optionsConfig,
			// Add the extra path part so that we can get the directory without being
			// confused
			filepath: path.join(process.cwd(), 'argument-config'),
		});

		stylelint._specifiedConfigCache.set(optionsConfig, augmentedResult);

		return augmentedResult;
	}

	const configExplorer = cosmiconfig('stylelint', {
		transform: (cosmiconfigResult) => augmentConfigFull(stylelint, filePath, cosmiconfigResult),
		stopDir: STOP_DIR,
	});

	let config = stylelint._options.configFile
		? await configExplorer.load(stylelint._options.configFile)
		: await configExplorer.search(searchPath);

	if (!config) {
		config = await configExplorer.search(process.cwd());
	}

	if (!config) {
		return Promise.reject(
			configurationError(`No configuration provided${searchPath ? ` for ${searchPath}` : ''}`),
		);
	}

	return config;
};
