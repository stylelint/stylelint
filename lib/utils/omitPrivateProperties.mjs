/**
 * A replacer function for `JSON.stringify()` that omits properties whose keys start with an underscore (`_`).
 *
 * @example
 * const object = { name: 'Alice', _password: 'secret' };
 * JSON.stringify(object, omitPrivateProperties);
 * //=> '{"name":"Alice"}'
 *
 * @param {string} key
 * @param {unknown} value
 * @returns {unknown}
 */
export default function omitPrivateProperties(key, value) {
	return key.startsWith('_') ? undefined : value;
}
