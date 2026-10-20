import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { EXIT_CODE_INVALID_CONFIG } from '../constants.mjs';
import validateLanguageOptions from '../validateLanguageOptions.mjs';

describe('validateLanguageOptions', () => {
	it('does not throw when no directionality is set', () => {
		assert.doesNotThrow(() => validateLanguageOptions({}));
	});

	it('does not throw when directionality is empty', () => {
		assert.doesNotThrow(() => validateLanguageOptions({ languageOptions: { directionality: {} } }));
	});

	it('does not throw for valid perpendicular axes (TTB, LTR)', () => {
		assert.doesNotThrow(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'top-to-bottom', inline: 'left-to-right' },
				},
			}),
		);
	});

	it('does not throw for valid perpendicular axes (TTB, RTL)', () => {
		assert.doesNotThrow(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'top-to-bottom', inline: 'right-to-left' },
				},
			}),
		);
	});

	it('does not throw for valid perpendicular axes (RTL, TTB)', () => {
		assert.doesNotThrow(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'right-to-left', inline: 'top-to-bottom' },
				},
			}),
		);
	});

	it('does not throw for valid perpendicular axes (LTR, TTB)', () => {
		assert.doesNotThrow(() =>
			validateLanguageOptions({
				languageOptions: {
					directionality: { block: 'left-to-right', inline: 'top-to-bottom' },
				},
			}),
		);
	});

	it('throws when only inline is specified', () => {
		assert.throws(
			() =>
				validateLanguageOptions({
					languageOptions: {
						directionality: { inline: 'right-to-left' },
					},
				}),
			{
				message:
					'Invalid languageOptions.directionality configuration: both "block" and "inline" must be specified.',
			},
		);
	});

	it('throws when only block is specified', () => {
		assert.throws(
			() =>
				validateLanguageOptions({
					languageOptions: {
						directionality: { block: 'bottom-to-top' },
					},
				}),
			{
				message:
					'Invalid languageOptions.directionality configuration: both "block" and "inline" must be specified.',
			},
		);
	});

	it('throws when both are vertical (same axis)', () => {
		assert.throws(
			() =>
				validateLanguageOptions({
					languageOptions: {
						directionality: { block: 'top-to-bottom', inline: 'bottom-to-top' },
					},
				}),
			{
				message:
					/^Invalid languageOptions\.directionality configuration: "block" and "inline" must be on perpendicular axes\./,
			},
		);
	});

	it('throws when both are horizontal (same axis)', () => {
		assert.throws(
			() =>
				validateLanguageOptions({
					languageOptions: {
						directionality: { block: 'left-to-right', inline: 'right-to-left' },
					},
				}),
			{
				message:
					/^Invalid languageOptions\.directionality configuration: "block" and "inline" must be on perpendicular axes\./,
			},
		);
	});

	it('throws for an invalid direction value', () => {
		assert.throws(
			() =>
				validateLanguageOptions({
					languageOptions: {
						directionality: { inline: 'invalid-value', block: 'top-to-bottom' },
					},
				}),
			{
				message:
					'Invalid languageOptions.directionality configuration: "inline" must be one of "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left". Got "invalid-value".',
			},
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

		assert.notEqual(caughtError, undefined);
		assert.equal(caughtError.code, EXIT_CODE_INVALID_CONFIG);
	});
});
