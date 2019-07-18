"use strict";

const standalone = require("../standalone");

it("standalone with input css and quiet mode", () => {
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": [true, { severity: "warning" }]
    }
  };

  return standalone({ code: "a {}", config }).then(linted => {
    expect(linted.results[0].warnings).toEqual([]);
  });
});

it("standalone with input error css and quiet mode", () => {
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": true
    }
  };

  return standalone({ code: "a {}", config }).then(linted => {
    expect(linted.results[0].warnings[0].rule).toBe("block-no-empty");
    expect(linted.results[0].warnings[0].severity).toBe("warning");
    expect(linted.results[0].errored).toBeUndefined();
  });
});
