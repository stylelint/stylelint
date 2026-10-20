import checkInvalidCLIOptions from '../checkInvalidCLIOptions.mjs';

import { EOL } from 'node:os';

import createStyleText from '../createStyleText.mjs';

const styleText = createStyleText(false);

describe('checkInvalidCLIOptions', () => {
	const allowedOptions = ['fix', 'config', 'max-war', 'mw', 'quiet', 'q'];

	it('returns a message when check fails', () => {
		const inputOptions = ['fis', 'fi', 'fixx', 'aix', 'conig', 'mx-war', 'ma', 'q', 'o'];

		expect(checkInvalidCLIOptions(allowedOptions, inputOptions, styleText)).toBe(
			`Invalid option "--fis". Did you mean "--fix"?
Invalid option "--fi". Did you mean "--fix"?
Invalid option "--fixx". Did you mean "--fix"?
Invalid option "--aix". Did you mean "--fix"?
Invalid option "--conig". Did you mean "--config"?
Invalid option "--mx-war". Did you mean "--max-war"?
Invalid option "--ma". Did you mean "--mw"?
Invalid option "-o".
`.replaceAll('\n', EOL),
		);
	});

	it('suggests the replacement of a removed option before the closest allowed one', () => {
		expect(
			checkInvalidCLIOptions(allowedOptions, ['mxw'], styleText, new Map([['mxw', 'max-war']])),
		).toBe(`Invalid option "--mxw". Did you mean "--max-war"?${EOL}`);
	});

	it('returns an empty string when check succeeds', () => {
		expect(checkInvalidCLIOptions(allowedOptions, [], styleText)).toBe('');
		expect(
			checkInvalidCLIOptions(
				allowedOptions,
				['fix', 'config', 'max-war', 'mw', 'quiet', 'q'],
				styleText,
			),
		).toBe('');
	});
});
