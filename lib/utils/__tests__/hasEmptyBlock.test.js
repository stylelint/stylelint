'use strict';

const hasEmptyBlock = require('../hasEmptyBlock');
const postcss = require('postcss');

it('hasEmptyBlock', () => {
	expect(postcssCheck('a {}')).toBeTruthy();
	expect(postcssCheck('a { }')).toBeTruthy();
	expect(postcssCheck('a {\n}')).toBeTruthy();
	expect(postcssCheck('@media print {}')).toBeTruthy();
	expect(postcssCheck('@supports (animation-name: test) {}')).toBeTruthy();
	expect(postcssCheck('@document url(http://www.w3.org/) {}')).toBeTruthy();
	expect(postcssCheck('@page :pseudo-class {}')).toBeTruthy();
	expect(postcssCheck('@font-face {}')).toBeTruthy();
	expect(postcssCheck('@keyframes identifier {}')).toBeTruthy();

	expect(postcssCheck('a { color: pink; }')).toBeFalsy();
	expect(postcssCheck('@media print { a { color: pink; } }')).toBeFalsy();
	expect(postcssCheck('@supports (animation-name: test) { a { color: pink; } }')).toBeFalsy();
	expect(postcssCheck('@document url(http://www.w3.org/) { a { color: pink; } }')).toBeFalsy();
	expect(postcssCheck('@page :pseudo-class { a { color: pink; } }')).toBeFalsy();
	expect(postcssCheck('@font-face { font-family: sans; }')).toBeFalsy();
	expect(postcssCheck('@keyframes identifier { 0% { top: 0; left:} }')).toBeFalsy();
	expect(postcssCheck('@import url(x.css)')).toBeFalsy();
	expect(postcssCheck("@import 'x.css'")).toBeFalsy();
	expect(postcssCheck('@import "x.css"')).toBeFalsy();
	expect(postcssCheck('@charset "UTF-8"')).toBeFalsy();
	expect(postcssCheck('@namespace url(http://www.w3.org/1999/xhtml)')).toBeFalsy();
	expect(postcssCheck('@namespace svg url(http://www.w3.org/2000/svg)')).toBeFalsy();
});

function postcssCheck(cssString) {
	const root = postcss.parse(cssString);

	return hasEmptyBlock(root.first);
}
