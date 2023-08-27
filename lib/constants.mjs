export const DEFAULT_CACHE_LOCATION = './.stylelintcache';
export const CACHE_STRATEGY_METADATA = 'metadata';
export const CACHE_STRATEGY_CONTENT = 'content';
export const DEFAULT_CACHE_STRATEGY = CACHE_STRATEGY_METADATA;

export const DEFAULT_IGNORE_FILENAME = '.stylelintignore';

export const DEFAULT_FORMATTER = 'string';

// NOTE: Partially based on `sysexits.h`.
export const EXIT_CODE_SUCCESS = 0;
export const EXIT_CODE_FATAL_ERROR = 1;
export const EXIT_CODE_LINT_PROBLEM = 2;
export const EXIT_CODE_INVALID_USAGE = 64;
export const EXIT_CODE_INVALID_CONFIG = 78;
