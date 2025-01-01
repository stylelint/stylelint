import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import cli from '../cli.mjs';
import { jest } from '@jest/globals';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

it('flags.formatter=github should issue a deprecation warning', async () => {
	const mock = jest.spyOn(process, 'emitWarning').mockImplementation(() => {});

	const deprecationParameters = [
		'"github" formatter is deprecated.',
		{
			code: 'stylelint:004',
			detail: 'See https://stylelint.io/awesome-stylelint#formatters for alternative formatters.',
			type: 'DeprecationWarning',
		},
	];

	await cli([fixturesPath('empty-block.css'), '--formatter=github']);

	expect(mock).toHaveBeenCalledWith(...deprecationParameters);

	mock.mockReset();
});

it('flags.f=github should issue a deprecation warning', async () => {
	const mock = jest.spyOn(process, 'emitWarning').mockImplementation(() => {});

	const deprecationParameters = [
		'"github" formatter is deprecated.',
		{
			code: 'stylelint:004',
			detail: 'See https://stylelint.io/awesome-stylelint#formatters for alternative formatters.',
			type: 'DeprecationWarning',
		},
	];

	await cli([fixturesPath('empty-block.css'), '-f', 'github']);

	expect(mock).toHaveBeenCalledWith(...deprecationParameters);

	mock.mockReset();
});
