import { EOL } from 'node:os';
import process from 'node:process';

import createDebug from '../createDebug.mjs';

const OLD_ENV = process.env;

let write;

beforeEach(() => {
	process.env = { ...OLD_ENV };
	write = import.meta.jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
});

afterEach(() => {
	write.mockRestore();
	process.env = OLD_ENV;
});

describe('createDebug()', () => {
	it('writes nothing when DEBUG is unset', () => {
		delete process.env.DEBUG;

		createDebug('stylelint:foo')('bar');

		expect(write).not.toHaveBeenCalled();
	});

	it.each(['*', 'stylelint:*', 'stylelint:foo', 'baz,stylelint:foo', 'baz stylelint:foo'])(
		'writes the namespace and message to stderr when DEBUG is "%s"',
		(value) => {
			process.env.DEBUG = value;

			createDebug('stylelint:foo')('bar');

			expect(write).toHaveBeenCalledTimes(1);
			expect(write).toHaveBeenCalledWith(`stylelint:foo bar${EOL}`);
		},
	);

	it.each(['', 'baz', 'stylelint', 'stylelint:fo', 'stylelint:foo:*'])(
		'writes nothing when DEBUG is "%s"',
		(value) => {
			process.env.DEBUG = value;

			createDebug('stylelint:foo')('bar');

			expect(write).not.toHaveBeenCalled();
		},
	);
});
