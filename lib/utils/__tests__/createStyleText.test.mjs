import process from 'node:process';

import createStyleText from '../createStyleText.mjs';

describe('createStyleText', () => {
	const originalEnv = process.env;

	afterEach(() => {
		process.env = originalEnv;
	});

	it('styles the text when color is on, ignoring NO_COLOR', () => {
		process.env = { ...originalEnv, NO_COLOR: '1' };

		const styleText = createStyleText(true);

		expect(styleText('red', 'foo')).toBe('\u001B[31mfoo\u001B[39m');
		expect(styleText('underline', 'foo')).toBe('\u001B[4mfoo\u001B[24m');
	});

	it('returns the text unchanged when color is off, ignoring FORCE_COLOR', () => {
		process.env = { ...originalEnv, FORCE_COLOR: '1' };
		delete process.env.NO_COLOR;

		const styleText = createStyleText(false);

		expect(styleText('red', 'foo')).toBe('foo');
		expect(styleText('underline', 'foo')).toBe('foo');
	});

	it('detects color support when color is not given', () => {
		process.env = { ...originalEnv, NO_COLOR: '1' };

		expect(createStyleText()('red', 'foo')).toBe('foo');

		process.env = { ...originalEnv, FORCE_COLOR: '1' };
		delete process.env.NO_COLOR;

		expect(createStyleText()('red', 'foo')).toBe('\u001B[31mfoo\u001B[39m');
	});
});
