import { join } from 'node:path';
import process from 'node:process';

import { cosmiconfig } from 'cosmiconfig';

import { ConfigurationError } from './utils/errors.mjs';
import { augmentConfigFull } from './augmentConfig.mjs';

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/** @import {Config as StylelintConfig, CosmiconfigResult as StylelintCosmiconfigResult, InternalApi as StylelintInternalApi} from 'stylelint' */

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

	if (optionsConfig) {
		const filePathAsCacheKey = filePath ?? '';
		/** @type {Map<string, StylelintCosmiconfigResult>} */
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
		throw new ConfigurationError(
			`No configuration provided${searchPath ? ` for ${searchPath}` : ''}`,
		);
	}

	return config;
}
