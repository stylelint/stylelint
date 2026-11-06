import { describe, it } from 'node:test';

import postcss from 'postcss';

import getAtRuleParams from '../getAtRuleParams.mjs';
import setAtRuleParams from '../setAtRuleParams.mjs';

const node = (code) => postcss.parse(code).first;

describe('setAtRuleParams', () => {
	it('sets the params', (t) => {
		const atRule = setAtRuleParams(node('@media screen {}'), 'print');

		t.assert.strictEqual(atRule.toString(), '@media print {}');
		t.assert.strictEqual(getAtRuleParams(atRule), 'print');
		t.assert.strictEqual(atRule.params, 'print');
	});

	it('sets the raw params when the params have a comment', (t) => {
		const atRule = setAtRuleParams(
			node('@media screen, /* foo */ print {}'),
			'screen, /* foo */ projection',
		);

		t.assert.strictEqual(atRule.toString(), '@media screen, /* foo */ projection {}');
		t.assert.strictEqual(getAtRuleParams(atRule), 'screen, /* foo */ projection');
		t.assert.strictEqual(atRule.params, 'screen,  projection');
	});
});
