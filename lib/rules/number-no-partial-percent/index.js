'use strict';

const balancedMatch = require('balanced-match');

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'number-no-partial-percent';

const messages = ruleMessages(ruleName, {
	invalidPercent: 'Percent values must be either 0% or 100%',
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

			// Match the start of color functions,
			// functions where their content should be ignored and percent value can be found inside of them (such as `url("data:image/svg+xml,203%22")`),
			// and percent values
			const matches = value.matchAll(
				/(?:rgba?|color|color-mix|color-contrast|device-cmyk|hsl|hwb|lch|oklch|lab|oklab|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient|opacity|brightness|contrast|grayscale|invert|saturate|sepia|url|image|image-set|cross-fade|element|paint|circle|ellipse|inset|polygon|path)\s*\(|[\d.]+%/g,
			);

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
