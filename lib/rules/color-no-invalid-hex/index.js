'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxHexColor = require('../../utils/isStandardSyntaxHexColor');
const isValidHex = require('../../utils/isValidHex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'color-no-invalid-hex';

const messages = ruleMessages(ruleName, {
	rejected: (hex) => `Unexpected invalid hex color "${hex}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-no-invalid-hex',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!isStandardSyntaxHexColor(decl.value)) {
				return;
			}

			valueParser(decl.value).walk(({ value, type, sourceIndex }) => {
				if (type === 'function' && value.endsWith('url')) return false;

				if (type !== 'word') return;

				const hexMatch = /^#[0-9A-Za-z]+/.exec(value);

				if (!hexMatch) return;

				const hexValue = hexMatch[0];

				if (!hexValue || isValidHex(hexValue)) return;

				const index = declarationValueIndex(decl) + sourceIndex;
				const endIndex = index + hexValue.length;

				report({
					message: messages.rejected(hexValue),
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

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
