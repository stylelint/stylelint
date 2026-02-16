import valueParser from 'postcss-value-parser';

import {
	hueAsFirstComponentColorFunctions,
	hueAsThirdComponentColorFunctions,
	hueColorFunctions,
} from '../../reference/functions.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'hue-degree-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/hue-degree-notation',
	fixable: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['angle', 'number'],
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!mayIncludeRegexes.hueColorFunction.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (node.type !== 'function') return;

				const functionName = node.value.toLowerCase();

				if (!hueColorFunctions.has(functionName)) return;

				const hue = findHue(node);

				if (!hue) return;

				const { value } = hue;

				if (!isStandardSyntaxValue(value)) return;

				const dimension = valueParser.unit(value);

				if (!dimension) return;

				const isDegree = dimension.unit.toLowerCase() === 'deg';
				const isNumber = dimension.unit === '';

				if (!isDegree && !isNumber) return;

				if (primary === 'angle' && isDegree) return;

				if (primary === 'number' && isNumber) return;

				const fixed = primary === 'angle' ? `${dimension.number}deg` : dimension.number;
				const unfixed = value;
				const valueIndex = declarationValueIndex(decl);
				const fix = () => {
					hue.value = fixed;
					setDeclarationValue(decl, parsedValue.toString());
				};

				report({
					message: messages.expected,
					messageArgs: [unfixed, fixed],
					node: decl,
					index: valueIndex + hue.sourceIndex,
					endIndex: valueIndex + hue.sourceEndIndex,
					result,
					ruleName,
					fix: {
						apply: fix,
						node: decl,
					},
				});
			});
		});
	};
};

/**
 * @param {import('postcss-value-parser').FunctionNode} node
 */
function findHue(node) {
	const args = node.nodes.filter(({ type }) => type === 'word' || type === 'function');
	const value = node.value.toLowerCase();

	// If using relative color syntax, for instance `oklch(from red l c h)`, the
	// channels start from the 2nd value.
	const isRelativeColor = args[0]?.value.toLowerCase() === 'from';
	const offset = isRelativeColor ? 2 : 0;

	if (hueAsFirstComponentColorFunctions.has(value)) {
		return args[0 + offset];
	}

	if (hueAsThirdComponentColorFunctions.has(value)) {
		return args[2 + offset];
	}

	return undefined;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
