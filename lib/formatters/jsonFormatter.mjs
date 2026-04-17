import omitPrivateProperties from '../utils/omitPrivateProperties.mjs';

/**
 * Omit any properties starting with `_`, which are fake-private
 *
 * @type {import('stylelint').Formatter}
 */
export default function jsonFormatter(results) {
	return JSON.stringify(results, omitPrivateProperties);
}
