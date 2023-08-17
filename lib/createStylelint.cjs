'use strict';

const process = require('node:process');
const cosmiconfig = require('cosmiconfig');
const FileCache = require('./utils/FileCache.cjs');
const augmentConfig = require('./augmentConfig.cjs');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/**
 * @type {import('stylelint')['_createLinter']}
 */
function createStylelint(options = {}) {
	const cwd = options.cwd || process.cwd();

	return {
		_options: { ...options, cwd },

		_extendExplorer: cosmiconfig.cosmiconfig('', {
			transform: augmentConfig.augmentConfigExtended(cwd),
			loaders: {
				'.cjs': (cjsPath, cjsContent) =>
					Promise.resolve(cosmiconfig.defaultLoadersSync['.cjs'](cjsPath, cjsContent)),
				'.js': (jsPath, cjsContent) =>
					Promise.resolve(cosmiconfig.defaultLoadersSync['.js'](jsPath, cjsContent)),
			},
			stopDir: STOP_DIR,
		}),

		_specifiedConfigCache: new Map(),
		_postcssResultCache: new Map(),
		_fileCache: new FileCache(options.cacheLocation, options.cacheStrategy, cwd),
	};
}

module.exports = createStylelint;
