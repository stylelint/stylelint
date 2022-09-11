'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const { longhandTimeProperties, shorthandTimeProperties } = require('../../reference/properties');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const vendor = require('../../utils/vendor');
const { isNumber } = require('../../utils/validateTypes');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const getDimension = require('../../utils/getDimension');

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
			const parsedValue = valueParser(getDeclarationValue(decl));
			let timeValueCount = 0;

			parsedValue.walk((node) => {
				const { value, sourceIndex } = node;
				const dimension = getDimension(node);

				if (
					longhandTimeProperties.has(propertyName) &&
					!isIgnoredProperty(propertyName) &&
					!isAcceptableTime(dimension)
				) {
					complain(decl, 0, propertyValue.length);
				}

				if (!shorthandTimeProperties.has(propertyName)) return;

				timeValueCount = calcTimeValueCount(dimension, value, timeValueCount);

				if (isAcceptableTime(dimension) || (ignoreDelay && timeValueCount !== 1)) return;

				complain(decl, sourceIndex, value.length);
			});
		});

		/**
		 * @param {{unit: string | null, number: string | null}} dimension
		 * @param {string} value
		 * @param {number} valueTimeCount
		 * @returns {number}
		 */
		function calcTimeValueCount(dimension, value, valueTimeCount) {
			const { unit } = dimension;

			if (unit !== null) valueTimeCount++;

			if (value === ',') valueTimeCount = 0;

			return valueTimeCount;
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
		 * @param {import('postcss-value-parser').Dimension | {unit: null, number: null}} dimension
		 * @returns {boolean}
		 */
		function isAcceptableTime(dimension) {
			const { unit, number } = dimension;

			if (unit === null || number === null) return true;

			const numTime = Number(number);

			if (numTime <= 0) {
				return true;
			}

			const timeUnit = unit.toLowerCase();

			if (timeUnit === 'ms' && numTime < minimum) {
				return false;
			}

			if (timeUnit === 's' && numTime * 1000 < minimum) {
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
