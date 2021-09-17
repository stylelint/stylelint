'use strict';

const augmentConfig = require('./augmentConfig');
const createStylelintResult = require('./createStylelintResult');
const getConfigForFile = require('./getConfigForFile');
const getPostcssResult = require('./getPostcssResult');
const isPathIgnored = require('./isPathIgnored');
const lintSource = require('./lintSource');
const path = require('path');
const { cosmiconfig } = require('cosmiconfig');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? path.resolve(__dirname, '..') : undefined;

/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */

/**
 * The stylelint "internal API" is passed among functions
 * so that methods on a stylelint instance can invoke
 * each other while sharing options and caches
 * @param {import('stylelint').StylelintStandaloneOptions} options
 * @returns {StylelintInternalApi}
 */
module.exports = function createStylelint(options = {}) {
	/** @type {Partial<StylelintInternalApi>} */
	const stylelint = { _options: options };

	// @ts-ignore TODO TYPES found out which cosmiconfig types are valid
	stylelint._extendExplorer = cosmiconfig(null, {
		transform: augmentConfig.augmentConfigExtended.bind(
			null,
			/** @type {StylelintInternalApi} */ (stylelint),
		),
		stopDir: STOP_DIR,
	});

	stylelint._specifiedConfigCache = new Map();
	stylelint._postcssResultCache = new Map();
	stylelint._createStylelintResult = createStylelintResult.bind(
		null,
		/** @type {StylelintInternalApi} */ (stylelint),
	);
	stylelint._getPostcssResult = getPostcssResult.bind(
		null,
		/** @type {StylelintInternalApi} */ (stylelint),
	);
	stylelint._lintSource = lintSource.bind(null, /** @type {StylelintInternalApi} */ (stylelint));

	stylelint.getConfigForFile = getConfigForFile.bind(
		null,
		/** @type {StylelintInternalApi} */ (stylelint),
	);
	stylelint.isPathIgnored = isPathIgnored.bind(
		null,
		/** @type {StylelintInternalApi} */ (stylelint),
	);

	return /** @type {StylelintInternalApi} */ (stylelint);
};
