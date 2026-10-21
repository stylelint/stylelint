import { it } from 'node:test';

import hasEmptyLine from '../hasEmptyLine.mjs';

it('hasEmptyLine', (t) => {
	t.assert.ok(hasEmptyLine('\n\n'));
	t.assert.ok(hasEmptyLine('\r\n\r\n'));
	t.assert.ok(hasEmptyLine('\n\n\n\n'));
	t.assert.ok(hasEmptyLine('\r\n\r\n\r\n\r\n'));
	t.assert.ok(hasEmptyLine('   \n\n'));
	t.assert.ok(hasEmptyLine('\n\n   \n\n'));
	t.assert.ok(hasEmptyLine('\n \n'));
	t.assert.ok(hasEmptyLine('\r\n \r\n'));
	t.assert.ok(hasEmptyLine('\n \n \n \n'));
	t.assert.ok(hasEmptyLine('\r \n\n r\n\r\n\r\n'));
	t.assert.ok(hasEmptyLine('   \n \n'));
	t.assert.ok(hasEmptyLine('\n \n   \n \n'));
	t.assert.ok(hasEmptyLine('\n\t\n'));
	t.assert.ok(hasEmptyLine('\n\t \n'));
	t.assert.ok(hasEmptyLine('\r\n\t\r\n'));
	t.assert.ok(hasEmptyLine('\n\t\n\n \t\n'));
	t.assert.ok(hasEmptyLine('\r\n\t\r\n\t\r\n\r\n'));
	t.assert.ok(hasEmptyLine('   \n\t\n'));
	t.assert.ok(hasEmptyLine('\n\t\n  \t  \n\n'));
	t.assert.ok(!hasEmptyLine(''));
	t.assert.ok(!hasEmptyLine(' '));
	t.assert.ok(!hasEmptyLine('\t'));
	t.assert.ok(!hasEmptyLine('\n'));
	t.assert.ok(!hasEmptyLine('\r\n'));
});
