import { jest } from '@jest/globals';

describe('terminallink', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('returns an ANSI escaped link', async () => {
		process.env = { ...originalEnv, FORCE_HYPERLINK: '1' };

		const { default: terminalLink } = await import('../terminalLink.mjs');

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe(
			'\u001B]8;;https://stylelint.io/\u0007stylelint\u001B]8;;\u0007',
		);
	});

	it('returns a passed text with an unsupported environment', async () => {
		process.env = { ...originalEnv, FORCE_HYPERLINK: '0' };

		const { default: terminalLink } = await import('../terminalLink.mjs');

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe('stylelint');
	});
});
