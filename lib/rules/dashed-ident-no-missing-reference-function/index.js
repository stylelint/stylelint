// @ts-nocheck

'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'dashed-ident-no-missing-reference-function';

const messages = ruleMessages(ruleName, {
	rejected: (dashedIdent) =>
		`Unexpected missing dashed-ident reference function for "${dashedIdent}"`,
});

const REFERENCE_FUNCTIONS = ['color', 'env', 'var'];

function rule(actual) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual,
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (isReferenceFunction(node)) return false;

				if (!isDashedIdent(node)) return;

				report({
					message: messages.rejected(node.value),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});

				return false;
			});
		});
	};
}

function isDashedIdent(node) {
	return node.type === 'word' && node.value.startsWith('--');
}

function isReferenceFunction(node) {
	return node.type === 'function' && REFERENCE_FUNCTIONS.includes(node.value);
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
