'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const { longhandTimeProperties, shorthandTimeProperties } = require('../../reference/properties');
const optionsMatches = require('../../utils/optionsMatches');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const vendor = require('../../utils/vendor');
const { isNumber } = require('../../utils/validateTypes');

const ruleName = 'time-min-milliseconds';

const messages = ruleMessages(ruleName, {
	expected: (time) => `Expected a minimum of ${time} milliseconds`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/time-min-milliseconds',
};

const DELAY_PROPERTIES = new Set(['animation-delay', 'transition-delay']);

/** @type {import('stylelint').Rule<number>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: isNumber,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['delay'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const minimum = primary;
		const ignoreDelay = optionsMatches(secondaryOptions, 'ignore', 'delay');

		root.walkDecls((decl) => {
			const propertyName = vendor.unprefixed(decl.prop.toLowerCase());
			const propertyValue = decl.value;

			if (
				longhandTimeProperties.has(propertyName) &&
				!isIgnoredProperty(propertyName) &&
				!isAcceptableTime(propertyValue)
			) {
				complain(decl, 0, propertyValue.length);
			}

			if (shorthandTimeProperties.has(propertyName)) {
				const valueListList = postcss.list.comma(propertyValue);

				for (const valueListString of valueListList) {
					const valueList = postcss.list.space(valueListString);

					if (ignoreDelay) {
						// Check only duration time values
						const duration = getDuration(valueList);

						if (duration && !isAcceptableTime(duration)) {
							complain(decl, propertyValue.indexOf(duration), duration.length);
						}
					} else {
						// Check all time values
						for (const value of valueList) {
							if (!isAcceptableTime(value)) {
								complain(decl, propertyValue.indexOf(value), value.length);
							}
						}
					}
				}
			}
		});

		/**
		 * Get the duration within an `animation` or `transition` shorthand property value.
		 *
		 * @param {string[]} valueList
		 * @returns {string | undefined}
		 */
		function getDuration(valueList) {
			for (const value of valueList) {
				const parsedTime = valueParser.unit(value);

				if (!parsedTime) continue;

				// The first numeric value in an animation shorthand is the duration.
				return value;
			}

			return undefined;
		}

		/**
		 * @param {string} propertyName
		 * @returns {boolean}
		 */
		function isIgnoredProperty(propertyName) {
			if (ignoreDelay && DELAY_PROPERTIES.has(propertyName)) {
				return true;
			}

			return false;
		}

		/**
		 * @param {string} time
		 * @returns {boolean}
		 */
		function isAcceptableTime(time) {
			const parsedTime = valueParser.unit(time);

			if (!parsedTime) return true;

			const numTime = Number(parsedTime.number);

			if (numTime <= 0) {
				return true;
			}

			const unit = parsedTime.unit.toLowerCase();

			if (unit === 'ms' && numTime < minimum) {
				return false;
			}

			if (unit === 's' && numTime * 1000 < minimum) {
				return false;
			}

			return true;
		}

		/**
		 * @param {import('postcss').Declaration} decl
		 * @param {number} offset
		 * @param {number} length
		 * @returns {void}
		 */
		function complain(decl, offset, length) {
			const index = declarationValueIndex(decl) + offset;
			const endIndex = index + length;

			report({
				result,
				ruleName,
				message: messages.expected(minimum),
				index,
				endIndex,
				node: decl,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
