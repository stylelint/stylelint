'use strict';

const blockString = require('../blockString');
const postcss = require('postcss');

it('blockString rules', () => {
	expect(postcssCheck('a { color: pink; }')).toBe('{ color: pink; }');
	expect(postcssCheck('a {\n\tcolor: pink;\n\ttop: 0;\n}')).toBe('{\n\tcolor: pink;\n\ttop: 0;\n}');
});

it('blockString at-rules', () => {
	expect(postcssCheck('@media print { a { color: pink; } }')).toBe('{ a { color: pink; } }');
	expect(
		postcssCheck('@keyframes foo {\n  0% {\n  top: 0;\n}\n\n  100% {\n  top: 10px;\n}\n}\n'),
	).toBe('{\n  0% {\n  top: 0;\n}\n\n  100% {\n  top: 10px;\n}\n}');
});

function postcssCheck(cssString) {
	const root = postcss.parse(cssString);

	return blockString(root.first);
}
