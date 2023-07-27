'use strict';

const DEFAULT_CACHE_LOCATION = './.stylelintcache';
const CACHE_STRATEGY_METADATA = 'metadata';
const CACHE_STRATEGY_CONTENT = 'content';
const DEFAULT_CACHE_STRATEGY = CACHE_STRATEGY_METADATA;

const DEFAULT_IGNORE_FILENAME = '.stylelintignore';

const DEFAULT_FORMATTER = 'string';

const EXIT_CODE_ERROR = 2;

exports.CACHE_STRATEGY_CONTENT = CACHE_STRATEGY_CONTENT;
exports.CACHE_STRATEGY_METADATA = CACHE_STRATEGY_METADATA;
exports.DEFAULT_CACHE_LOCATION = DEFAULT_CACHE_LOCATION;
exports.DEFAULT_CACHE_STRATEGY = DEFAULT_CACHE_STRATEGY;
exports.DEFAULT_FORMATTER = DEFAULT_FORMATTER;
exports.DEFAULT_IGNORE_FILENAME = DEFAULT_IGNORE_FILENAME;
exports.EXIT_CODE_ERROR = EXIT_CODE_ERROR;
