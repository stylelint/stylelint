// @ts-nocheck

'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'color-hex-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const HEX = /^#[0-9A-Za-z]+/;
const IGNORED_FUNCTIONS = new Set(['url']);

function rule(expectation, options, context) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: expectation,
			possible: ['lower', 'upper'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const parsedValue = valueParser(getValue(decl));
			let needsFix = false;

			parsedValue.walk((node) => {
				const { value } = node;

				if (isIgnoredFunction(node)) return false;

				if (!isHexColor(node)) return;

				const expected = expectation === 'lower' ? value.toLowerCase() : value.toUpperCase();

				if (value === expected) return;

				if (context.fix) {
					node.value = expected;
					needsFix = true;

					return;
				}

				report({
					message: messages.expected(value, expected),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});
			});

			if (needsFix) {
				setValue(decl, parsedValue.toString());
			}
		});
	};
}

function isIgnoredFunction({ type, value }) {
	return type === 'function' && IGNORED_FUNCTIONS.has(value.toLowerCase());
}

function isHexColor({ type, value }) {
	return type === 'word' && HEX.test(value);
}

function getValue(decl) {
	return decl.raws.value ? decl.raws.value.raw : decl.value;
}

function setValue(decl, value) {
	if (decl.raws.value) decl.raws.value.raw = value;
	else decl.value = value;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
