import { isFunctionNode, parseListOfComponentValues, walk } from '@csstools/css-parser-algorithms';
import { definitionSyntax } from 'css-tree';
import { tokenize } from '@csstools/css-tokenizer';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isCustomFunction from '../../utils/isCustomFunction.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import { previouslyKnownFunctions } from '../../reference/functions.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'function-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unknown function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-no-unknown',
};

/** @import { Lexer, SyntaxDescriptor } from 'css-tree' */

/** @type {WeakMap<Lexer, ReadonlySet<string>>} */
const knownFunctionsByLexer = new WeakMap();

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const knownFunctions = getKnownFunctions(/** @type {Lexer} */ (result.stylelint.lexer));

		root.walkDecls((decl) => {
			const { value } = decl;

			if (!value.includes('(')) return;

			if (!isStandardSyntaxValue(value)) return;

			walk(parseListOfComponentValues(tokenize({ css: value })), ({ node }) => {
				if (!isFunctionNode(node)) return;

				const name = node.getName();

				if (isCustomFunction(name)) return;

				if (optionsMatches(secondaryOptions, 'ignoreFunctions', name)) return;

				if (vendor.prefix(name) || knownFunctions.has(name.toLowerCase())) return;

				const declIndex = declarationValueIndex(decl);
				const index = declIndex + node.name[2];
				const endIndex = declIndex + node.name[3];

				report({
					message: messages.rejected,
					messageArgs: [name],
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

/**
 * Collect the lowercased names of the functions the lexer's syntax defines.
 *
 * @param {Lexer} lexer
 * @returns {ReadonlySet<string>}
 */
function getKnownFunctions(lexer) {
	const cached = knownFunctionsByLexer.get(lexer);

	if (cached) return cached;

	/** @type {Array<SyntaxDescriptor | null>} */
	const syntaxDescriptors = [
		...Object.values(lexer.types),
		...Object.values(lexer.properties),
		...Object.values(lexer.atrules).flatMap((atrule) => [
			atrule.prelude,
			...Object.values(atrule.descriptors ?? {}),
		]),
	];

	const knownFunctions = new Set([
		...previouslyKnownFunctions,
		...syntaxDescriptors.flatMap(getFunctionNames),
	]);

	knownFunctionsByLexer.set(lexer, knownFunctions);

	return knownFunctions;
}

/**
 * @param {SyntaxDescriptor | null} descriptor
 * @returns {string[]}
 */
function getFunctionNames(descriptor) {
	if (!descriptor?.syntax) return [];

	/** @type {string[]} */
	const names = [];

	definitionSyntax.walk(descriptor.syntax, (node) => {
		if (node.type === 'Function') names.push(node.name.toLowerCase());
	});

	return names;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
