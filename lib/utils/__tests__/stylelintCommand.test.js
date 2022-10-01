'use strict';

const postcss = require('postcss');

const { extractStylelintCommand, isStylelintCommand } = require('../stylelintCommand');

test('extractStylelintCommand', () => {
	expect(extractStylelintCommand(comment('stylelint-disable'))).toBe('stylelint-disable');
	expect(extractStylelintCommand(comment('stylelint-disable '))).toBe('stylelint-disable');
	expect(extractStylelintCommand(comment('stylelint-disable\t'))).toBe('stylelint-disable');
	expect(extractStylelintCommand(comment('stylelint-disable --'))).toBe('stylelint-disable');

	expect(extractStylelintCommand(comment(''))).toBe('');
	expect(extractStylelintCommand(comment(' '))).toBe('');
	expect(extractStylelintCommand(comment('\t'))).toBe('');
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
});

function comment(text) {
	return postcss.comment({ text });
}
