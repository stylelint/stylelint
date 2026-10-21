import { test } from 'node:test';

import postcss from 'postcss';

import { extractConfigurationComment, isConfigurationComment } from '../configurationComment.mjs';

test('extractConfigurationComment', (t) => {
	t.assert.strictEqual(extractConfigurationComment('stylelint-disable'), '-disable');
	t.assert.strictEqual(extractConfigurationComment('stylelint-disable '), '-disable');
	t.assert.strictEqual(extractConfigurationComment('stylelint-disable\t'), '-disable');
	t.assert.strictEqual(extractConfigurationComment('stylelint-disable --'), '-disable');

	t.assert.strictEqual(extractConfigurationComment(''), '');
	t.assert.strictEqual(extractConfigurationComment(' '), '');
	t.assert.strictEqual(extractConfigurationComment('\t'), '');

	t.assert.strictEqual(
		extractConfigurationComment('stylelint-disable', 'stylelint-2'),
		'stylelint-disable',
	);
	t.assert.strictEqual(
		extractConfigurationComment('stylelint-2-disable', 'stylelint-2'),
		'-disable',
	);
});

test('isConfigurationComment', (t) => {
	t.assert.strictEqual(isConfigurationComment('stylelint-disable'), true);
	t.assert.strictEqual(isConfigurationComment('stylelint-disable-line'), true);
	t.assert.strictEqual(isConfigurationComment('stylelint-disable-next-line'), true);
	t.assert.strictEqual(isConfigurationComment('stylelint-enable'), true);

	t.assert.strictEqual(isConfigurationComment('stylelint-'), false);
	t.assert.strictEqual(isConfigurationComment('stylelint-disable-'), false);
	t.assert.strictEqual(isConfigurationComment('stylelint-disable-lineee'), false);
	t.assert.strictEqual(isConfigurationComment('stylelint-disable-next'), false);
	t.assert.strictEqual(isConfigurationComment('stylelint-enable-'), false);
	t.assert.strictEqual(isConfigurationComment(''), false);
	t.assert.strictEqual(isConfigurationComment(' '), false);
	t.assert.strictEqual(isConfigurationComment('\t'), false);

	t.assert.strictEqual(isConfigurationComment('stylelint-disable', 'stylelint-2'), false);
	t.assert.strictEqual(isConfigurationComment('stylelint-2-disable', 'stylelint-2'), true);
});

test('isConfigurationComment for Comment node', (t) => {
	const commentNode = (text) => postcss.comment({ text });

	t.assert.strictEqual(isConfigurationComment(commentNode('stylelint-disable')), true);
	t.assert.strictEqual(isConfigurationComment(commentNode('foo')), false);
	t.assert.strictEqual(
		isConfigurationComment(commentNode('stylelint-2-disable'), 'stylelint-2'),
		true,
	);

	// Non-comment node
	t.assert.strictEqual(isConfigurationComment(postcss.atRule()), false);
});
