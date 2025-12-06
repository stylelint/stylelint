import process from 'node:process';

import { emitDeprecationWarning, emitExperimentalWarning } from '../emitWarning.mjs';

let emitWarning;

beforeEach(() => {
	emitWarning = import.meta.jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
});

afterEach(() => {
	emitWarning.mockRestore();
});

describe('emitting deprecation warnings', () => {
	it('emits a single warning', () => {
		emitDeprecationWarning('Feature "foo" is deprecated.', 'RULE', 'See [...]');

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Feature "foo" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'See [...]',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('emits two unrelated warnings', () => {
		emitDeprecationWarning('Feature "foo" is deprecated', 'RULE', 'foo detail.');

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Feature "foo" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'foo detail.',
				type: 'DeprecationWarning',
			}),
		);

		emitDeprecationWarning('Feature "bar" is deprecated', 'CONTEXT_FIX', 'bar detail.');

		expect(emitWarning).toHaveBeenCalledTimes(2);
		expect(emitWarning).toHaveBeenLastCalledWith(
			expect.stringMatching(/Feature "bar" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:005',
				detail: 'bar detail.',
				type: 'DeprecationWarning',
			}),
		);
	});

	it('does not emit a second instance of the same deprecation warning', () => {
		emitDeprecationWarning('Feature "foo" is deprecated', 'RULE', 'foo detail.');

		expect(emitWarning).toHaveBeenCalledTimes(1);
		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Feature "foo" is deprecated/),
			expect.objectContaining({
				code: 'stylelint:006',
				detail: 'foo detail.',
				type: 'DeprecationWarning',
			}),
		);

		emitDeprecationWarning('Feature "foo" is deprecated', 'RULE', 'foo detail.');

		expect(emitWarning).toHaveBeenCalledTimes(1);
	});
});

describe('emitting experimental warnings', () => {
	it('emits a single warning', () => {
		emitExperimentalWarning(
			'The suppressions feature is experimental.',
			'SUPPRESSIONS',
			'Please be careful when using this feature.',
		);

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/The suppressions feature is experimental/),
			expect.objectContaining({
				code: 'stylelint:101',
				detail: 'Please be careful when using this feature.',
				type: 'ExperimentalWarning',
			}),
		);
	});
});
