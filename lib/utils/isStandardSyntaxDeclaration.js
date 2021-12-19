'use strict';

const isScssVariable = require('./isScssVariable');
const { isRoot, isRule } = require('./typeGuards');

/**
 * @param {string} [lang]
 */
function isStandardSyntaxLang(lang) {
	return lang && (lang === 'css' || lang === 'custom-template' || lang === 'template-literal');
}

/**
 * Check whether a declaration is standard
 *
 * @param {import('postcss').Declaration | import('postcss-less').Declaration} decl
 */
module.exports = function (decl) {
	const prop = decl.prop;
	const parent = decl.parent;

	// Declarations belong in a declaration block or standard CSS source
	if (
		parent &&
		isRoot(parent) &&
		parent.source &&
		!isStandardSyntaxLang(
			/** @type {import('postcss').Source & {lang?: string}} */ (parent.source).lang,
		)
	) {
		return false;
	}

	// SCSS var; covers map and list declarations
	if (isScssVariable(prop)) {
		return false;
	}

	// Less var (e.g. @var: x), but exclude variable interpolation (e.g. @{var})
	if (prop[0] === '@' && prop[1] !== '{') {
		return false;
	}

	// Less map declaration
	if (parent && parent.type === 'atrule' && parent.raws.afterName === ':') {
		return false;
	}

	// Less map (e.g. #my-map() { myprop: red; })
	if (
		parent &&
		isRule(parent) &&
		parent.selector &&
		parent.selector.startsWith('#') &&
		parent.selector.endsWith('()')
	) {
		return false;
	}

	// Sass nested properties (e.g. border: { style: solid; color: red; })
	if (
		parent &&
		isRule(parent) &&
		parent.selector &&
		parent.selector[parent.selector.length - 1] === ':' &&
		parent.selector.substring(0, 2) !== '--'
	) {
		return false;
	}

	// Less &:extend
	if ('extend' in decl && decl.extend) {
		return false;
	}

	return true;
};
