import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

export const MEDIA_REGEX = /^media$/i;
export const KEYFRAMES_REGEX = /^(-(o|moz|ms|webkit)-)?keyframes$/i;
export const PROPERTY_REGEX = /^property$/i;
export const UNSUPPORTED_NESTING_REGEX = new RegExp(
	`^((?!${[...nestingSupportedAtKeywords.values()].join('|')}).)*$`,
	'i',
);
