import { ConfigurationError } from '../errors.mjs';
import validateGlobOptions from '../validateGlobOptions.mjs';

describe('validateGlobOptions', () => {
	it('does not throw when globOptions is undefined', () => {
		expect(() => validateGlobOptions(undefined)).not.toThrow();
	});

	it('does not throw for an empty object', () => {
		expect(() => validateGlobOptions({})).not.toThrow();
	});

	it('does not throw for a boolean "dot"', () => {
		expect(() => validateGlobOptions({ dot: true })).not.toThrow();
		expect(() => validateGlobOptions({ dot: false })).not.toThrow();
	});

	it('throws for a non-object', () => {
		expect(() => validateGlobOptions(true)).toThrow(
			'Invalid globOptions configuration: expected an object. Got "true".',
		);
		expect(() => validateGlobOptions(['dot'])).toThrow(
			'Invalid globOptions configuration: expected an object. Got "dot".',
		);
	});

	it('throws for an unknown option', () => {
		expect(() => validateGlobOptions({ cwd: '.' })).toThrow(
			'Invalid globOptions configuration: unknown option "cwd". Supported options: "dot".',
		);
	});

	it('throws for a non-boolean "dot"', () => {
		expect(() => validateGlobOptions({ dot: 'yes' })).toThrow(
			'Invalid globOptions configuration: "dot" must be a boolean. Got "yes".',
		);
	});

	it('throws a configuration error', () => {
		expect(() => validateGlobOptions({ cwd: '.' })).toThrow(ConfigurationError);
	});
});
