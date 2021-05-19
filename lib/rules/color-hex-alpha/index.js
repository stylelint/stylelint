// @ts-nocheck
'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'color-hex-alpha';

const messages = ruleMessages(ruleName, {
	expected: (hex) => `Expected alpha channel in "${hex}"`,
	unexpected: (hex) => `Unexpected alpha channel in "${hex}"`,
});

const HEX = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

function rule(primary) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (isUrlFunction(node)) return false;

				if (!isHexColor(node)) return;

				let { value } = node;

				if (primary === 'always' && hasAlphaChannel(value)) return;

				if (primary === 'never' && !hasAlphaChannel(value)) return;

				report({
					message: primary === 'never' ? messages.unexpected(value) : messages.expected(value),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});
			});
		});
	};
}

function isUrlFunction({ type, value }) {
	return type === 'function' && value === 'url';
}

function isHexColor({ type, value }) {
	return type === 'word' && HEX.test(value);
}

function hasAlphaChannel(hex) {
	return hex.length === 5 || hex.length === 9;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
