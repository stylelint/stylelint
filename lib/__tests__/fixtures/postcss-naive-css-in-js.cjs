const postcss = require('postcss');

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
		document.append(postcss.parse(match[1]));
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
	}
}

module.exports = { parse, stringify };
