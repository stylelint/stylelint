'use strict';

const configurationError = require('./utils/configurationError');
const path = require('path');
const { augmentConfigFull } = require('./augmentConfig');
const { cosmiconfig } = require('cosmiconfig');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? path.resolve(__dirname, '..') : undefined;

/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').StylelintConfig} StylelintConfig */
/** @typedef {import('stylelint').CosmiconfigResult} CosmiconfigResult */
/** @typedef {Promise<CosmiconfigResult | null>} ConfigPromise  */

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string} [searchPath]
 * @param {string} [filePath]
 * @returns {ConfigPromise}
 */
module.exports = function getConfigForFile(stylelint, searchPath = process.cwd(), filePath) {
	const optionsConfig = stylelint._options.config;

	if (optionsConfig !== undefined) {
		const cached = /** @type {ConfigPromise} */ (
			stylelint._specifiedConfigCache.get(optionsConfig)
		);

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
		// @ts-ignore TODO TYPES found out which cosmiconfig types are valid
		// transform: augmentConfigFull.bind(null, stylelint, filePath),
		transform: (cosmiconfigResult) => augmentConfigFull(stylelint, filePath, cosmiconfigResult),
		stopDir: STOP_DIR,
	});

	const searchForConfig = stylelint._options.configFile
		? configExplorer.load(stylelint._options.configFile)
		: configExplorer.search(searchPath);

	return /** @type {ConfigPromise} */ (
		searchForConfig
			.then((config) => {
				// If no config was found, try looking from process.cwd
				if (!config) return configExplorer.search(process.cwd());

				return config;
			})
			.then((config) => {
				if (!config) {
					const ending = searchPath ? ` for ${searchPath}` : '';

					throw configurationError(`No configuration provided${ending}`);
				}

				return config;
			})
	);
};
