import { it } from 'node:test';

import hasBlock from '../hasBlock.mjs';
import postcss from 'postcss';

it('hasBlock', (t) => {
	t.assert.ok(postcssCheck('a {}'));
	t.assert.ok(postcssCheck('a { }'));
	t.assert.ok(postcssCheck('a {\n}'));
	t.assert.ok(postcssCheck('@media print {}'));
	t.assert.ok(postcssCheck('@supports (animation-name: test) {}'));
	t.assert.ok(postcssCheck('@document url(http://www.w3.org/) {}'));
	t.assert.ok(postcssCheck('@page :pseudo-class {}'));
	t.assert.ok(postcssCheck('@font-face {}'));
	t.assert.ok(postcssCheck('@keyframes identifier {}'));

	t.assert.ok(postcssCheck('a { color: pink; }'));
	t.assert.ok(postcssCheck('@media print { a { color: pink; } }'));
	t.assert.ok(postcssCheck('@supports (animation-name: test) { a { color: pink; } }'));
	t.assert.ok(postcssCheck('@document url(http://www.w3.org/) { a { color: pink; } }'));
	t.assert.ok(postcssCheck('@page :pseudo-class { a { color: pink; } }'));
	t.assert.ok(postcssCheck('@font-face { font-family: sans; }'));
	t.assert.ok(postcssCheck('@keyframes identifier { 0% { top: 0; left:} }'));

	t.assert.ok(!postcssCheck('@import url(x.css)'));
	t.assert.ok(!postcssCheck("@import 'x.css'"));
	t.assert.ok(!postcssCheck('@import "x.css"'));
	t.assert.ok(!postcssCheck('@charset "UTF-8"'));
	t.assert.ok(!postcssCheck('@namespace url(http://www.w3.org/1999/xhtml)'));
	t.assert.ok(!postcssCheck('@namespace svg url(http://www.w3.org/2000/svg)'));
});

function postcssCheck(cssString) {
	const root = postcss.parse(cssString);

	return hasBlock(root.first);
}
