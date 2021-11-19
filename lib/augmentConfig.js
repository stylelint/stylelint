'use strict';

const configurationError = require('./utils/configurationError');
const getModulePath = require('./utils/getModulePath');
const globjoin = require('globjoin');
const micromatch = require('micromatch');
const normalizeAllRuleSettings = require('./normalizeAllRuleSettings');
const normalizePath = require('normalize-path');
const path = require('path');

/** @typedef {import('stylelint').ConfigPlugins} StylelintConfigPlugins */
/** @typedef {import('stylelint').ConfigProcessor} StylelintConfigProcessor */
/** @typedef {import('stylelint').ConfigProcessors} StylelintConfigProcessors */
/** @typedef {import('stylelint').ConfigRules} StylelintConfigRules */
/** @typedef {import('stylelint').ConfigOverride} StylelintConfigOverride */
/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').Config} StylelintConfig */
/** @typedef {import('stylelint').CosmiconfigResult} StylelintCosmiconfigResult */
/** @typedef {import('stylelint').CodeProcessor} StylelintCodeProcessor */
/** @typedef {import('stylelint').ResultProcessor} StylelintResultProcessor */

/**
 * - Merges config and stylelint options
 * - Makes all paths absolute
 * - Merges extends
 * @param {StylelintInternalApi} stylelint
 * @param {StylelintConfig} config
 * @param {string} configDir
 * @param {boolean} allowOverrides
 * @param {string} rootConfigDir
 * @param {string} [filePath]
 * @returns {Promise<StylelintConfig>}
 */
async function augmentConfigBasic(
	stylelint,
	config,
	configDir,
	allowOverrides,
	rootConfigDir,
	filePath,
) {
	let augmentedConfig = config;

	if (allowOverrides) {
		augmentedConfig = addOptions(stylelint, augmentedConfig);
	}

	if (filePath) {
		augmentedConfig = applyOverrides(augmentedConfig, rootConfigDir, filePath);
	}

	augmentedConfig = await extendConfig(
		stylelint,
		augmentedConfig,
		configDir,
		rootConfigDir,
		filePath,
	);

	const cwd = stylelint._options.cwd;

	return absolutizePaths(augmentedConfig, configDir, cwd);
}

/**
 * Extended configs need to be run through augmentConfigBasic
 * but do not need the full treatment. Things like pluginFunctions
 * will be resolved and added by the parent config.
 * @param {string} cwd
 * @returns {(cosmiconfigResult?: StylelintCosmiconfigResult) => Promise<StylelintCosmiconfigResult>}
 */
function augmentConfigExtended(cwd) {
	return async (cosmiconfigResult) => {
		if (!cosmiconfigResult) {
			return null;
		}

		const configDir = path.dirname(cosmiconfigResult.filepath || '');
		const { config } = cosmiconfigResult;

		const augmentedConfig = absolutizePaths(config, configDir, cwd);

		return {
			config: augmentedConfig,
			filepath: cosmiconfigResult.filepath,
		};
	};
}

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string} [filePath]
 * @param {StylelintCosmiconfigResult} [cosmiconfigResult]
 * @returns {Promise<StylelintCosmiconfigResult>}
 */
async function augmentConfigFull(stylelint, filePath, cosmiconfigResult) {
	if (!cosmiconfigResult) {
		return null;
	}

	const config = cosmiconfigResult.config;
	const filepath = cosmiconfigResult.filepath;

	const configDir = stylelint._options.configBasedir || path.dirname(filepath || '');

	let augmentedConfig = await augmentConfigBasic(
		stylelint,
		config,
		configDir,
		true,
		configDir,
		filePath,
	);

	augmentedConfig = addPluginFunctions(augmentedConfig);
	augmentedConfig = addProcessorFunctions(augmentedConfig);

	if (!augmentedConfig.rules) {
		throw configurationError(
			'No rules found within configuration. Have you provided a "rules" property?',
		);
	}

	augmentedConfig = normalizeAllRuleSettings(augmentedConfig);

	return {
		config: augmentedConfig,
		filepath: cosmiconfigResult.filepath,
	};
}

/**
 * Make all paths in the config absolute:
 * - ignoreFiles
 * - plugins
 * - processors
 * (extends handled elsewhere)
 * @param {StylelintConfig} config
 * @param {string} configDir
 * @param {string} cwd
 * @returns {StylelintConfig}
 */
function absolutizePaths(config, configDir, cwd) {
	if (config.ignoreFiles) {
		config.ignoreFiles = [config.ignoreFiles].flat().map((glob) => {
			if (path.isAbsolute(glob.replace(/^!/, ''))) return glob;

			return globjoin(configDir, glob);
		});
	}

	if (config.plugins) {
		config.plugins = [config.plugins].flat().map((lookup) => getModulePath(configDir, lookup, cwd));
	}

	if (config.processors) {
		config.processors = absolutizeProcessors(config.processors, configDir);
	}

	return config;
}

/**
 * Processors are absolutized in their own way because
 * they can be and return a string or an array
 * @param {StylelintConfigProcessors} processors
 * @param {string} configDir
 * @return {StylelintConfigProcessors}
 */
function absolutizeProcessors(processors, configDir) {
	const normalizedProcessors = Array.isArray(processors) ? processors : [processors];

	return normalizedProcessors.map((item) => {
		if (typeof item === 'string') {
			return getModulePath(configDir, item);
		}

		return [getModulePath(configDir, item[0]), item[1]];
	});
}

/**
 * @param {StylelintInternalApi} stylelint
 * @param {StylelintConfig} config
 * @param {string} configDir
 * @param {string} rootConfigDir
 * @param {string} [filePath]
 * @return {Promise<StylelintConfig>}
 */
async function extendConfig(stylelint, config, configDir, rootConfigDir, filePath) {
	if (config.extends === undefined) {
		return config;
	}

	const { extends: configExtends, ...originalWithoutExtends } = config;
	const normalizedExtends = [configExtends].flat();

	let resultConfig = originalWithoutExtends;

	for (const extendLookup of normalizedExtends) {
		const extendResult = await loadExtendedConfig(stylelint, configDir, extendLookup);

		if (extendResult) {
			let extendResultConfig = extendResult.config;
			const extendConfigDir = path.dirname(extendResult.filepath || '');

			extendResultConfig = await augmentConfigBasic(
				stylelint,
				extendResultConfig,
				extendConfigDir,
				false,
				rootConfigDir,
				filePath,
			);

			resultConfig = mergeConfigs(resultConfig, extendResultConfig);
		}
	}

	return mergeConfigs(resultConfig, originalWithoutExtends);
}

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string} configDir
 * @param {string} extendLookup
 * @return {Promise<StylelintCosmiconfigResult>}
 */
function loadExtendedConfig(stylelint, configDir, extendLookup) {
	const extendPath = getModulePath(configDir, extendLookup, stylelint._options.cwd);

	return stylelint._extendExplorer.load(extendPath);
}

/**
 * When merging configs (via extends)
 * - plugin and processor arrays are joined
 * - rules are merged via Object.assign, so there is no attempt made to
 *   merge any given rule's settings. If b contains the same rule as a,
 *   b's rule settings will override a's rule settings entirely.
 * - Everything else is merged via Object.assign
 * @param {StylelintConfig} a
 * @param {StylelintConfig} b
 * @returns {StylelintConfig}
 */
function mergeConfigs(a, b) {
	/** @type {{plugins: StylelintConfigPlugins}} */
	const pluginMerger = {};

	if (a.plugins || b.plugins) {
		pluginMerger.plugins = [];

		if (a.plugins) {
			pluginMerger.plugins = pluginMerger.plugins.concat(a.plugins);
		}

		if (b.plugins) {
			pluginMerger.plugins = [...new Set(pluginMerger.plugins.concat(b.plugins))];
		}
	}

	/** @type {{processors: StylelintConfigProcessors}} */
	const processorMerger = {};

	if (a.processors || b.processors) {
		processorMerger.processors = [];

		if (a.processors) {
			processorMerger.processors = processorMerger.processors.concat(a.processors);
		}

		if (b.processors) {
			processorMerger.processors = [...new Set(processorMerger.processors.concat(b.processors))];
		}
	}

	/** @type {{overrides: StylelintConfigOverride[]}} */
	const overridesMerger = {};

	if (a.overrides || b.overrides) {
		overridesMerger.overrides = [];

		if (a.overrides) {
			overridesMerger.overrides = overridesMerger.overrides.concat(a.overrides);
		}

		if (b.overrides) {
			overridesMerger.overrides = [...new Set(overridesMerger.overrides.concat(b.overrides))];
		}
	}

	const rulesMerger = {};

	if (a.rules || b.rules) {
		rulesMerger.rules = { ...a.rules, ...b.rules };
	}

	const result = {
		...a,
		...b,
		...processorMerger,
		...pluginMerger,
		...overridesMerger,
		...rulesMerger,
	};

	return result;
}

/**
 * @param {StylelintConfig} config
 * @returns {StylelintConfig}
 */
function addPluginFunctions(config) {
	if (!config.plugins) {
		return config;
	}

	const normalizedPlugins = [config.plugins].flat();

	/** @type {{[k: string]: Function}} */
	const pluginFunctions = {};

	for (const pluginLookup of normalizedPlugins) {
		let pluginImport = require(pluginLookup);

		// Handle either ES6 or CommonJS modules
		pluginImport = pluginImport.default || pluginImport;

		// A plugin can export either a single rule definition
		// or an array of them
		const normalizedPluginImport = [pluginImport].flat();

		for (const pluginRuleDefinition of normalizedPluginImport) {
			if (!pluginRuleDefinition.ruleName) {
				throw configurationError(
					`stylelint requires plugins to expose a ruleName. The plugin "${pluginLookup}" is not doing this, so will not work with stylelint. Please file an issue with the plugin.`,
				);
			}

			if (!pluginRuleDefinition.ruleName.includes('/')) {
				throw configurationError(
					`stylelint requires plugin rules to be namespaced, i.e. only \`plugin-namespace/plugin-rule-name\` plugin rule names are supported. The plugin rule "${pluginRuleDefinition.ruleName}" does not do this, so will not work. Please file an issue with the plugin.`,
				);
			}

			pluginFunctions[pluginRuleDefinition.ruleName] = pluginRuleDefinition.rule;
		}
	}

	config.pluginFunctions = pluginFunctions;

	return config;
}

/**
 * Given an array of processors strings, we want to add two
 * properties to the augmented config:
 * - codeProcessors: functions that will run on code as it comes in
 * - resultProcessors: functions that will run on results as they go out
 *
 * To create these properties, we need to:
 * - Find the processor module
 * - Initialize the processor module by calling its functions with any
 *   provided options
 * - Push the processor's code and result processors to their respective arrays
 * @type {Map<string, string | Object>}
 */
const processorCache = new Map();

/**
 * @param {StylelintConfig} config
 * @return {StylelintConfig}
 */
function addProcessorFunctions(config) {
	if (!config.processors) return config;

	/** @type {StylelintCodeProcessor[]} */
	const codeProcessors = [];
	/** @type {StylelintResultProcessor[]} */
	const resultProcessors = [];

	for (const processorConfig of [config.processors].flat()) {
		const processorKey = JSON.stringify(processorConfig);

		let initializedProcessor;

		if (processorCache.has(processorKey)) {
			initializedProcessor = processorCache.get(processorKey);
		} else {
			const processorLookup =
				typeof processorConfig === 'string' ? processorConfig : processorConfig[0];
			const processorOptions = typeof processorConfig === 'string' ? undefined : processorConfig[1];
			let processor = require(processorLookup);

			processor = processor.default || processor;
			initializedProcessor = processor(processorOptions);
			processorCache.set(processorKey, initializedProcessor);
		}

		if (initializedProcessor && initializedProcessor.code) {
			codeProcessors.push(initializedProcessor.code);
		}

		if (initializedProcessor && initializedProcessor.result) {
			resultProcessors.push(initializedProcessor.result);
		}
	}

	config.codeProcessors = codeProcessors;
	config.resultProcessors = resultProcessors;

	return config;
}

/**
 * @param {StylelintConfig} fullConfig
 * @param {string} rootConfigDir
 * @param {string} filePath
 * @return {StylelintConfig}
 */
function applyOverrides(fullConfig, rootConfigDir, filePath) {
	let { overrides, ...config } = fullConfig;

	if (!overrides) {
		return config;
	}

	if (!Array.isArray(overrides)) {
		throw new TypeError(
			'The `overrides` configuration property should be an array, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
		);
	}

	for (const override of overrides) {
		const { files, ...configOverrides } = override;

		if (!files) {
			throw new Error(
				'Every object in the `overrides` configuration property should have a `files` property with globs, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
			);
		}

		const filesGlobs = [files]
			.flat()
			.map((glob) => {
				if (path.isAbsolute(glob.replace(/^!/, ''))) {
					return glob;
				}

				return globjoin(rootConfigDir, glob);
			})
			// Glob patterns for micromatch should be in POSIX-style
			.map((s) => normalizePath(s));

		if (micromatch.isMatch(filePath, filesGlobs, { dot: true })) {
			config = mergeConfigs(config, configOverrides);
		}
	}

	return config;
}

/**
 * Add options to the config
 *
 * @param {StylelintInternalApi} stylelint
 * @param {StylelintConfig} config
 *
 * @returns {StylelintConfig}
 */
function addOptions(stylelint, config) {
	const augmentedConfig = {
		...config,
	};

	if (stylelint._options.ignoreDisables) {
		augmentedConfig.ignoreDisables = stylelint._options.ignoreDisables;
	}

	if (stylelint._options.quiet) {
		augmentedConfig.quiet = stylelint._options.quiet;
	}

	if (stylelint._options.reportNeedlessDisables) {
		augmentedConfig.reportNeedlessDisables = stylelint._options.reportNeedlessDisables;
	}

	if (stylelint._options.reportInvalidScopeDisables) {
		augmentedConfig.reportInvalidScopeDisables = stylelint._options.reportInvalidScopeDisables;
	}

	if (stylelint._options.reportDescriptionlessDisables) {
		augmentedConfig.reportDescriptionlessDisables =
			stylelint._options.reportDescriptionlessDisables;
	}

	if (stylelint._options.customSyntax) {
		augmentedConfig.customSyntax = stylelint._options.customSyntax;
	}

	return augmentedConfig;
}

module.exports = { augmentConfigExtended, augmentConfigFull, applyOverrides };
