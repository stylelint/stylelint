"use strict";

const isKeyframeRule = require("../isKeyframeRule");
const postcss = require("postcss");

describe("isKeyframeRule", () => {
  it("detects a standard keyframe rule", () => {
    return rules("@keyframes identifier { to {} }", rule => {
      expect(isKeyframeRule(rule)).toBeTruthy();
    });
  });

  it("detects a mixed-case keyframe rule", () => {
    return rules("@kEyFrAmEs identifier { to {} }", rule => {
      expect(isKeyframeRule(rule)).toBeTruthy();
    });
  });

  it("detects an upper-case keyframe rule", () => {
    return rules("@KEYFRAMES identifier { to {} }", rule => {
      expect(isKeyframeRule(rule)).toBeTruthy();
    });
  });

  it("detects a keyframe rule with nested from decl", () => {
    return rules("@keyframes identifier { from {} }", rule => {
      expect(isKeyframeRule(rule)).toBeTruthy();
    });
  });

  it("detects a keyframe rule with nested percentage decl", () => {
    return rules("@keyframes identifier { 50% {} }", rule => {
      expect(isKeyframeRule(rule)).toBeTruthy();
    });
  });

  it("ignores a normal rule", () => {
    return rules("a {}", rule => {
      expect(isKeyframeRule(rule)).toBeFalsy();
    });
  });

  it("ignores a normal rule with nested decl", () => {
    return rules("a { & b {} }", rule => {
      expect(isKeyframeRule(rule)).toBeFalsy();
    });
  });

  it("ignores a normal rule with nested at-rule decl", () => {
    return rules("a { @nest b & {} }", rule => {
      expect(isKeyframeRule(rule)).toBeFalsy();
    });
  });

  it("ignores an @media", () => {
    return rules("@media print { a {} }", rule => {
      expect(isKeyframeRule(rule)).toBeFalsy();
    });
  });

  it("ignores an @supports rule", () => {
    return rules("@supports (animation-name: test) { a {} }", rule => {
      expect(isKeyframeRule(rule)).toBeFalsy();
    });
  });
});

function rules(css, cb) {
  return postcss().process(css).then(result => {
    return result.root.walkDecls(cb);
  });
}
