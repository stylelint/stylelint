import { afterEach, beforeEach, describe, it } from 'node:test';
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
	it('links the text when stdout is a terminal', async (t) => {
		process.stdout.isTTY = true;

		t.assert.strictEqual(await terminalLinkOn('linux'), link);
	});

	it('returns the text unchanged when stdout is not a terminal', async (t) => {
		process.stdout.isTTY = false;

		t.assert.strictEqual(await terminalLinkOn('linux'), 'stylelint');
	});

	it('returns the text unchanged in a dumb terminal', async (t) => {
		process.env.TERM = 'dumb';
		process.stdout.isTTY = true;

		t.assert.strictEqual(await terminalLinkOn('linux'), 'stylelint');
	});

	it('returns the text unchanged in CI', async (t) => {
		process.env.CI = 'true';
		process.stdout.isTTY = true;

		t.assert.strictEqual(await terminalLinkOn('linux'), 'stylelint');
	});

	it('links the text in Windows Terminal', async (t) => {
		process.env.WT_SESSION = '1';
		process.stdout.isTTY = true;

		t.assert.strictEqual(await terminalLinkOn('win32'), link);
	});

	it('returns the text unchanged on Windows outside Windows Terminal', async (t) => {
		process.stdout.isTTY = true;

		t.assert.strictEqual(await terminalLinkOn('win32'), 'stylelint');
	});
});
