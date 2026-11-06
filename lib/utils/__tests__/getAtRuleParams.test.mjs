import { describe, it } from 'node:test';

import postcss from 'postcss';

import getAtRuleParams from '../getAtRuleParams.mjs';

const node = (code) => postcss.parse(code).first;

describe('getAtRuleParams', () => {
	it('returns the params', (t) => {
		t.assert.strictEqual(getAtRuleParams(node('@media all {}')), 'all');
	});

	it('returns the raw params with their comment', (t) => {
		t.assert.strictEqual(
			getAtRuleParams(node('@media all /* foo */ and print {}')),
			'all /* foo */ and print',
		);
	});

	it('returns new params assigned over raw ones', (t) => {
		const atRule = node('@media all /* foo */ and print {}');

		atRule.params = 'screen';

		t.assert.strictEqual(getAtRuleParams(atRule), 'screen');
	});
});
