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

/** @import { CssNode, PseudoClassSelector, PseudoElementSelector, Selector } from 'css-tree' */

/**
 * @typedef {(reason: string) => void} Complain
 */

/**
 * Pseudo-classes and pseudo-elements whose selector arguments are unforgiving
 * see https://drafts.csswg.org/selectors/#typedef-forgiving-selector-list
 */
const unforgivingArgumentPseudoSelectors = uniteSets(aNPlusBOfSNotationPseudoClasses, [
	'has',
	'host',
	'not',
	'slotted',
]);

/**
 * Pseudo-selectors whose argument must be a compound selector;
 * see https://drafts.csswg.org/css-shadow-1/
 */
const compoundArgumentPseudoSelectors = new Set(['host', 'slotted']);

const expectedDirIdentifiers = [...dirIdentifiers].map((id) => `"${id}"`).join(' or ');

/** @type {Array<(selectorNode: Selector, selectorSource: string, complain: Complain) => void>} */
const checks = [checkUnforgivingArguments, checkTopLevelSelector, checkDirPseudoClasses];

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

			if (ast.type !== 'SelectorList') return;

			for (const selectorNode of ast.children) {
				if (selectorNode.type !== 'Selector') continue;

				assert(selectorNode.loc);

				const index = selectorNode.loc.start.offset;
				const endIndex = selectorNode.loc.end.offset;
				const selectorSource = selector.slice(index, endIndex);

				/** @type {Complain} */
				const complainAboutSelector = (reason) => {
					complain(index, endIndex, selectorSource, reason);
				};

				for (const check of checks) {
					check(selectorNode, selectorSource, complainAboutSelector);
				}
			}
		});
	};
};

/**
 * @param {Selector} selectorNode
 * @param {string} selectorSource
 * @param {Complain} complain
 * @returns {void}
 */
function checkUnforgivingArguments(selectorNode, selectorSource, complain) {
	if (!mayHaveUnforgivingArguments(selectorSource)) return;

	walk(selectorNode, {
		/** @param {CssNode} node */
		enter(node) {
			if (node.type !== 'PseudoClassSelector' && node.type !== 'PseudoElementSelector') return;

			const name = node.name.toLowerCase();

			if (forgivingPseudoClasses.has(name)) return walk.skip;

			if (!unforgivingArgumentPseudoSelectors.has(name)) return;

			if (node.children === null) return;

			const reason = checkContainerArguments(node, name);

			if (reason) complain(reason);
		},
	});
}

/**
 * @param {string} selectorSource
 * @returns {boolean}
 */
function mayHaveUnforgivingArguments(selectorSource) {
	return (
		mayIncludeRegexes.hasPseudoClass.test(selectorSource) ||
		mayIncludeRegexes.hostPseudoClass.test(selectorSource) ||
		mayIncludeRegexes.slottedPseudoElement.test(selectorSource) ||
		(mayIncludeRegexes.pseudoElement.test(selectorSource) &&
			(mayIncludeRegexes.notPseudoClass.test(selectorSource) ||
				mayIncludeRegexes.aNPlusBOfSNotationPseudoClass.test(selectorSource)))
	);
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} container
 * @param {string} name The container's lowercased name
 * @returns {string | undefined} The reason the arguments are invalid
 */
function checkContainerArguments(container, name) {
	if (hasArgumentPseudoElement(container)) {
		return `pseudo-elements are invalid within "${formatPseudoName(container)}"`;
	}

	if (name === 'has' && hasNestedHas(container)) {
		return '":has()" is invalid within ":has()"';
	}

	if (compoundArgumentPseudoSelectors.has(name) && hasArgumentCombinator(container)) {
		return `combinators are invalid within "${formatPseudoName(container)}"`;
	}

	return undefined;
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
 * Whether a `:has()` contains another `:has()` outside forgiving pseudo-classes
 * see https://drafts.csswg.org/selectors/#relational
 *
 * @param {PseudoClassSelector | PseudoElementSelector} hasNode
 * @returns {boolean}
 */
function hasNestedHas(hasNode) {
	let found = false;

	walk(hasNode, {
		/** @param {CssNode} node */
		enter(node) {
			if (node === hasNode) return;

			if (node.type !== 'PseudoClassSelector') return;

			const name = node.name.toLowerCase();

			if (forgivingPseudoClasses.has(name)) return walk.skip;

			if (name === 'has') {
				found = true;

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
 * Combinators and further pseudo-elements after a pseudo-element are invalid
 * see https://drafts.csswg.org/selectors/#pseudo-element-structure and
 * https://drafts.csswg.org/selectors/#sub-pseudo-elements
 *
 * @param {Selector} selectorNode
 * @param {string} selectorSource
 * @param {Complain} complain
 * @returns {void}
 */
function checkTopLevelSelector(selectorNode, selectorSource, complain) {
	if (!mayIncludeRegexes.pseudoElement.test(selectorSource)) return;

	if (selectorNode.children.some((node) => node.type === 'NestingSelector')) return;

	/** @type {PseudoElementSelector | undefined} */
	let lastPseudoElement;
	/** @type {CssNode | undefined} */
	let previousNode;

	for (const node of selectorNode.children) {
		if (node.type === 'PseudoElementSelector') {
			if (
				previousNode?.type === 'PseudoElementSelector' &&
				isInvalidSubPseudoElement(previousNode, node)
			) {
				complain(
					`"${formatPseudoName(node)}" is invalid after "${formatPseudoName(previousNode)}"`,
				);

				return;
			}

			lastPseudoElement = node;
		} else if (node.type === 'Combinator' && lastPseudoElement) {
			complain(`combinators are invalid after "${formatPseudoName(lastPseudoElement)}"`);

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
 * @param {Selector} selectorNode
 * @param {string} selectorSource
 * @param {Complain} complain
 * @returns {void}
 */
function checkDirPseudoClasses(selectorNode, selectorSource, complain) {
	if (!mayIncludeRegexes.dirPseudoClass.test(selectorSource)) return;

	walk(selectorNode, {
		/** @param {CssNode} node */
		enter(node) {
			if (node.type !== 'PseudoClassSelector') return;

			const name = node.name.toLowerCase();

			if (forgivingPseudoClasses.has(name)) return walk.skip;

			if (name !== 'dir') return;

			if (isValidDirPseudoClass(node)) return;

			complain(`expected ${expectedDirIdentifiers} within "${formatPseudoName(node)}"`);
		},
	});
}

/**
 * @param {PseudoClassSelector} node
 * @returns {boolean}
 */
function isValidDirPseudoClass(node) {
	const { children } = node;

	if (children?.size !== 1) return false;

	const first = children.first;

	if (first?.type !== 'Identifier') return false;

	return dirIdentifiers.has(first.name.toLowerCase());
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} node
 * @returns {string}
 */
function formatPseudoName(node) {
	const colons = node.type === 'PseudoElementSelector' ? '::' : ':';

	return `${colons}${node.name.toLowerCase()}${node.children === null ? '' : '()'}`;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
