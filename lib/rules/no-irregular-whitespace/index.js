// @ts-nocheck

'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-irregular-whitespace';
const messages = ruleMessages(ruleName, {
	unexpected: 'Unexpected irregular whitespace',
});

const irregularWhitespaces = [
	'\u000B', // Line Tabulation (\v) - <VT>
	'\u000C', // Form Feed (\f) - <FF>
	'\u00A0', // No-Break Space - <NBSP>
	'\u0085', // Next Line
	'\u1680', // Ogham Space Mark
	'\u180E', // Mongolian Vowel Separator - <MVS>
	'\ufeff', // Zero Width No-Break Space - <BOM>
	'\u2000', // En Quad
	'\u2001', // Em Quad
	'\u2002', // En Space - <ENSP>
	'\u2003', // Em Space - <EMSP>
	'\u2004', // Tree-Per-Em
	'\u2005', // Four-Per-Em
	'\u2006', // Six-Per-Em
	'\u2007', // Figure Space
	'\u2008', // Punctuation Space - <PUNCSP>
	'\u2009', // Thin Space
	'\u200A', // Hair Space
	'\u200B', // Zero Width Space - <ZWSP>
	'\u2028', // Line Separator
	'\u2029', // Paragraph Separator
	'\u202F', // Narrow No-Break Space
	'\u205f', // Medium Mathematical Space
	'\u3000', // Ideographic Space
];

const generateInvalidWhitespaceValidator = (ignoreArray = []) => {
	const pattern = new RegExp(
		`(${irregularWhitespaces.filter((ws) => ignoreArray.indexOf(ws) === -1).join('|')})`,
	);

	return (str) => typeof str === 'string' && pattern.exec(str);
};

const declarationSchema = {
	prop: 'string',
	value: 'string',
	raws: {
		before: 'string',
		between: 'string',
	},
};

const atRuleSchema = {
	name: 'string',
	params: 'string',
	raws: {
		before: 'string',
		between: 'string',
		afterName: 'string',
		after: 'string',
	},
};

const ruleSchema = {
	selector: 'string',
	raws: {
		before: 'string',
		between: 'string',
		after: 'string',
	},
};

const generateNodeValidator = (nodeSchema, validator) => {
	const allKeys = Object.keys(nodeSchema);
	const allKeysLength = allKeys.length;
	const validatorForKey = {};

	allKeys.forEach((key) => {
		if (typeof nodeSchema[key] === 'string') validatorForKey[key] = validator;

		if (typeof nodeSchema[key] === 'object')
			validatorForKey[key] = generateNodeValidator(nodeSchema[key], validator);
	});

	// this will be called many times, so it's optimized for performance and not readibility. Surprisingly, this seem to be slightly faster then concatenating the params and running the validator once
	return (node) => {
		for (let i = 0, currentKey; i < allKeysLength; i++) {
			currentKey = allKeys[i];

			if (validatorForKey[currentKey](node[currentKey])) {
				return validatorForKey[currentKey](node[currentKey]);
			}
		}
	};
};

function rule(on, options) {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: on },
			{
				actual: options,
				possible: {
					allow: [...irregularWhitespaces],
					only: [...irregularWhitespaces],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		let initializeParam = [];

		if (options) {
			if (options.allow) initializeParam = options.allow;

			if (options.only)
				initializeParam = irregularWhitespaces.filter((ws) => options.only.indexOf(ws) > -1);
		}

		const genericValidator = generateInvalidWhitespaceValidator(initializeParam);

		const validate = (node, validator) => {
			const issue = validator(node);

			if (issue) {
				report({
					ruleName,
					result,
					message: messages.unexpected,
					node,
					word: issue[1],
				});
			}
		};

		const atRuleValidator = generateNodeValidator(atRuleSchema, genericValidator);
		const ruleValidator = generateNodeValidator(ruleSchema, genericValidator);
		const declValidator = generateNodeValidator(declarationSchema, genericValidator);

		root.walkAtRules((atRule) => validate(atRule, atRuleValidator));
		root.walkRules((selector) => validate(selector, ruleValidator));
		root.walkDecls((declaration) => validate(declaration, declValidator));
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
