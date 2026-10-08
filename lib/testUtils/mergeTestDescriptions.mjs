/** @typedef {{ accept?: object[], reject?: object[] }} TestCases */

/**
 * @param {TestCases} shared
 * @param {TestCases} schema
 * @returns {TestCases}
 */
export default function mergeTestDescriptions(shared, schema) {
	return {
		...schema,
		accept: [...(shared.accept ?? []), ...(schema.accept ?? [])],
		reject: [...(shared.reject ?? []), ...(schema.reject ?? [])],
	};
}
