import { isTokenNumber, stringify, tokenize } from '@csstools/css-tokenizer';

import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import report from '../../utils/report.mjs';
import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/declaration-value-change-length';

const messages = ruleMessages(ruleName, {
	rejected: (value) => `Unexpected "${value}"`,
});

const rule = (primary) => {
	const shortValue = '9';
	const longValue = '99999999999999999999';

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['short', 'long'],
		});

		if (!validOptions) return;

		root.walkDecls((node) => {
			const value = getDeclarationValue(node);

			const valueIndex = declarationValueIndex(node);

			const tokens = tokenize({ css: value });

			tokens.forEach((token) => {
				if (!isTokenNumber(token)) return;

				const [, number, index, endIndex] = token;

				if (number === shortValue || number === longValue) return;

				report({
					result,
					ruleName,
					message: messages.rejected(number),
					node,
					index: valueIndex + index,
					endIndex: valueIndex + endIndex + 1,
					fix: () => {
						token[1] = primary === 'short' ? shortValue : longValue;
						node.value = stringify(...tokens);
					},
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
