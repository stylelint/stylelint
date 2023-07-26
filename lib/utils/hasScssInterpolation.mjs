const HAS_SCSS_INTERPOLATION = /#\{.+?\}/;

/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 * @returns {boolean}
 */
export default function hasScssInterpolation(string) {
	return HAS_SCSS_INTERPOLATION.test(string);
}
