import { describe, it } from 'node:test';
import process from 'node:process';

import { emitRuleDeprecationWarning, getRuleDeprecationMessage } from '../ruleDeprecation.mjs';

describe('getRuleDeprecationMessage', () => {
	it('names the rule', (t) => {
		t.assert.strictEqual(getRuleDeprecationMessage('foo'), 'The "foo" rule is deprecated.');
	});
});

describe('emitRuleDeprecationWarning', () => {
	it('emits a deprecation warning', (t) => {
		const emitWarning = t.mock.method(process, 'emitWarning', () => {});

		emitRuleDeprecationWarning('foo');

		t.assert.deepStrictEqual(
			emitWarning.mock.calls.map((call) => call.arguments),
			[
				[
					'The "foo" rule is deprecated.',
					{
						type: 'DeprecationWarning',
						code: 'stylelint:006',
						detail: 'Please be aware that the "foo" rule will soon be either removed or renamed.',
					},
				],
			],
		);
	});
});
