import checkInvalidCLIOptions from '../checkInvalidCLIOptions.mjs';

import { EOL } from 'node:os';
import picocolors from 'picocolors';

const { red: r, cyan: c } = picocolors;

describe('checkInvalidCLIOptions', () => {
	const allowedOptions = ['fix', 'config', 'max-war', 'mw', 'quiet', 'q'];

	it('returns a message when check fails', () => {
		const inputOptions = ['fis', 'fi', 'fixx', 'aix', 'conig', 'mx-war', 'ma', 'q', 'o'];

		expect(checkInvalidCLIOptions(allowedOptions, inputOptions)).toBe(
			`Invalid option ${r('"--fis"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--fi"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--fixx"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--aix"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--conig"')}. Did you mean ${c('"--config"')}?
Invalid option ${r('"--mx-war"')}. Did you mean ${c('"--max-war"')}?
Invalid option ${r('"--ma"')}. Did you mean ${c('"--mw"')}?
Invalid option ${r('"-o"')}.
`.replaceAll('\n', EOL),
		);
	});

	it('returns an empty string when check succeeds', () => {
		expect(checkInvalidCLIOptions(allowedOptions, [])).toBe('');
		expect(
			checkInvalidCLIOptions(allowedOptions, ['fix', 'config', 'max-war', 'mw', 'quiet', 'q']),
		).toBe('');
	});
});
