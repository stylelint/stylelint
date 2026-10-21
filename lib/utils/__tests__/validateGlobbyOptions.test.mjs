import { describe, it } from 'node:test';

import { ConfigurationError } from '../errors.mjs';
import validateGlobbyOptions from '../validateGlobbyOptions.mjs';

describe('validateGlobbyOptions', () => {
	it('does not throw when globbyOptions is undefined', (t) => {
		t.assert.doesNotThrow(() => validateGlobbyOptions(undefined));
	});

	it('does not throw for an empty object', (t) => {
		t.assert.doesNotThrow(() => validateGlobbyOptions({}));
	});

	it('does not throw for the supported options', (t) => {
		t.assert.doesNotThrow(() =>
			validateGlobbyOptions({
				braceExpansion: false,
				caseSensitiveMatch: false,
				dot: true,
				extglob: false,
				followSymbolicLinks: false,
				ignore: ['**/foo/**'],
			}),
		);
	});

	it('throws for a non-object', (t) => {
		t.assert.throws(() => validateGlobbyOptions(true), {
			message: 'Invalid globbyOptions configuration: expected an object. Got "true".',
		});
		t.assert.throws(() => validateGlobbyOptions(['dot']), {
			message: 'Invalid globbyOptions configuration: expected an object. Got "dot".',
		});
	});

	it('throws for an unknown option', (t) => {
		t.assert.throws(() => validateGlobbyOptions({ cwd: '.' }), {
			message:
				'Invalid globbyOptions configuration: unknown option "cwd". Supported options: "braceExpansion", "caseSensitiveMatch", "dot", "extglob", "followSymbolicLinks", "ignore".',
		});
	});

	it('throws a configuration error', (t) => {
		t.assert.throws(() => validateGlobbyOptions({ cwd: '.' }), ConfigurationError);
	});
});
