import { cosmiconfig, defaultLoadersSync } from 'cosmiconfig';

import FileCache from './utils/FileCache.mjs';
import { augmentConfigExtended } from './augmentConfig.mjs';

const IS_TEST = process.env.NODE_ENV === 'test';
const STOP_DIR = IS_TEST ? process.cwd() : undefined;

/**
 * @type {import('stylelint')['_createLinter']}
 */
export default function createStylelint(options = {}) {
	const cwd = options.cwd || process.cwd();

	return {
		_options: { ...options, cwd },

		_extendExplorer: cosmiconfig('', {
			transform: augmentConfigExtended(cwd),
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
}
