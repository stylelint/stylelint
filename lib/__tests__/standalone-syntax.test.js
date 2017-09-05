"use strict";

const less = require("postcss-less");
const path = require("path");
const scss = require("postcss-scss");
const standalone = require("../standalone");
const stringFormatter = require("../formatters/stringFormatter");
const stripAnsi = require("strip-ansi");
const sugarss = require("sugarss");

const fixturesPath = path.join(__dirname, "fixtures");

it("standalone with scss syntax", () => {
  const config = {
    rules: {
      "block-no-empty": true
    }
  };

  return standalone({
    config,
    code: "$foo: bar; // foo;\nb {}",
    syntax: "scss",
    formatter: stringFormatter
  }).then(linted => {
    const strippedOutput = stripAnsi(linted.output);
    expect(typeof linted.output).toBe("string");
    expect(strippedOutput.indexOf("2:3")).not.toBe(-1);
    expect(strippedOutput.indexOf("block-no-empty")).not.toBe(-1);
  });
});

it("standalone with sugarss syntax", () => {
  const config = {
    rules: {
      "length-zero-no-unit": true
    }
  };

  return standalone({
    config,
    code: ".one\n  color: black\n  top: 0px\n.two",
    syntax: "sugarss",
    formatter: stringFormatter
  }).then(linted => {
    const strippedOutput = stripAnsi(linted.output);
    expect(typeof linted.output).toBe("string");
    expect(strippedOutput.indexOf("3:9")).not.toBe(-1);
    expect(strippedOutput.indexOf("length-zero-no-unit")).not.toBe(-1);
  });
});

it("standalone with Less syntax", () => {
  const config = {
    rules: {
      "block-no-empty": true
    }
  };

  return standalone({
    config,
    code: "@foo: bar; // foo;\nb {}",
    syntax: "less",
    formatter: stringFormatter
  }).then(linted => {
    const strippedOutput = stripAnsi(linted.output);
    expect(typeof linted.output).toBe("string");
    expect(strippedOutput.indexOf("2:3")).not.toBe(-1);
    expect(strippedOutput.indexOf("block-no-empty")).not.toBe(-1);
  });
});

it("standalone with postcss-html syntax", () => {
  const config = {
    rules: {
      "no-empty-source": true,
      "rule-empty-line-before": "always",
      "at-rule-empty-line-before": "always"
    }
  };

  return standalone({
    config,
    customSyntax: `${fixturesPath}/postcss-html-syntax`,
    files: [
      `${fixturesPath}/at-rule-empty-line-before.html`,
      `${fixturesPath}/no-empty-source.html`,
      `${fixturesPath}/rule-empty-line-before.html`
    ],
    formatter: stringFormatter
  }).then(linted => {
    const results = linted.results;
    expect(results.length).toBe(3);

    const atRuleEmptyLineBeforeResult = results.find(r =>
      /[/\\]at-rule-empty-line-before\.html$/.test(r.source)
    );
    expect(atRuleEmptyLineBeforeResult.errored).toBeFalsy();
    expect(atRuleEmptyLineBeforeResult.warnings.length).toBe(0);

    const noEmptySourceResult = results.find(r =>
      /[/\\]no-empty-source\.html$/.test(r.source)
    );
    expect(noEmptySourceResult.errored).toBeFalsy();
    expect(noEmptySourceResult.warnings.length).toBe(0);

    const ruleEmptyLineBeforeResult = results.find(r =>
      /[/\\]rule-empty-line-before\.html$/.test(r.source)
    );
    expect(ruleEmptyLineBeforeResult.errored).toBeFalsy();
    expect(ruleEmptyLineBeforeResult.warnings.length).toBe(0);
  });
});

describe("standalone with syntax set by extension", () => {
  let results;

  // The first tests here establish the meaningfulness of the last test

  describe("SCSS", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } },
        syntax: "scss"
      }).then(data => (results = data.results));
    });

    it("correct number of files", () => {
      expect(results.length).toBe(3);
    });

    it("parsed as SCSS", () => {
      const scssResult = results.find(r => path.extname(r.source) === ".scss");
      expect(scssResult._postcssResult.opts.syntax).toBe(scss);
    });
  });

  describe("Less", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } },
        syntax: "less"
      }).then(data => (results = data.results));
    });

    it("correct number of files", () => {
      expect(results.length).toBe(3);
    });

    it("parsed as Less", () => {
      const lessResult = results.find(r => path.extname(r.source) === ".less");
      expect(lessResult._postcssResult.opts.syntax).toBe(less);
    });
  });

  describe("SugarSS", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } },
        syntax: "sugarss"
      }).then(data => (results = data.results));
    });

    it("correct number of files", () => {
      expect(results.length).toBe(3);
    });

    it("parsed as SugarSS", () => {
      const sssResult = results.find(r => path.extname(r.source) === ".sss");
      expect(sssResult._postcssResult.opts.syntax).toBe(sugarss);
    });
  });

  describe("By extension", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } }
      }).then(data => (results = data.results));
    });

    it("correct number of files", () => {
      expect(results.length).toBe(3);
    });

    it("parsed each according to its extension", () => {
      const sssResult = results.find(r => path.extname(r.source) === ".sss");
      const lessResult = results.find(r => path.extname(r.source) === ".less");
      const scssResult = results.find(r => path.extname(r.source) === ".scss");
      expect(sssResult._postcssResult.opts.syntax).toBe(sugarss);
      expect(lessResult._postcssResult.opts.syntax).toBe(less);
      expect(scssResult._postcssResult.opts.syntax).toBe(scss);
    });
  });
});

it("standalone with path to custom parser", () => {
  const config = {
    rules: {
      "block-no-empty": true
    }
  };

  return standalone({
    config,
    customSyntax: `${fixturesPath}/custom-parser`,
    code: ".foo { width: 200px }\n.bar {",
    formatter: stringFormatter
  }).then(linted => {
    const results = linted.results;

    expect(results.length).toBe(1);
    expect(results[0].warnings.length).toBe(1);
    expect(results[0].warnings[0].line).toBe(2);
    expect(results[0].warnings[0].column).toBe(6);
    expect(results[0].warnings[0].rule).toBe("block-no-empty");
  });
});

it("standalone with path to custom syntax", () => {
  const config = {
    rules: {
      "block-no-empty": true
    }
  };

  return standalone({
    config,
    customSyntax: `${fixturesPath}/custom-syntax`,
    code: "$foo: bar; // foo;\nb {}",
    formatter: stringFormatter
  }).then(linted => {
    const results = linted.results;

    expect(results.length).toBe(1);
    expect(results[0].warnings.length).toBe(1);
    expect(results[0].warnings[0].line).toBe(2);
    expect(results[0].warnings[0].column).toBe(3);
    expect(results[0].warnings[0].rule).toBe("block-no-empty");
  });
});

it("standalone should use customSyntax when both customSyntax and syntax are set", () => {
  const config = {
    rules: {
      "block-no-empty": true
    }
  };

  return standalone({
    config,
    syntax: "less",
    customSyntax: `${fixturesPath}/custom-syntax`,
    code: "$foo: bar; // foo;\nb {}",
    formatter: stringFormatter
  }).then(linted => {
    const results = linted.results;

    expect(results.length).toBe(1);
    expect(results[0].warnings.length).toBe(1);
    expect(results[0].warnings[0].line).toBe(2);
    expect(results[0].warnings[0].column).toBe(3);
    expect(results[0].warnings[0].rule).toBe("block-no-empty");
  });
});
