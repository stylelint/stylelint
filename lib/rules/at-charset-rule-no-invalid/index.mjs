import {
	atRuleAfterNameIndex,
	atRuleBetweenIndex,
	atRuleParamIndex,
} from '../../utils/nodeFieldIndices.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'at-charset-rule-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (reason) => `Invalid @charset rule, ${reason}`,
});

const reasons = {
	byteOrderMark: 'expected no byte order mark before "@charset"',
	position: 'expected it to be at the very start of the stylesheet',
	name: 'expected "@charset" to be lowercase',
	space: 'expected a single space after "@charset"',
	quotes: 'expected double quotes around the encoding label',
	semicolon: 'expected a semicolon directly after the closing quote',
};

const ENCODING_LABEL = /^"[^"]*"/;

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-charset-rule-no-invalid',
};

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(atRuleRegexes.charsetName, (atRule) => {
			const problem = { node: atRule, ruleName, result, message: messages.rejected };

			// A byte order mark takes precedence over the rule, which makes it a no-op
			if (root.source?.input?.hasBOM) {
				report({ ...problem, messageArgs: [reasons.byteOrderMark] });

				return;
			}

			// The rule is only honoured at the very start of the stylesheet
			if (root.first !== atRule || atRule.raws.before) {
				report({ ...problem, messageArgs: [reasons.position] });

				return;
			}

			const { name, params } = atRule;
			const afterNameIndex = atRuleAfterNameIndex(atRule);
			const paramIndex = atRuleParamIndex(atRule);

			if (name !== 'charset') {
				report({ ...problem, messageArgs: [reasons.name], index: 0, endIndex: afterNameIndex });
			}

			if (atRule.raws.afterName !== ' ') {
				report({
					...problem,
					messageArgs: [reasons.space],
					index: afterNameIndex,
					endIndex: Math.max(paramIndex, afterNameIndex + 1),
				});
			}

			const label = ENCODING_LABEL.exec(params)?.[0];

			if (!label) {
				report({
					...problem,
					messageArgs: [reasons.quotes],
					index: paramIndex,
					endIndex: paramIndex + params.length,
				});
			}

			const betweenIndex = atRuleBetweenIndex(atRule);
			const between = atRule.raws.between ?? '';

			if (label && label.length < params.length) {
				// Without a semicolon, whatever follows the label is swallowed into the prelude,
				// so point at the closing quote the semicolon should follow
				const labelEndIndex = paramIndex + label.length;

				report({
					...problem,
					messageArgs: [reasons.semicolon],
					index: labelEndIndex - 1,
					endIndex: labelEndIndex,
				});
			} else if (between !== '') {
				report({
					...problem,
					messageArgs: [reasons.semicolon],
					index: betweenIndex,
					endIndex: betweenIndex + between.length,
				});
			} else if (atRule.nodes || (root.last === atRule && root.raws.semicolon === false)) {
				// The semicolon is missing, either before a block or at the end of the stylesheet,
				// so point at the character it should follow
				report({
					...problem,
					messageArgs: [reasons.semicolon],
					index: Math.max(betweenIndex - 1, 0),
					endIndex: betweenIndex,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
