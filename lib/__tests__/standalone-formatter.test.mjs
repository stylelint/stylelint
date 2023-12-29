import stripAnsi from 'strip-ansi';

import readJSONFile from '../testUtils/readJSONFile.mjs';
import standalone from '../standalone.mjs';
import stringFormatter from '../formatters/stringFormatter.mjs';

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

it('standalone with input css and alternate formatter specified by keyword', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: 'string',
	});

	const strippedOutput = stripAnsi(report);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with input css and alternate formatter function', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: stringFormatter,
	});

	const strippedOutput = stripAnsi(report);

	expect(strippedOutput).toContain('1:3');
	expect(strippedOutput).toContain('block-no-empty');
});

it('standalone with invalid formatter option', async () => {
	await expect(
		standalone({
			code: 'a {}',
			config: configBlockNoEmpty,
			formatter: 'invalid',
		}),
	).rejects.toThrow(
		'You must use a valid formatter option: "compact", "github", "gitlab", "json", "string", "tap", "unix", "verbose" or a function',
	);
});

it('standalone with input css and custom promised formatter', async () => {
	const { report } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
		formatter: Promise.resolve((results) => {
			return results[0].warnings.map((w) => w.rule).join();
		}),
	});

	expect(report).toContain('block-no-empty');
});
