import assert from 'node:assert/strict';
import { it } from 'node:test';

import hasEmptyLine from '../hasEmptyLine.mjs';

it('hasEmptyLine', () => {
	assert.ok(hasEmptyLine('\n\n'));
	assert.ok(hasEmptyLine('\r\n\r\n'));
	assert.ok(hasEmptyLine('\n\n\n\n'));
	assert.ok(hasEmptyLine('\r\n\r\n\r\n\r\n'));
	assert.ok(hasEmptyLine('   \n\n'));
	assert.ok(hasEmptyLine('\n\n   \n\n'));
	assert.ok(hasEmptyLine('\n \n'));
	assert.ok(hasEmptyLine('\r\n \r\n'));
	assert.ok(hasEmptyLine('\n \n \n \n'));
	assert.ok(hasEmptyLine('\r \n\n r\n\r\n\r\n'));
	assert.ok(hasEmptyLine('   \n \n'));
	assert.ok(hasEmptyLine('\n \n   \n \n'));
	assert.ok(hasEmptyLine('\n\t\n'));
	assert.ok(hasEmptyLine('\n\t \n'));
	assert.ok(hasEmptyLine('\r\n\t\r\n'));
	assert.ok(hasEmptyLine('\n\t\n\n \t\n'));
	assert.ok(hasEmptyLine('\r\n\t\r\n\t\r\n\r\n'));
	assert.ok(hasEmptyLine('   \n\t\n'));
	assert.ok(hasEmptyLine('\n\t\n  \t  \n\n'));
	assert.ok(!hasEmptyLine(''));
	assert.ok(!hasEmptyLine(' '));
	assert.ok(!hasEmptyLine('\t'));
	assert.ok(!hasEmptyLine('\n'));
	assert.ok(!hasEmptyLine('\r\n'));
});
