"use strict";

var valueTrailingSemicolon = require("../../lib/rules/value-trailing-semicolon");
var testRule = require("../util/testRule");
var test = require("tape");
var testValueTrailingSemicolon = testRule(valueTrailingSemicolon);

test("value-trailing-semicolon success", function(t) {
  t.plan(2);
  testValueTrailingSemicolon("body { background: pink; }", function(warnings) {
    t.equal(warnings.length, 0, "lone declaration");
  });
  testValueTrailingSemicolon("body { color: orange; background: pink; }", function(warnings) {
    t.equal(warnings.length, 0, "multiple declarations");
  });
});

test("value-trailing-semicolon failure", function(t) {
  t.plan(4);
  testValueTrailingSemicolon("body { background: pink }", function(warnings) {
    t.equal(warnings.length, 1, "lone declaration");
    t.equal(warnings[0].text, "Expected a trailing semicolon (value-trailing-semicolon)",
      "correct warning message");
  });
  testValueTrailingSemicolon("body { color: orange; background: pink }", function(warnings) {
    t.equal(warnings.length, 1, "multiple declarations");
    t.equal(warnings[0].text, "Expected a trailing semicolon (value-trailing-semicolon)",
      "correct warning message");
  });
});
