import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-irregular-whitespace';

const messages = ruleMessages(ruleName, {
	unexpected: 'Unexpected irregular whitespace',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-irregular-whitespace',
};

const IRREGULAR_WHITESPACES = [
	'\u000B', // Line Tabulation (\v) - <VT>
	'\u000C', // Form Feed (\f) - <FF>
	'\u00A0', // No-Break Space - <NBSP>
	'\u0085', // Next Line
	'\u1680', // Ogham Space Mark
	'\u180E', // Mongolian Vowel Separator - <MVS>
	'\uFEFF', // Zero Width No-Break Space - <BOM>
	'\u2000', // En Quad
	'\u2001', // Em Quad
	'\u2002', // En Space - <ENSP>
	'\u2003', // Em Space - <EMSP>
	'\u2004', // Tree-Per-Em
	'\u2005', // Four-Per-Em
	'\u2006', // Six-Per-Em
	'\u2007', // Figure Space
	'\u2008', // Punctuation Space - <PUNCSP>
	'\u2009', // Thin Space
	'\u200A', // Hair Space
	'\u200B', // Zero Width Space - <ZWSP>
	'\u2028', // Line Separator
	'\u2029', // Paragraph Separator
	'\u202F', // Narrow No-Break Space
	'\u205F', // Medium Mathematical Space
	'\u3000', // Ideographic Space
];

const IRREGULAR_WHITESPACES_PATTERN = new RegExp(`([${IRREGULAR_WHITESPACES.join('')}])`);

/**
 * @param {string} str
 * @returns {string | null}
 */
const findIrregularWhitespace = (str) => {
	const result = IRREGULAR_WHITESPACES_PATTERN.exec(str);

	return (result && result[1]) || null;
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss').Node} node
		 * @param {string | undefined} value
		 */
		const validate = (node, value) => {
			const issue = value && findIrregularWhitespace(value);

			if (issue) {
				report({
					ruleName,
					result,
					message: messages.unexpected,
					node,
					word: issue,
				});
			}
		};

		root.walkAtRules((atRule) => {
			validate(atRule, atRule.name);
			validate(atRule, atRule.params);
			validate(atRule, atRule.raws.before);
			validate(atRule, atRule.raws.after);
			validate(atRule, atRule.raws.afterName);
			validate(atRule, atRule.raws.between);
		});

		root.walkRules((ruleNode) => {
			validate(ruleNode, ruleNode.selector);
			validate(ruleNode, ruleNode.raws.before);
			validate(ruleNode, ruleNode.raws.after);
			validate(ruleNode, ruleNode.raws.between);
		});

		root.walkDecls((decl) => {
			validate(decl, decl.prop);
			validate(decl, decl.value);
			validate(decl, decl.raws.before);
			validate(decl, decl.raws.between);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
