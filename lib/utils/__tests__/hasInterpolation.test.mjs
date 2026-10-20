import assert from 'node:assert/strict';
import { it } from 'node:test';

import hasInterpolation from '../hasInterpolation.mjs';

it('hasInterpolation', () => {
	assert.ok(hasInterpolation('(min-width#{$value}: 10px)'));
	assert.ok(hasInterpolation('(@{value}min-width : 10px)'));
	assert.ok(hasInterpolation('#{$Attr}-color'));
	assert.ok(hasInterpolation('@{Attr}-color'));
	assert.ok(hasInterpolation('#{50% - $n}'));
	assert.ok(hasInterpolation('.n-#{$n}'));
	assert.ok(hasInterpolation(':n-#{$n}'));
	assert.ok(hasInterpolation('.n-@{n}'));
	assert.ok(!hasInterpolation('(min-width: 10px)'));
	assert.ok(!hasInterpolation('.a{}'));
	assert.ok(!hasInterpolation("$sass-variable + 'foo'"));
	assert.ok(!hasInterpolation('10px'));
	assert.ok(!hasInterpolation("@less-variable + 'foo'"));
	assert.ok(hasInterpolation('${value}'));
	assert.ok(hasInterpolation('${\nvalue\n}'));
});
