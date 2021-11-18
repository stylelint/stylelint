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

/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */

/**
 * The stylelint "internal API" is passed among functions
 * so that methods on a stylelint instance can invoke
 * each other while sharing options and caches.
 *
 * @param {import('stylelint').LinterOptions} options
 * @returns {StylelintInternalApi}
 */
function createStylelint(options = {}) {
	const cwd = options.cwd || process.cwd();

	/** @type {StylelintInternalApi} */
	// @ts-expect-error -- TS2740: Type '{ _options: LinterOptions; }' is missing the following properties from type 'InternalApi'
	const stylelint = { _options: { ...options, cwd } };

	stylelint._extendExplorer = cosmiconfig('', {
		transform: augmentConfig.augmentConfigExtended(cwd),
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
}

module.exports = /** @type {typeof import('stylelint').createLinter} */ (createStylelint);
