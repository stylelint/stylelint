import { it } from 'node:test';

import hasInterpolation from '../hasInterpolation.mjs';

it('hasInterpolation', (t) => {
	t.assert.ok(hasInterpolation('(min-width#{$value}: 10px)'));
	t.assert.ok(hasInterpolation('(@{value}min-width : 10px)'));
	t.assert.ok(hasInterpolation('#{$Attr}-color'));
	t.assert.ok(hasInterpolation('@{Attr}-color'));
	t.assert.ok(hasInterpolation('#{50% - $n}'));
	t.assert.ok(hasInterpolation('.n-#{$n}'));
	t.assert.ok(hasInterpolation(':n-#{$n}'));
	t.assert.ok(hasInterpolation('.n-@{n}'));
	t.assert.ok(!hasInterpolation('(min-width: 10px)'));
	t.assert.ok(!hasInterpolation('.a{}'));
	t.assert.ok(!hasInterpolation("$sass-variable + 'foo'"));
	t.assert.ok(!hasInterpolation('10px'));
	t.assert.ok(!hasInterpolation("@less-variable + 'foo'"));
	t.assert.ok(hasInterpolation('${value}'));
	t.assert.ok(hasInterpolation('${\nvalue\n}'));
});
