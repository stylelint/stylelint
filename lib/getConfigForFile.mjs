import { join } from 'node:path';

import { ConfigurationError } from './utils/errors.mjs';
import { augmentConfigFull } from './augmentConfig.mjs';
import normalizeFilePath from './utils/normalizeFilePath.mjs';

/** @import {CosmiconfigResult, InternalApi} from 'stylelint' */

/**
 * Creates a cache key for the augmented config cache.
 *
 * @param {string} configPath Path to the config file
 * @param {string} filePath Path to the target file
 * @returns {string}
 */
function getAugmentedConfigCacheKey(configPath, filePath) {
	return `${configPath || 'no-config'}::${filePath || 'no-file'}`;
}

/**
 * Get a configuration by the following way:
 *
 * 1. If the `config` option is given, it's returned.
 * 2. If the `configFile` option is given, the file's config is returned.
 * 3. If the options above are not given, a config found in `searchPath` is returned.
 *
 * @param {Object} options
 * @param {InternalApi} options.stylelint
 * @param {string} [options.searchPath] - Defaults to `cwd`.
 * @param {string} [options.filePath] - For applying overrides.
 * @param {boolean} [options.failIfNoConfig=true] - Throws an error if a config is not found.
 * @returns {Promise<CosmiconfigResult>}
 */
export default async function getConfigForFile({
	stylelint,
	searchPath = stylelint._options.cwd,
	filePath,
	failIfNoConfig = true,
}) {
	const optionsConfig = stylelint._options.config;
	const cwd = stylelint._options.cwd;

	if (optionsConfig) {
		const filePathAsCacheKey = normalizeFilePath(filePath ?? '');
		/** @type {Map<string, CosmiconfigResult>} */
		const cachedForFiles = stylelint._specifiedConfigCache.get(optionsConfig) ?? new Map();
		const cached = cachedForFiles.get(filePathAsCacheKey);

		if (cached) {
			return cached;
		}

		const augmentedResult = await augmentConfigFull(stylelint, filePath, {
			config: optionsConfig,
			// Add the extra path part so that we can get the directory without being
			// confused
			filepath: join(cwd, 'argument-config'),
		});

		cachedForFiles.set(filePathAsCacheKey, augmentedResult);
		stylelint._specifiedConfigCache.set(optionsConfig, cachedForFiles);

		return augmentedResult;
	}

	const configExplorer = stylelint._configExplorer;

	const configFile = stylelint._options.configFile;

	// First, discover the raw config, cached by cosmiconfig.
	let rawConfig = configFile
		? await configExplorer.load(configFile)
		: await configExplorer.search(searchPath);

	if (!rawConfig) {
		rawConfig = await configExplorer.search(cwd);
	}

	if (!rawConfig && failIfNoConfig) {
		throw new ConfigurationError(
			`No configuration provided${searchPath ? ` for ${searchPath}` : ''}`,
		);
	}

	if (!rawConfig) {
		return rawConfig;
	}

	// Check the augmented config cache.
	const cacheKey = getAugmentedConfigCacheKey(
		rawConfig.filepath,
		filePath ? normalizeFilePath(filePath) : '',
	);

	const cachedAugmented = stylelint._augmentedConfigCache.get(cacheKey);

	if (cachedAugmented) {
		return cachedAugmented;
	}

	// Perform full augmentation.
	const augmentedResult = await augmentConfigFull(stylelint, filePath, rawConfig);

	// Cache the augmented result.
	if (augmentedResult) {
		stylelint._augmentedConfigCache.set(cacheKey, augmentedResult);
	}

	return augmentedResult;
}
