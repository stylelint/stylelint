'use strict';

const isKeyframeRule = require('../isKeyframeRule');
const postcss = require('postcss');

describe('isKeyframeRule', () => {
	it('detects a standard keyframe rule', () => {
		rules('@keyframes identifier { to {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeTruthy();
		});
	});

	it('detects a mixed-case keyframe rule', () => {
		rules('@kEyFrAmEs identifier { to {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeTruthy();
		});
	});

	it('detects an upper-case keyframe rule', () => {
		rules('@KEYFRAMES identifier { to {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeTruthy();
		});
	});

	it('detects a keyframe rule with nested from decl', () => {
		rules('@keyframes identifier { from {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeTruthy();
		});
	});

	it('detects a keyframe rule with nested percentage decl', () => {
		rules('@keyframes identifier { 50% {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeTruthy();
		});
	});

	it('ignores a normal rule', () => {
		rules('a {}', (rule) => {
			expect(isKeyframeRule(rule)).toBeFalsy();
		});
	});

	it('ignores a normal rule with nested decl', () => {
		rules('a { & b {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeFalsy();
		});
	});

	it('ignores a normal rule with nested at-rule decl', () => {
		rules('a { @nest b & {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeFalsy();
		});
	});

	it('ignores an @media', () => {
		rules('@media print { a {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeFalsy();
		});
	});

	it('ignores an @supports rule', () => {
		rules('@supports (animation-name: test) { a {} }', (rule) => {
			expect(isKeyframeRule(rule)).toBeFalsy();
		});
	});
});

function rules(css, cb) {
	postcss.parse(css).walkDecls(cb);
}
