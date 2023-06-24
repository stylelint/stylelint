import { jest } from '@jest/globals';

// TODO: Remove `require` when migrating to ESM.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

describe('terminallink', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('returns an ANSI escaped link', () => {
		process.env = { ...originalEnv, FORCE_HYPERLINK: '1' };
		const terminalLink = require('../terminalLink.js');

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe(
			'\u001B]8;;https://stylelint.io/\u0007stylelint\u001B]8;;\u0007',
		);
	});

	it('returns a passed text with an unsupported environment', () => {
		process.env = { ...originalEnv, FORCE_HYPERLINK: '0' };
		const terminalLink = require('../terminalLink.js');

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe('stylelint');
	});
});
