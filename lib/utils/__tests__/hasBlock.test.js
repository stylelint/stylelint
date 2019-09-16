'use strict';

const hasBlock = require('../hasBlock');
const postcss = require('postcss');

it('hasBlock', () => {
	expect(postcssCheck('a {}')).toBeTruthy();
	expect(postcssCheck('a { }')).toBeTruthy();
	expect(postcssCheck('a {\n}')).toBeTruthy();
	expect(postcssCheck('@media print {}')).toBeTruthy();
	expect(postcssCheck('@supports (animation-name: test) {}')).toBeTruthy();
	expect(postcssCheck('@document url(http://www.w3.org/) {}')).toBeTruthy();
	expect(postcssCheck('@page :pseudo-class {}')).toBeTruthy();
	expect(postcssCheck('@font-face {}')).toBeTruthy();
	expect(postcssCheck('@keyframes identifier {}')).toBeTruthy();

	expect(postcssCheck('a { color: pink; }')).toBeTruthy();
	expect(postcssCheck('@media print { a { color: pink; } }')).toBeTruthy();
	expect(postcssCheck('@supports (animation-name: test) { a { color: pink; } }')).toBeTruthy();
	expect(postcssCheck('@document url(http://www.w3.org/) { a { color: pink; } }')).toBeTruthy();
	expect(postcssCheck('@page :pseudo-class { a { color: pink; } }')).toBeTruthy();
	expect(postcssCheck('@font-face { font-family: sans; }')).toBeTruthy();
	expect(postcssCheck('@keyframes identifier { 0% { top: 0; left:} }')).toBeTruthy();

	expect(postcssCheck('@import url(x.css)')).toBeFalsy();
	expect(postcssCheck("@import 'x.css'")).toBeFalsy();
	expect(postcssCheck('@import "x.css"')).toBeFalsy();
	expect(postcssCheck('@charset "UTF-8"')).toBeFalsy();
	expect(postcssCheck('@namespace url(http://www.w3.org/1999/xhtml)')).toBeFalsy();
	expect(postcssCheck('@namespace svg url(http://www.w3.org/2000/svg)')).toBeFalsy();
});

function postcssCheck(cssString) {
	const root = postcss.parse(cssString);

	return hasBlock(root.first);
}
