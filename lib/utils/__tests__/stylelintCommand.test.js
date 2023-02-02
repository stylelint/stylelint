'use strict';

const postcss = require('postcss');

const { extractStylelintCommand, isStylelintCommand } = require('../stylelintCommand');

test('extractStylelintCommand', () => {
	expect(extractStylelintCommand(comment('stylelint-disable'))).toBe('-disable');
	expect(extractStylelintCommand(comment('stylelint-disable '))).toBe('-disable');
	expect(extractStylelintCommand(comment('stylelint-disable\t'))).toBe('-disable');
	expect(extractStylelintCommand(comment('stylelint-disable --'))).toBe('-disable');

	expect(extractStylelintCommand(comment(''))).toBe('');
	expect(extractStylelintCommand(comment(' '))).toBe('');
	expect(extractStylelintCommand(comment('\t'))).toBe('');

	expect(extractStylelintCommand(comment('stylelint-disable'), 'stylelint-2')).toBe(
		'stylelint-disable',
	);
	expect(extractStylelintCommand(comment('stylelint-2-disable'), 'stylelint-2')).toBe('-disable');
});

test('isStylelintCommand', () => {
	expect(isStylelintCommand(comment('stylelint-disable'))).toBe(true);
	expect(isStylelintCommand(comment('stylelint-disable-line'))).toBe(true);
	expect(isStylelintCommand(comment('stylelint-disable-next-line'))).toBe(true);
	expect(isStylelintCommand(comment('stylelint-enable'))).toBe(true);

	expect(isStylelintCommand(comment('stylelint-'))).toBe(false);
	expect(isStylelintCommand(comment('stylelint-disable-'))).toBe(false);
	expect(isStylelintCommand(comment('stylelint-disable-lineee'))).toBe(false);
	expect(isStylelintCommand(comment('stylelint-disable-next'))).toBe(false);
	expect(isStylelintCommand(comment('stylelint-enable-'))).toBe(false);
	expect(isStylelintCommand(comment(''))).toBe(false);
	expect(isStylelintCommand(comment(' '))).toBe(false);
	expect(isStylelintCommand(comment('\t'))).toBe(false);

	expect(isStylelintCommand(comment('stylelint-disable'), 'stylelint-2')).toBe(false);
	expect(isStylelintCommand(comment('stylelint-2-disable'), 'stylelint-2')).toBe(true);
});

function comment(text) {
	return postcss.comment({ text });
}
