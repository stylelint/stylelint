import process from 'node:process';

import terminalLink from '../terminalLink.mjs';

const OLD_ENV = process.env;

const link = '\u001B]8;;https://stylelint.io/\u0007stylelint\u001B]8;;\u0007';

let actualTTY;

beforeEach(() => {
	actualTTY = process.stdout.isTTY;
	process.env = { ...OLD_ENV };
	delete process.env.FORCE_HYPERLINK;
	delete process.env.TERM;
});

afterEach(() => {
	process.stdout.isTTY = actualTTY;
	process.env = OLD_ENV;
});

describe('terminalLink()', () => {
	it('links the text when stdout is a terminal', () => {
		process.stdout.isTTY = true;

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe(link);
	});

	it('returns the text unchanged when stdout is not a terminal', () => {
		process.stdout.isTTY = false;

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe('stylelint');
	});

	it('returns the text unchanged in a dumb terminal', () => {
		process.env.TERM = 'dumb';
		process.stdout.isTTY = true;

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe('stylelint');
	});

	it('links the text when FORCE_HYPERLINK is empty, even when stdout is not a terminal', () => {
		process.env.FORCE_HYPERLINK = '';
		process.stdout.isTTY = false;

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe(link);
	});

	it('returns the text unchanged when FORCE_HYPERLINK is false, even when stdout is a terminal', () => {
		process.env.FORCE_HYPERLINK = 'false';
		process.stdout.isTTY = true;

		expect(terminalLink('stylelint', 'https://stylelint.io/')).toBe('stylelint');
	});
});
