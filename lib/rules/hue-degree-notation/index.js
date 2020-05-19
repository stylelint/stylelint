// @ts-nocheck

'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'hue-degree-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const HUE_FIRST_ARG_FUNCS = ['hsl', 'hsla', 'hwb'];
const HUE_THIRD_ARG_FUNCS = ['lch'];
const HUE_FUNCS = [...HUE_FIRST_ARG_FUNCS, ...HUE_THIRD_ARG_FUNCS];

function rule(primary, secondary, context) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['angle', 'number'],
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			let needsFix = false;
			const parsedValue = valueParser(getValue(decl));

			parsedValue.walk((node) => {
				if (node.type !== 'function') return;

				if (!HUE_FUNCS.includes(node.value.toLowerCase())) return;

				const hue = findHue(node);

				if (!hue) return;

				const { value } = hue;

				if (!isStandardSyntaxValue(value)) return;

				if (!isDegree(value) && !isNumber(value)) return;

				if (primary === 'angle' && isDegree(value)) return;

				if (primary === 'number' && isNumber(value)) return;

				const fixed = primary === 'angle' ? asDegree(value) : asNumber(value);
				const unfixed = value;

				if (context.fix) {
					hue.value = fixed;
					needsFix = true;

					return;
				}

				report({
					message: messages.expected(unfixed, fixed),
					node: decl,
					index: declarationValueIndex(decl) + hue.sourceIndex,
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

function asDegree(value) {
	return `${value}deg`;
}

function asNumber(value) {
	const { number } = valueParser.unit(value);

	return number;
}

function findHue(node) {
	const args = node.nodes.filter(({ type }) => type === 'word' || type === 'function');
	const value = node.value.toLowerCase();

	if (HUE_FIRST_ARG_FUNCS.includes(value)) {
		return args[0];
	}

	if (HUE_THIRD_ARG_FUNCS.includes(value)) {
		return args[2];
	}

	return false;
}

function isDegree(value) {
	const { unit } = valueParser.unit(value);

	return unit && unit.toLowerCase() === 'deg';
}

function isNumber(value) {
	const { unit } = valueParser.unit(value);

	return unit === '';
}

function getValue(decl) {
	return decl.raws.value ? decl.raws.value.raw : decl.value;
}

function setValue(decl, value) {
	if (decl.raws.value) decl.raws.value.raw = value;
	else decl.value = value;

	return decl;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
