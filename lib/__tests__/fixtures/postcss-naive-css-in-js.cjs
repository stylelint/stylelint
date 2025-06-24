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

	// E.g. "css` color: red; `;"
	for (const match of source.matchAll(/\bcss`([^`]+)`;/g)) {
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
