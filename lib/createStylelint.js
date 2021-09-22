'use strict';

const augmentConfig = require('./augmentConfig');
const createStylelintResult = require('./createStylelintResult');
const getConfigForFile = require('./getConfigForFile');
const getPostcssResult = require('./getPostcssResult');
const isPathIgnored = require('./isPathIgnored');
const lintSource = require('./lintSource');
const { cosmiconfig } = require('cosmiconfig');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */

/**
 * The stylelint "internal API" is passed among functions
 * so that methods on a stylelint instance can invoke
 * each other while sharing options and caches.
 *
 * @param {import('stylelint').StylelintStandaloneOptions} options
 * @returns {StylelintInternalApi}
 */
module.exports = function createStylelint(options = {}) {
	/** @type {StylelintInternalApi} */
	// @ts-expect-error -- TS2740: Type '{ _options: StylelintStandaloneOptions; }' is missing the following properties from type 'StylelintInternalApi'
	const stylelint = { _options: options };

	stylelint._extendExplorer = cosmiconfig('', {
		transform: augmentConfig.augmentConfigExtended.bind(null, stylelint),
		stopDir: STOP_DIR,
	});

	stylelint._specifiedConfigCache = new Map();
	stylelint._postcssResultCache = new Map();
	stylelint._createStylelintResult = createStylelintResult.bind(null, stylelint);
	stylelint._getPostcssResult = getPostcssResult.bind(null, stylelint);
	stylelint._lintSource = lintSource.bind(null, stylelint);

	stylelint.getConfigForFile = getConfigForFile.bind(null, stylelint);
	stylelint.isPathIgnored = isPathIgnored.bind(null, stylelint);

	return stylelint;
};
