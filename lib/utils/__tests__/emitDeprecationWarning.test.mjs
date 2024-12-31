import process from 'node:process';

import {
	clearEmittedDeprecationWarnings,
	emitDeprecationWarning,
} from '../emitDeprecationWarning.mjs';

let emitWarning;

beforeEach(() => {
	clearEmittedDeprecationWarnings();
	emitWarning = import.meta.jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
});

afterEach(() => {
	clearEmittedDeprecationWarnings();
	emitWarning.mockRestore();
});

describe('emitting deprecation warnings', () => {
	it('emits a single warning', () => {
		emitDeprecationWarning(
			`Rule "foo" is deprecated`,
			'RULE',
			`Please remove it from your config.`,
		);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Rule "foo" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'Please remove it from your config.',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('emits two unrelated warnings', () => {
		emitDeprecationWarning(
			`Rule "foo" is deprecated`,
			'RULE',
			`Please remove it from your config.`,
		);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Rule "foo" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'Please remove it from your config.',
				type: 'DeprecationWarning',
			}),
		);

		emitDeprecationWarning(
			`Rule "bar" is deprecated`,
			'RULE',
			`Please remove it from your config.`,
		);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Rule "bar" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'Please remove it from your config.',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('does not emit a second instance of the same deprecation warning', () => {
		emitDeprecationWarning(
			`Rule "foo" is deprecated`,
			'RULE',
			`Please remove it from your config.`,
		);

		expect(emitWarning).toHaveBeenCalledTimes(1);
		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Rule "foo" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'Please remove it from your config.',
				type: 'DeprecationWarning',
			}),
		);

		emitDeprecationWarning(
			`Rule "foo" is deprecated`,
			'RULE',
			`Please remove it from your config.`,
		);

		expect(emitWarning).toHaveBeenCalledTimes(1);
	});
});
