import merge from 'deepmerge';

/**
 * @param {...object} args
 * @returns {object}
 */
export default function mergeTestDescriptions(...args) {
	return merge.all(args);
}
