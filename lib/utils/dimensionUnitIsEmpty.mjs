import valueParser from 'postcss-value-parser';

/**
 * @param {string} value
 */
export default function dimensionUnitIsEmpty(value) {
	const dimension = valueParser.unit(value);

	return dimension && dimension.unit === '';
}
