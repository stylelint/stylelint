import process from 'node:process';

import terminalLink from '../terminalLink.mjs';
import withMockedPlatform from '../../testUtils/withMockedPlatform.mjs';

const OLD_ENV = process.env;

const link = '\u001B]8;;https://stylelint.io/\u0007stylelint\u001B]8;;\u0007';

let actualTTY;

/**
 * @param {NodeJS.Platform} platform
 * @returns {Promise<unknown>}
 */
function terminalLinkOn(platform) {
	return withMockedPlatform(platform, async () =>
		terminalLink('stylelint', 'https://stylelint.io/'),
	);
}

beforeEach(() => {
	actualTTY = process.stdout.isTTY;
	process.env = { ...OLD_ENV };
	delete process.env.CI;
	delete process.env.TERM;
	delete process.env.WT_SESSION;
});

afterEach(() => {
	process.stdout.isTTY = actualTTY;
	process.env = OLD_ENV;
});

describe('terminalLink()', () => {
	it('links the text when stdout is a terminal', async () => {
		process.stdout.isTTY = true;

		expect(await terminalLinkOn('linux')).toBe(link);
	});

	it('returns the text unchanged when stdout is not a terminal', async () => {
		process.stdout.isTTY = false;

		expect(await terminalLinkOn('linux')).toBe('stylelint');
	});

	it('returns the text unchanged in a dumb terminal', async () => {
		process.env.TERM = 'dumb';
		process.stdout.isTTY = true;

		expect(await terminalLinkOn('linux')).toBe('stylelint');
	});

	it('returns the text unchanged in CI', async () => {
		process.env.CI = 'true';
		process.stdout.isTTY = true;

		expect(await terminalLinkOn('linux')).toBe('stylelint');
	});

	it('links the text in Windows Terminal', async () => {
		process.env.WT_SESSION = '1';
		process.stdout.isTTY = true;

		expect(await terminalLinkOn('win32')).toBe(link);
	});

	it('returns the text unchanged on Windows outside Windows Terminal', async () => {
		process.stdout.isTTY = true;

		expect(await terminalLinkOn('win32')).toBe('stylelint');
	});
});
