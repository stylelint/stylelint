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
			detail: 'Please use "@csstools/stylelint-formatter-github" instead.',
			type: 'DeprecationWarning',
		},
	];

	await cli([fixturesPath('empty-block.css'), '--formatter=github']);

	expect(mock).toHaveBeenCalledWith(...deprecationParameters);

	await cli([fixturesPath('empty-block.css'), '-f', 'github']);

	expect(mock).toHaveBeenNthCalledWith(2, ...deprecationParameters);

	mock.mockReset();
});
