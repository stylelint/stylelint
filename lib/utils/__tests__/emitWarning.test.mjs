import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';

import { emitDeprecationWarning, emitExperimentalWarning } from '../emitWarning.mjs';

let emitWarning;

beforeEach((t) => {
	emitWarning = t.mock.method(process, 'emitWarning', () => {});
});

describe('emitting deprecation warnings', () => {
	it('emits a single warning', () => {
		emitDeprecationWarning('Feature "foo" is deprecated.', 'RULE', 'See [...]');

		assertWarning(emitWarning.mock.calls[0], /Feature "foo" is deprecated/, {
			code: 'stylelint:006',
			detail: 'See [...]',
			type: 'DeprecationWarning',
		});
	});

	it('emits two unrelated warnings', (t) => {
		emitDeprecationWarning('Feature "foo" is deprecated', 'RULE', 'foo detail.');

		assertWarning(emitWarning.mock.calls[0], /Feature "foo" is deprecated/, {
			code: 'stylelint:006',
			detail: 'foo detail.',
			type: 'DeprecationWarning',
		});

		emitDeprecationWarning('Feature "bar" is deprecated', 'RULE_OPTION', 'bar detail.');

		t.assert.strictEqual(emitWarning.mock.callCount(), 2);
		assertWarning(emitWarning.mock.calls[1], /Feature "bar" is deprecated/, {
			code: 'stylelint:008',
			detail: 'bar detail.',
			type: 'DeprecationWarning',
		});
	});

	it('does not emit a second instance of the same deprecation warning', (t) => {
		emitDeprecationWarning('Feature "foo" is deprecated', 'RULE', 'foo detail.');

		t.assert.strictEqual(emitWarning.mock.callCount(), 1);
		assertWarning(emitWarning.mock.calls[0], /Feature "foo" is deprecated/, {
			code: 'stylelint:006',
			detail: 'foo detail.',
			type: 'DeprecationWarning',
		});

		emitDeprecationWarning('Feature "foo" is deprecated', 'RULE', 'foo detail.');

		t.assert.strictEqual(emitWarning.mock.callCount(), 1);
	});
});

describe('emitting experimental warnings', () => {
	it('emits a single warning', () => {
		emitExperimentalWarning(
			'The suppressions feature is experimental.',
			'SUPPRESSIONS',
			'Please be careful when using this feature.',
		);

		assertWarning(emitWarning.mock.calls[0], /The suppressions feature is experimental/, {
			code: 'stylelint:101',
			detail: 'Please be careful when using this feature.',
			type: 'ExperimentalWarning',
		});
	});
});

function assertWarning(call, expectedMessage, expectedOptions) {
	const [message, options] = call.arguments;

	assert.match(message, expectedMessage);
	assert.partialDeepStrictEqual(options, expectedOptions);
}
