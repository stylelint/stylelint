import process from 'node:process';

import emitExperimentalWarning from '../emitExperimentalWarning.mjs';

let emitWarning;

beforeEach(() => {
	emitWarning = import.meta.jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
});

afterEach(() => {
	emitWarning.mockRestore();
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
				code: 'stylelint:001',
				detail: 'Please be careful when using this feature.',
				type: 'ExperimentalWarning',
			}),
		);
	});

	it('emits two unrelated warnings', () => {
		emitExperimentalWarning('Feature "foo" is experimental', 'SUPPRESSIONS', 'foo detail.');

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Feature "foo" is experimental/),
			expect.objectContaining({
				code: 'stylelint:001',
				detail: 'foo detail.',
				type: 'ExperimentalWarning',
			}),
		);

		emitExperimentalWarning('Feature "bar" is experimental', 'SUPPRESSIONS', 'bar detail.');

		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Feature "bar" is experimental/),
			expect.objectContaining({
				code: 'stylelint:001',
				detail: 'bar detail.',
				type: 'ExperimentalWarning',
			}),
		);
	});

	it('does not emit a second instance of the same experimental warning', () => {
		emitExperimentalWarning('Feature "foo" is experimental', 'SUPPRESSIONS', 'foo detail.');

		expect(emitWarning).toHaveBeenCalledTimes(1);
		expect(emitWarning).toHaveBeenCalledWith(
			expect.stringMatching(/Feature "foo" is experimental/),
			expect.objectContaining({
				code: 'stylelint:001',
				detail: 'foo detail.',
				type: 'ExperimentalWarning',
			}),
		);

		emitExperimentalWarning('Feature "foo" is experimental', 'SUPPRESSIONS', 'foo detail.');

		expect(emitWarning).toHaveBeenCalledTimes(1);
	});
});
