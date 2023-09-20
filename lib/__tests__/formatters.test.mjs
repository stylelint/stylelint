import stylelint from '../index.mjs';

it('formatters are exposed on stylelint object', async () => {
	expect(typeof (await stylelint.formatters.json)).toBe('function');
});
