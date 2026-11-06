import { describe, it } from 'node:test';

import postcss from 'postcss';

import isSingleLineBlock from '../isSingleLineBlock.mjs';

const node = (code) => postcss.parse(code).first;

describe('isSingleLineBlock', () => {
	it('returns true for a block on a single line', (t) => {
		t.assert.strictEqual(isSingleLineBlock(node('a { color: red; }')), true);
	});

	it('returns false for a newline before the closing brace', (t) => {
		t.assert.strictEqual(isSingleLineBlock(node('a { color: red;\n}')), false);
	});

	it('returns false for a newline elsewhere in the block', (t) => {
		t.assert.strictEqual(isSingleLineBlock(node('a {\ncolor: red; }')), false);
	});

	it('returns true for a newline in the selector', (t) => {
		t.assert.strictEqual(isSingleLineBlock(node('a,\nb { color: red; }')), true);
	});

	it('returns false for a rule created without raws', (t) => {
		const ruleNode = postcss.rule({ selector: 'a' });

		ruleNode.append({ prop: 'color', value: 'red' });

		t.assert.strictEqual(isSingleLineBlock(ruleNode), false);
	});
});
