'use strict';

const balancedMatch = require('balanced-match');

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'number-no-partial-percent';

const messages = ruleMessages(ruleName, {
	invalidPercent: 'Percent values must be 0% or 100%',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-partial-percent',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const value = decl.value;

			if (!value.includes('%')) return;

			// Match that start of color functions and percent values
			const matches = value.matchAll(/(?:rgba?|color)\s*\(|[\d.]+%/g);

			if (matches == null) return;

			let lastFuncEndIndex = -1;

			for (const match of matches) {
				const [text] = match;
				const { index } = match;

				if (index == null) continue;

				if (text.endsWith('(')) {
					// find the end of the function
					const funcMatch = balancedMatch('(', ')', value.substring(index));

					lastFuncEndIndex = funcMatch ? index + funcMatch.end : -1;
					continue;
				} else if (lastFuncEndIndex !== -1 && lastFuncEndIndex > index) {
					// the current match is inside a previously matched function
					continue;
				} else if (text === '0%' || text === '100%') continue;

				report({
					ruleName,
					result,
					index,
					endIndex: index == null ? undefined : index + text.length,
					node: decl,
					message: messages.invalidPercent,
					word: text,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
