import { parse, walk } from 'css-tree';

import {
	aNPlusBOfSNotationPseudoClasses,
	dirIdentifiers,
	elementBackedPseudoElements,
	forgivingPseudoClasses,
	subPseudoElements,
} from '../../reference/selectors.mjs';
import { assert } from '../../utils/validateTypes.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import uniteSets from '../../utils/uniteSets.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (selector, reason) => `Invalid selector "${selector}"${reason ? `, ${reason}` : ''}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-invalid',
};

/** @import { CssNode, PseudoClassSelector, PseudoElementSelector, Selector, SelectorList } from 'css-tree' */

/**
 * @typedef {(index: number, endIndex: number, subject: string, reason: string) => void} Complain
 */

/**
 * Pseudo-classes whose selector arguments are unforgiving
 * see https://drafts.csswg.org/selectors/#typedef-forgiving-selector-list
 */
const unforgivingArgumentPseudoClasses = uniteSets(aNPlusBOfSNotationPseudoClasses, [
	'has',
	'host',
	'not',
]);

/**
 * Pseudo-selectors whose argument must be a compound selector;
 * see https://drafts.csswg.org/css-shadow-1/
 */
const compoundArgumentPseudoSelectors = new Set(['host', 'slotted']);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (isKeyframeRule(ruleNode)) return;

			const selector = getRuleSelector(ruleNode);

			/**
			 * @param {number} index
			 * @param {number} endIndex
			 * @param {string} subject
			 * @param {string} reason
			 */
			const complain = (index, endIndex, subject, reason) => {
				report({
					message: messages.rejected,
					messageArgs: [subject, reason],
					node: ruleNode,
					index,
					endIndex,
					ruleName,
					result,
				});
			};

			let ast;

			try {
				ast = parse(selector, { context: 'selectorList', positions: true });
			} catch (error) {
				if (!(error instanceof SyntaxError)) throw error;

				const offset = 'offset' in error && typeof error.offset === 'number' ? error.offset : 0;
				const message = error.message;

				complain(
					offset,
					Math.min(offset + 1, selector.length),
					selector,
					message.charAt(0).toLowerCase() + message.slice(1),
				);

				return;
			}

			if (!mayIncludeRegexes.pseudo.test(selector)) return;

			if (ast.type === 'SelectorList') {
				const mayHavePseudoElement = mayIncludeRegexes.pseudoElement.test(selector);

				checkUnforgivingArguments(ast, selector, complain, mayHavePseudoElement);
				checkTopLevelSelectors(ast, selector, complain, mayHavePseudoElement);
			}

			if (!mayIncludeRegexes.dirPseudoClass.test(selector)) return;

			walk(ast, {
				visit: 'PseudoClassSelector',
				enter(node) {
					if (node.name.toLowerCase() !== 'dir') return walk.skip;

					if (!node.loc) return walk.skip;

					if (isValidDirPseudoClass(node, dirIdentifiers)) return walk.skip;

					const index = node.loc.start.offset;
					const endIndex = node.loc.end.offset;

					const reason = `expected ${[...dirIdentifiers].map((id) => `"${id}"`).join(' or ')}`;

					complain(index, endIndex, selector.slice(index, endIndex), reason);
				},
			});
		});
	};
};

/**
 * @param {SelectorList} ast
 * @param {string} selector
 * @param {Complain} complain
 * @param {boolean} mayHavePseudoElement
 * @returns {void}
 */
function checkUnforgivingArguments(ast, selector, complain, mayHavePseudoElement) {
	const mayHaveInvalidArguments =
		mayIncludeRegexes.hasPseudoClass.test(selector) ||
		mayIncludeRegexes.hostPseudoClass.test(selector) ||
		(mayHavePseudoElement &&
			(mayIncludeRegexes.notPseudoClass.test(selector) ||
				mayIncludeRegexes.aNPlusBOfSNotationPseudoClass.test(selector)));

	if (!mayHaveInvalidArguments) return;

	walk(ast, {
		/** @param {CssNode} node */
		enter(node) {
			if (node.type !== 'PseudoClassSelector') return;

			const name = node.name.toLowerCase();

			if (forgivingPseudoClasses.has(name)) return walk.skip;

			if (!unforgivingArgumentPseudoClasses.has(name)) return;

			if (node.children === null) return;

			if (checkContainerArguments(node, name, selector, complain)) return walk.skip;
		},
	});
}

/**
 * @param {SelectorList} ast
 * @param {string} selector
 * @param {Complain} complain
 * @param {boolean} mayHavePseudoElement
 * @returns {void}
 */
function checkTopLevelSelectors(ast, selector, complain, mayHavePseudoElement) {
	if (!mayHavePseudoElement) return;

	ast.children.forEach((selectorNode) => {
		if (selectorNode.type !== 'Selector') return;

		checkTopLevelSelector(selectorNode, selector, complain);
	});
}

/**
 * Combinators and further pseudo-elements after a pseudo-element are invalid
 * see https://drafts.csswg.org/selectors/#pseudo-element-structure and
 * https://drafts.csswg.org/selectors/#sub-pseudo-elements
 *
 * @param {Selector} selectorNode
 * @param {string} selector
 * @param {Complain} complain
 * @returns {void}
 */
function checkTopLevelSelector(selectorNode, selector, complain) {
	const containsNestingSelector = selectorNode.children.some(
		(node) => node.type === 'NestingSelector',
	);

	/** @type {PseudoElementSelector | undefined} */
	let lastPseudoElement;
	/** @type {CssNode | undefined} */
	let previousNode;

	for (const node of selectorNode.children) {
		if (node.type === 'PseudoElementSelector') {
			const name = node.name.toLowerCase();

			if (compoundArgumentPseudoSelectors.has(name) && node.children !== null) {
				checkContainerArguments(node, name, selector, complain);
			}

			if (
				!containsNestingSelector &&
				previousNode?.type === 'PseudoElementSelector' &&
				isInvalidSubPseudoElement(previousNode, node)
			) {
				complainAboutNode(
					previousNode,
					selector,
					complain,
					`"${formatPseudoName(node)}" is invalid after "${formatPseudoName(previousNode)}"`,
					node,
				);

				return;
			}

			lastPseudoElement = node;
		} else if (!containsNestingSelector && node.type === 'Combinator' && lastPseudoElement) {
			complainAboutNode(
				lastPseudoElement,
				selector,
				complain,
				`combinators are invalid after "${formatPseudoName(lastPseudoElement)}"`,
				selectorNode,
			);

			return;
		}

		previousNode = node;
	}
}

/**
 * Whether `second`, compounded to `first`, is not a defined sub-pseudo-element
 * see https://drafts.csswg.org/selectors/#sub-pseudo-elements
 *
 * @param {PseudoElementSelector} first
 * @param {PseudoElementSelector} second
 * @returns {boolean}
 */
function isInvalidSubPseudoElement(first, second) {
	if (elementBackedPseudoElements.has(first.name.toLowerCase())) return false;

	if (subPseudoElements.has(second.name.toLowerCase())) return false;

	return true;
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} container
 * @param {string} name The container's lowercased name
 * @param {string} selector
 * @param {Complain} complain
 * @returns {boolean} Whether a problem was reported
 */
function checkContainerArguments(container, name, selector, complain) {
	if (hasArgumentPseudoElement(container)) {
		complainAboutNode(
			container,
			selector,
			complain,
			`pseudo-elements are invalid within "${formatPseudoName(container)}"`,
		);

		return true;
	}

	if (name === 'has') {
		const nestedHas = findNestedHas(container);

		if (nestedHas) {
			complainAboutNode(nestedHas, selector, complain, '":has()" is invalid within ":has()"');

			return true;
		}
	}

	if (compoundArgumentPseudoSelectors.has(name) && hasArgumentCombinator(container)) {
		complainAboutNode(
			container,
			selector,
			complain,
			`combinators are invalid within "${formatPseudoName(container)}"`,
		);

		return true;
	}

	return false;
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} container
 * @returns {boolean}
 */
function hasArgumentPseudoElement(container) {
	let found = false;

	walk(container, {
		/** @param {CssNode} node */
		enter(node) {
			if (node === container) return;

			if (node.type === 'PseudoElementSelector') {
				found = true;

				return walk.break;
			}

			if (node.type === 'PseudoClassSelector' && node.children !== null) return walk.skip;
		},
	});

	return found;
}

/**
 * The first `:has()` within another `:has()`, not nested inside a forgiving pseudo-class
 * see https://drafts.csswg.org/selectors/#relational
 *
 * @param {PseudoClassSelector | PseudoElementSelector} hasNode
 * @returns {PseudoClassSelector | undefined}
 */
function findNestedHas(hasNode) {
	/** @type {PseudoClassSelector | undefined} */
	let found;

	walk(hasNode, {
		/** @param {CssNode} node */
		enter(node) {
			if (node === hasNode) return;

			if (node.type !== 'PseudoClassSelector') return;

			const name = node.name.toLowerCase();

			if (forgivingPseudoClasses.has(name)) return walk.skip;

			if (name === 'has') {
				found = node;

				return walk.break;
			}
		},
	});

	return found;
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} container
 * @returns {boolean}
 */
function hasArgumentCombinator(container) {
	const argument = container.children?.first;

	if (!argument || argument.type !== 'Selector') return false;

	return argument.children.some((node) => node.type === 'Combinator');
}

/**
 * @param {CssNode} node
 * @param {string} selector
 * @param {Complain} complain
 * @param {string} reason
 * @param {CssNode} [endNode] The node whose end position ends the fragment
 * @returns {void}
 */
function complainAboutNode(node, selector, complain, reason, endNode = node) {
	assert(node.loc);
	assert(endNode.loc);

	const index = node.loc.start.offset;
	const endIndex = endNode.loc.end.offset;

	complain(index, endIndex, selector.slice(index, endIndex), reason);
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} node
 * @returns {string}
 */
function formatPseudoName(node) {
	const colons = node.type === 'PseudoElementSelector' ? '::' : ':';

	return `${colons}${node.name.toLowerCase()}${node.children === null ? '' : '()'}`;
}

/**
 * @param {PseudoClassSelector} node
 * @param {ReadonlySet<string>} identifiers
 * @returns {boolean}
 */
function isValidDirPseudoClass(node, identifiers) {
	const { children } = node;

	if (children?.size !== 1) return false;

	const first = children.first;

	if (first?.type !== 'Identifier') return false;

	return identifiers.has(first.name.toLowerCase());
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
