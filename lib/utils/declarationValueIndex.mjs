import declarationRawsBetweenIndex from './declarationRawsBetweenIndex.mjs';
import { isString } from './validateTypes.mjs';

/**
 * Get the index of a declaration's value
 *
 * @param {import('postcss').Declaration} decl
 * @returns {number}
 */
export default function declarationValueIndex(decl) {
	const raws = decl.raws;

	return (
		declarationRawsBetweenIndex(decl) +
		[raws.between || ':', raws.value && 'prefix' in raws.value && raws.value.prefix].reduce(
			(/** @type {number} */ count, str) => {
				if (isString(str)) {
					return count + str.length;
				}

				return count;
			},
			0,
		)
	);
}
