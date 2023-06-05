'use strict';

const { cosmiconfig, defaultLoadersSync } = require('cosmiconfig');

const augmentConfig = require('./augmentConfig');
const FileCache = require('./utils/FileCache');

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/**
 * @type {import('stylelint')['_createLinter']}
 */
module.exports = function createStylelint(options = {}) {
	const cwd = options.cwd || process.cwd();

	return {
		_options: { ...options, cwd },

		_extendExplorer: cosmiconfig('', {
			transform: augmentConfig.augmentConfigExtended(cwd),
			loaders: {
				'.cjs': (cjsPath, cjsContent) =>
					Promise.resolve(defaultLoadersSync['.cjs'](cjsPath, cjsContent)),
				'.js': (jsPath, cjsContent) =>
					Promise.resolve(defaultLoadersSync['.js'](jsPath, cjsContent)),
			},
			stopDir: STOP_DIR,
		}),

		_specifiedConfigCache: new Map(),
		_postcssResultCache: new Map(),
		_fileCache: new FileCache(options.cacheLocation, options.cacheStrategy, cwd),
	};
};
