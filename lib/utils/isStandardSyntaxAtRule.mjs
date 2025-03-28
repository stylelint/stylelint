/**
 * Check whether a at-rule is standard
 *
 * @param {import('postcss').AtRule | import('postcss-less').AtRule} atRule postcss at-rule node
 * @returns {boolean} If `true`, the declaration is standard
 */
export default function isStandardSyntaxAtRule(atRule) {
	// Ignore `@charset` css rule (is parsed as at-rule)
	if (atRule.name.toLowerCase() === 'charset') {
		return false;
	}

	// Ignore scss `@content` inside mixins
	if (!atRule.nodes && atRule.params === '') {
		return false;
	}

	// Ignore Less mixins
	if ('mixin' in atRule && atRule.mixin) {
		return false;
	}

	// Ignore Less detached ruleset `@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }`
	if (
		('variable' in atRule && atRule.variable) ||
		(!atRule.nodes && atRule.raws.afterName === '' && atRule.params[0] === '(')
	) {
		return false;
	}

	return true;
}
