"use strict";

const configBlockNoEmpty = require("./fixtures/config-block-no-empty");
const ruleDefinitions = require("../rules");
const standalone = require("../standalone");

describe("standalone with deprecations", () => {
  beforeAll(() => {
    ruleDefinitions["block-no-empty"] = jest.fn(() => {
      return (root, result) => {
        result.warn("Some parseError", {
          stylelintType: "parseError"
        });
      };
    });
  });

  it("works", () => {
    standalone({
      code: "a {}",
      config: configBlockNoEmpty
    }).then(data => {
      expect(data.output.indexOf("Some parseError")).not.toBe(-1);
      expect(data.results.length).toBe(1);
      expect(data.results[0].parseErrors.length).toBe(1);
      expect(data.results[0].parseErrors[0].text).toBe("Some parseError");
    });
  });
});
