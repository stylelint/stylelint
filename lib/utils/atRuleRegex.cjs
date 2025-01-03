// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const atKeywords = require('../reference/atKeywords.cjs');

const MEDIA_REGEX = /^media$/i;
const KEYFRAMES_REGEX = /^(-(o|moz|ms|webkit)-)?keyframes$/i;
const PROPERTY_REGEX = /^property$/i;
const UNSUPPORTED_NESTING_REGEX = new RegExp(
	`^((?!${[...atKeywords.nestingSupportedAtKeywords.values()].join('|')}).)*$`,
	'i',
);

exports.KEYFRAMES_REGEX = KEYFRAMES_REGEX;
exports.MEDIA_REGEX = MEDIA_REGEX;
exports.PROPERTY_REGEX = PROPERTY_REGEX;
exports.UNSUPPORTED_NESTING_REGEX = UNSUPPORTED_NESTING_REGEX;
