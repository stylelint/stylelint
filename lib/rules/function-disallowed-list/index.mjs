import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isStandardSyntaxFunction from '../../utils/isStandardSyntaxFunction.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'function-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-disallowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			valueParser(decl.value).walk((node) => {
				const { type, sourceIndex, value: funcName } = node;

				if (type !== 'function') {
					return;
				}

				if (!isStandardSyntaxFunction(node)) {
					return;
				}

				if (!matchesStringOrRegExp(funcName, primary)) {
					return;
				}

				const index = declarationValueIndex(decl) + sourceIndex;
				const endIndex = index + funcName.length;

				report({
					message: messages.rejected,
					messageArgs: [funcName],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
