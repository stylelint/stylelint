'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'declaration-colon-newline-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected newline after ":"',
	expectedAfterMultiLine: () => 'Expected newline after ":" with a multi-line declaration',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-colon-newline-after',
	fixable: true,
	deprecated: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('newline', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'always-multi-line'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) {
				return;
			}

			// Get the raw prop, and only the prop
			const endOfPropIndex = declarationValueIndex(decl) + (decl.raws.between || '').length - 1;

			// The extra characters tacked onto the end ensure that there is a character to check
			// after the colon. Otherwise, with `background:pink` the character after the
			const propPlusColon = `${decl.toString().slice(0, endOfPropIndex)}xxx`;

			for (let i = 0, l = propPlusColon.length; i < l; i++) {
				if (propPlusColon[i] !== ':') {
					continue;
				}

				const indexToCheck = /^[^\S\r\n]*\/\*/.test(propPlusColon.slice(i + 1))
					? propPlusColon.indexOf('*/', i) + 1
					: i;

				checker.afterOneOnly({
					source: propPlusColon,
					index: indexToCheck,
					lineCheckStr: decl.value,
					err: (m) => {
						if (context.fix) {
							const between = decl.raws.between;

							if (between == null) throw new Error('`between` must be present');

							const betweenStart = declarationValueIndex(decl) - between.length;
							const sliceIndex = indexToCheck - betweenStart + 1;
							const betweenBefore = between.slice(0, sliceIndex);
							const betweenAfter = between.slice(sliceIndex);

							decl.raws.between = /^\s*\n/.test(betweenAfter)
								? betweenBefore + betweenAfter.replace(/^[^\S\r\n]*/, '')
								: betweenBefore + context.newline + betweenAfter;

							return;
						}

						report({
							message: m,
							node: decl,
							index: indexToCheck,
							result,
							ruleName,
						});
					},
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
