import { join } from 'node:path';
import process from 'node:process';

import { cosmiconfig } from 'cosmiconfig';

import { assert } from './utils/validateTypes.mjs';
import { augmentConfigFull } from './augmentConfig.mjs';
import configurationError from './utils/configurationError.mjs';

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').Config} StylelintConfig */
/** @typedef {import('stylelint').CosmiconfigResult} StylelintCosmiconfigResult */

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string} [filePath]
 */
const getAugmentedConfig = (stylelint, filePath) => {
	const { config, cwd } = stylelint._options;

	assert(config);
	const cached = stylelint._specifiedConfigCache.get(config);

	// If config has overrides the resulting config might be different for some files.
	// Cache results only if resulted config is the same for all linted files.
	if (cached && !config.overrides) {
		return cached;
	}

	const augmentedResult = augmentConfigFull(stylelint, filePath, {
		config,
		// Add the extra path part so that we can get the directory without being
		// confused
		filepath: join(cwd, 'argument-config'),
	});

	stylelint._specifiedConfigCache.set(config, augmentedResult);

	return augmentedResult;
};

/**
 * @param {StylelintInternalApi} stylelint
 * @param {{ searchPath: string, filePath?: string }} opts
 */
const createCosmiconfig = async (stylelint, { filePath, searchPath }) => {
	const { configFile, cwd } = stylelint._options;
	const configExplorer = cosmiconfig('stylelint', {
		transform: (cosmiconfigResult) => augmentConfigFull(stylelint, filePath, cosmiconfigResult),
		stopDir: STOP_DIR,
		searchStrategy: 'global', // for backward compatibility
	});

	let config = configFile
		? await configExplorer.load(configFile)
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
};

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
}
