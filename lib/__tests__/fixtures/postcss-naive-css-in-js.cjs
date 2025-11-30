const postcss = require('postcss');
const safeParse = require('postcss-safe-parser');

/**
 * @type {postcss.Parser<postcss.Document>}
 */
function parse(css) {
	const source = typeof css === 'string' ? css : css.toString();

	const document = postcss.document({
		source: {
			input: new postcss.Input(source),
		},
	});

	let noMatches = true;

	// E.g. "css` color: red; `;"
	for (const match of source.matchAll(/\bcss`([^`]+)`;/g)) {
		noMatches = false;

		let parsedNode;

		try {
			parsedNode = postcss.parse(match[1]);
		} catch (error) {
			if (error.name === 'CssSyntaxError') {
				parsedNode = safeParse(match[1]);
			} else {
				throw error;
			}
		}

		document.append(parsedNode);
	}

	if (noMatches) {
		throw new Error('No CSS-in-JS code found in the input source. Ensure it contains valid CSS-in-JS code, such as "css` color: red; `;"');
	}

	return document;
}

/**
 * @type {postcss.Stringifier}
 */
function stringify(node, builder) {
	if (node.type === 'document') {
		node.each((root) => {
			builder(`css\`${root}\`;`, root);
		});
	} else {
		postcss.stringify(node, builder);
	}
}

module.exports = { parse, stringify };
