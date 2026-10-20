import assert from 'node:assert/strict';
import { test } from 'node:test';

import postcss from 'postcss';

import { extractConfigurationComment, isConfigurationComment } from '../configurationComment.mjs';

test('extractConfigurationComment', () => {
	assert.equal(extractConfigurationComment('stylelint-disable'), '-disable');
	assert.equal(extractConfigurationComment('stylelint-disable '), '-disable');
	assert.equal(extractConfigurationComment('stylelint-disable\t'), '-disable');
	assert.equal(extractConfigurationComment('stylelint-disable --'), '-disable');

	assert.equal(extractConfigurationComment(''), '');
	assert.equal(extractConfigurationComment(' '), '');
	assert.equal(extractConfigurationComment('\t'), '');

	assert.equal(
		extractConfigurationComment('stylelint-disable', 'stylelint-2'),
		'stylelint-disable',
	);
	assert.equal(extractConfigurationComment('stylelint-2-disable', 'stylelint-2'), '-disable');
});

test('isConfigurationComment', () => {
	assert.equal(isConfigurationComment('stylelint-disable'), true);
	assert.equal(isConfigurationComment('stylelint-disable-line'), true);
	assert.equal(isConfigurationComment('stylelint-disable-next-line'), true);
	assert.equal(isConfigurationComment('stylelint-enable'), true);

	assert.equal(isConfigurationComment('stylelint-'), false);
	assert.equal(isConfigurationComment('stylelint-disable-'), false);
	assert.equal(isConfigurationComment('stylelint-disable-lineee'), false);
	assert.equal(isConfigurationComment('stylelint-disable-next'), false);
	assert.equal(isConfigurationComment('stylelint-enable-'), false);
	assert.equal(isConfigurationComment(''), false);
	assert.equal(isConfigurationComment(' '), false);
	assert.equal(isConfigurationComment('\t'), false);

	assert.equal(isConfigurationComment('stylelint-disable', 'stylelint-2'), false);
	assert.equal(isConfigurationComment('stylelint-2-disable', 'stylelint-2'), true);
});

test('isConfigurationComment for Comment node', () => {
	const commentNode = (text) => postcss.comment({ text });

	assert.equal(isConfigurationComment(commentNode('stylelint-disable')), true);
	assert.equal(isConfigurationComment(commentNode('foo')), false);
	assert.equal(isConfigurationComment(commentNode('stylelint-2-disable'), 'stylelint-2'), true);

	// Non-comment node
	assert.equal(isConfigurationComment(postcss.atRule()), false);
});
