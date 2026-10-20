import assert from 'node:assert/strict';
import { it } from 'node:test';

import hasBlock from '../hasBlock.mjs';
import postcss from 'postcss';

it('hasBlock', () => {
	assert.ok(postcssCheck('a {}'));
	assert.ok(postcssCheck('a { }'));
	assert.ok(postcssCheck('a {\n}'));
	assert.ok(postcssCheck('@media print {}'));
	assert.ok(postcssCheck('@supports (animation-name: test) {}'));
	assert.ok(postcssCheck('@document url(http://www.w3.org/) {}'));
	assert.ok(postcssCheck('@page :pseudo-class {}'));
	assert.ok(postcssCheck('@font-face {}'));
	assert.ok(postcssCheck('@keyframes identifier {}'));

	assert.ok(postcssCheck('a { color: pink; }'));
	assert.ok(postcssCheck('@media print { a { color: pink; } }'));
	assert.ok(postcssCheck('@supports (animation-name: test) { a { color: pink; } }'));
	assert.ok(postcssCheck('@document url(http://www.w3.org/) { a { color: pink; } }'));
	assert.ok(postcssCheck('@page :pseudo-class { a { color: pink; } }'));
	assert.ok(postcssCheck('@font-face { font-family: sans; }'));
	assert.ok(postcssCheck('@keyframes identifier { 0% { top: 0; left:} }'));

	assert.ok(!postcssCheck('@import url(x.css)'));
	assert.ok(!postcssCheck("@import 'x.css'"));
	assert.ok(!postcssCheck('@import "x.css"'));
	assert.ok(!postcssCheck('@charset "UTF-8"'));
	assert.ok(!postcssCheck('@namespace url(http://www.w3.org/1999/xhtml)'));
	assert.ok(!postcssCheck('@namespace svg url(http://www.w3.org/2000/svg)'));
});

function postcssCheck(cssString) {
	const root = postcss.parse(cssString);

	return hasBlock(root.first);
}
