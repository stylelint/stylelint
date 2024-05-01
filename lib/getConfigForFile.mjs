import { join } from 'node:path';
import process from 'node:process';

import { cosmiconfig } from 'cosmiconfig';

import { augmentConfigFull } from './augmentConfig.mjs';
import configurationError from './utils/configurationError.mjs';

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
export default async function getConfigForFile(
	stylelint,
	searchPath = stylelint._options.cwd,
	filePath,
) {
	const optionsConfig = stylelint._options.config;
	const cwd = stylelint._options.cwd;

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
			filepath: join(cwd, 'argument-config'),
		});

		stylelint._specifiedConfigCache.set(optionsConfig, augmentedResult);

		return augmentedResult;
	}

	const configExplorer = cosmiconfig('stylelint', {
		transform: (cosmiconfigResult) => augmentConfigFull(stylelint, filePath, cosmiconfigResult),
		stopDir: STOP_DIR,
		searchStrategy: 'global', // for backward compatibility
	});

	let config = stylelint._options.configFile
		? await configExplorer.load(stylelint._options.configFile)
		: await configExplorer.search(searchPath);

	if (!config) {
		config = await configExplorer.search(cwd);
	}

	if (!config) {
		return Promise.reject(
			configurationError(`No configuration provided${searchPath ? ` for ${searchPath}` : ''}`),
		);
	}

	return config;
}
