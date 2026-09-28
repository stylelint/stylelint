import { ConfigurationError } from '../errors.mjs';
import validateGlobbyOptions from '../validateGlobbyOptions.mjs';

describe('validateGlobbyOptions', () => {
	it('does not throw when globbyOptions is undefined', () => {
		expect(() => validateGlobbyOptions(undefined)).not.toThrow();
	});

	it('does not throw for an empty object', () => {
		expect(() => validateGlobbyOptions({})).not.toThrow();
	});

	it('does not throw for the supported options', () => {
		expect(() =>
			validateGlobbyOptions({
				braceExpansion: false,
				caseSensitiveMatch: false,
				dot: true,
				extglob: false,
				followSymbolicLinks: false,
				ignore: ['**/foo/**'],
			}),
		).not.toThrow();
	});

	it('throws for a non-object', () => {
		expect(() => validateGlobbyOptions(true)).toThrow(
			'Invalid globbyOptions configuration: expected an object. Got "true".',
		);
		expect(() => validateGlobbyOptions(['dot'])).toThrow(
			'Invalid globbyOptions configuration: expected an object. Got "dot".',
		);
	});

	it('throws for an unknown option', () => {
		expect(() => validateGlobbyOptions({ cwd: '.' })).toThrow(
			'Invalid globbyOptions configuration: unknown option "cwd". Supported options: "braceExpansion", "caseSensitiveMatch", "dot", "extglob", "followSymbolicLinks", "ignore".',
		);
	});

	it('throws a configuration error', () => {
		expect(() => validateGlobbyOptions({ cwd: '.' })).toThrow(ConfigurationError);
	});
});
