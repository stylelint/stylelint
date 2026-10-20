import { afterEach, beforeEach, describe, it } from 'node:test';
import { EOL } from 'node:os';
import assert from 'node:assert/strict';
import process from 'node:process';

import createDebug from '../createDebug.mjs';

const OLD_ENV = process.env;

let write;

beforeEach((t) => {
	process.env = { ...OLD_ENV };
	write = t.mock.method(process.stderr, 'write', () => {});
});

afterEach(() => {
	process.env = OLD_ENV;
});

describe('createDebug()', () => {
	it('writes nothing when DEBUG is unset', () => {
		delete process.env.DEBUG;

		createDebug('stylelint:foo')('bar');

		assert.equal(write.mock.callCount(), 0);
	});

	for (const value of [
		'*',
		'stylelint:*',
		'stylelint:foo',
		'baz,stylelint:foo',
		'baz stylelint:foo',
	]) {
		it(`writes the namespace and message to stderr when DEBUG is "${value}"`, () => {
			process.env.DEBUG = value;

			createDebug('stylelint:foo')('bar');

			assert.deepEqual(
				write.mock.calls.map((call) => call.arguments),
				[[`stylelint:foo bar${EOL}`]],
			);
		});
	}

	for (const value of ['', 'baz', 'stylelint', 'stylelint:fo', 'stylelint:foo:*']) {
		it(`writes nothing when DEBUG is "${value}"`, () => {
			process.env.DEBUG = value;

			createDebug('stylelint:foo')('bar');

			assert.equal(write.mock.callCount(), 0);
		});
	}
});
