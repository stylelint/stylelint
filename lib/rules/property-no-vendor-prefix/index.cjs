// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const keywords = require('../../reference/keywords.cjs');
const isAutoprefixable = require('../../utils/isAutoprefixable.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'property-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected vendor-prefixed property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-no-vendor-prefix',
	fixable: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [validateTypes.isString, validateTypes.isRegExp],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const unprefixedProp = vendor.unprefixed(prop);

			//return early if property is to be ignored
			if (optionsMatches(secondaryOptions, 'ignoreProperties', unprefixedProp)) {
				return;
			}

			// Make sure there's a vendor prefix,
			// but this isn't a custom property

			if (prop[0] !== '-' || prop[1] === '-') {
				return;
			}

			if (!isAutoprefixable.property(prop)) {
				return;
			}

			// see whatwg/compat#28
			if (prop === '-webkit-background-size') {
				const backgrounds = decl.value.split(',');
				const isSafe = backgrounds.every((background) => {
					const values = background.trim().split(/\s+/);
					const length = values.length;
					const [first] = values;

					switch (length) {
						case 2:
							return true;
						case 1:
							return first && (first === 'auto' || keywords.basicKeywords.has(first));
						default:
							return false;
					}
				});

				if (!isSafe) return;
			}

			const fix = () => {
				decl.prop = isAutoprefixable.unprefix(decl.prop);
			};

			report({
				message: messages.rejected,
				messageArgs: [prop],
				word: prop,
				node: decl,
				result,
				ruleName,
				fix,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
