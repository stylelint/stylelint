import { isTokenComment, isTokenWhitespace, tokenize } from '@csstools/css-tokenizer';

/**
 * Remove comments and insignificant trailing whitespace the way PostCSS does.
 *
 * @param {string} raw
 * @param {boolean} [customProperty]
 * @returns {string}
 */
export default function cleanRaws(raw, customProperty = false) {
	const tokens = tokenize({ css: raw }).slice(0, -1); // trim trailing EOF
	let value = '';
	let last = '';

	tokens.forEach((token, i) => {
		if (isTokenWhitespace(token) && i === tokens.length - 1 && !customProperty) {
			return;
		}

		if (isTokenComment(token)) {
			const prev = tokens[i - 1];
			const next = tokens[i + 1];

			if (!prev || !next) return;

			if (!isTokenWhitespace(prev) && !isTokenWhitespace(next) && last !== ',') {
				value += token[1];
				last = token[1].slice(-1);
			}

			return;
		}

		value += token[1];
		last = token[1].slice(-1);
	});

	return value;
}
