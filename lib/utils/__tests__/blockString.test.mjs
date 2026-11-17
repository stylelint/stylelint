import { it } from 'node:test';

import blockString from '../blockString.mjs';
import postcss from 'postcss';

it('blockString rules', (t) => {
	t.assert.strictEqual(postcssCheck('a { color: pink; }'), '{ color: pink; }');
	t.assert.strictEqual(
		postcssCheck('a {\n\tcolor: pink;\n\ttop: 0;\n}'),
		'{\n\tcolor: pink;\n\ttop: 0;\n}',
	);
});

it('blockString at-rules', (t) => {
	t.assert.strictEqual(
		postcssCheck('@media print { a { color: pink; } }'),
		'{ a { color: pink; } }',
	);
	t.assert.strictEqual(
		postcssCheck('@keyframes foo {\n  0% {\n  top: 0;\n}\n\n  100% {\n  top: 10px;\n}\n}\n'),
		'{\n  0% {\n  top: 0;\n}\n\n  100% {\n  top: 10px;\n}\n}',
	);
});

it('blockString no block', (t) => {
	t.assert.strictEqual(postcssCheck('@import url(foo.css);'), '');
});

it('blockString returns a block changed after an earlier call', (t) => {
	const ruleNode = postcss.parse('a { color: pink; }').first;

	blockString(ruleNode);
	ruleNode.first.value = 'red';

	t.assert.strictEqual(blockString(ruleNode), '{ color: red; }');
});

function postcssCheck(cssString) {
	const root = postcss.parse(cssString);

	return blockString(root.first);
}
