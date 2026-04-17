import { EXIT_CODE_INVALID_CONFIG } from '../constants.mjs';
import validateLanguageOptions from '../validateLanguageOptions.mjs';

describe('validateLanguageOptions', () => {
	it('does not throw when no directionality is set', () => {
		expect(() => validateLanguageOptions({})).not.toThrow();
	});

	it('does not throw when directionality is empty', () => {
		expect(() =>
			validateLanguageOptions({ languageOptions: { directionality: {} } }),
		).not.toThrow();
	});

	it('does not throw for valid perpendicular axes (TTB, LTR)', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'top-to-bottom', inline: 'left-to-right' },
				},
			}),
		).not.toThrow();
	});

	it('does not throw for valid perpendicular axes (TTB, RTL)', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'top-to-bottom', inline: 'right-to-left' },
				},
			}),
		).not.toThrow();
	});

	it('does not throw for valid perpendicular axes (RTL, TTB)', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'right-to-left', inline: 'top-to-bottom' },
				},
			}),
		).not.toThrow();
	});

	it('does not throw for valid perpendicular axes (LTR, TTB)', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'left-to-right', inline: 'top-to-bottom' },
				},
			}),
		).not.toThrow();
	});

	it('throws when only inline is specified', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { inline: 'right-to-left' },
				},
			}),
		).toThrow(
			'Invalid languageOptions.directionality configuration: both "block" and "inline" must be specified.',
		);
	});

	it('throws when only block is specified', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'bottom-to-top' },
				},
			}),
		).toThrow(
			'Invalid languageOptions.directionality configuration: both "block" and "inline" must be specified.',
		);
	});

	it('throws when both are vertical (same axis)', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'top-to-bottom', inline: 'bottom-to-top' },
				},
			}),
		).toThrow(
			'Invalid languageOptions.directionality configuration: "block" and "inline" must be on perpendicular axes.',
		);
	});

	it('throws when both are horizontal (same axis)', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'left-to-right', inline: 'right-to-left' },
				},
			}),
		).toThrow(
			'Invalid languageOptions.directionality configuration: "block" and "inline" must be on perpendicular axes.',
		);
	});

	it('throws for an invalid direction value', () => {
		expect(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { inline: 'invalid-value', block: 'top-to-bottom' },
				},
			}),
		).toThrow(
			'Invalid languageOptions.directionality configuration: "inline" must be one of "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left". Got "invalid-value".',
		);
	});

	it('sets EXIT_CODE_INVALID_CONFIG on thrown errors', () => {
		let caughtError;

		try {
			validateLanguageOptions({
				languageOptions: {
					directionality: { inline: 'right-to-left' },
				},
			});
		} catch (error) {
			caughtError = error;
		}

		expect(caughtError).toBeDefined();
		expect(caughtError.code).toBe(EXIT_CODE_INVALID_CONFIG);
	});
});
