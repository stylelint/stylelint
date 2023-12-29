import stylelint from '../index.mjs';

test('all built-in formatters are exposed on `stylelint` object', async () => {
	expect(Object.keys(stylelint.formatters)).toHaveLength(8);
	expect(typeof (await stylelint.formatters.compact)([])).toBe('string');
	expect(typeof (await stylelint.formatters.github)([], {})).toBe('string');
	expect(typeof (await stylelint.formatters.gitlab)([], {})).toBe('string');
	expect(typeof (await stylelint.formatters.json)([])).toBe('string');
	expect(typeof (await stylelint.formatters.string)([])).toBe('string');
	expect(typeof (await stylelint.formatters.tap)([])).toMatch('string');
	expect(typeof (await stylelint.formatters.unix)([])).toBe('string');
	expect(typeof (await stylelint.formatters.verbose)([])).toMatch('string');
});
