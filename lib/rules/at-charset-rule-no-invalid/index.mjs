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

			if (root.source?.input?.hasBOM) {
				report({ ...problem, messageArgs: [reasons.byteOrderMark] });

			}

			if (root.first !== atRule || atRule.raws.before) {
				report({ ...problem, messageArgs: [reasons.position] });
			}

			if (atRule.name !== 'charset') {
				report({ ...problem, messageArgs: [reasons.name] });
			}

			if (atRule.raws.afterName !== ' ') {
				report({ ...problem, messageArgs: [reasons.space] });
			}

			const { params } = atRule;
			const [label] = params.match(ENCODING_LABEL) ?? []

			if (!label) {
				report({ ...problem, messageArgs: [reasons.quotes] });
			}

			const hasExtraContentInPrelude = label && label.length !== params.length;
			const hasBlock = Boolean(atRule.nodes);
			const docEndedWithoutSemi = root.last === atRule && root.raws.semicolon === false;

			if (atRule.raws.between || hasExtraContentInPrelude || hasBlock || docEndedWithoutSemi) {
				report({ ...problem, messageArgs: [reasons.semicolon] });
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
