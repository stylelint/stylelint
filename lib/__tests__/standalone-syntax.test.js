"use strict";

const fs = require("fs");
const path = require("path");
const pify = require("pify");
const standalone = require("../standalone");
const stringFormatter = require("../formatters/stringFormatter");
const stripAnsi = require("strip-ansi");

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
      "comment-empty-line-before": "always",
      "rule-empty-line-before": [
        "always",
        {
          ignore: ["inside-block"]
        }
      ],
      "at-rule-empty-line-before": [
        "always",
        {
          except: ["inside-block"]
        }
      ]
    }
  };

  return standalone({
    config,
    customSyntax: "postcss-html",
    files: [
      `${fixturesPath}/at-rule-empty-line-before.html`,
      `${fixturesPath}/comment-empty-line-before.html`,
      `${fixturesPath}/no-empty-source.html`,
      `${fixturesPath}/rule-empty-line-before.html`
    ],
    formatter: stringFormatter
  }).then(linted => {
    const results = linted.results;
    expect(results.length).toBe(4);

    const atRuleEmptyLineBeforeResult = results.find(r =>
      /[/\\]at-rule-empty-line-before\.html$/.test(r.source)
    );
    expect(atRuleEmptyLineBeforeResult.errored).toBeFalsy();
    expect(atRuleEmptyLineBeforeResult.warnings.length).toBe(0);

    const commentEmptyLineBeforeResult = results.find(r =>
      /[/\\]comment-empty-line-before\.html$/.test(r.source)
    );
    expect(commentEmptyLineBeforeResult.errored).toBeFalsy();
    expect(commentEmptyLineBeforeResult.warnings.length).toBe(0);

    const noEmptySourceResult = results.find(r =>
      /[/\\]no-empty-source\.html$/.test(r.source)
    );
    expect(noEmptySourceResult.errored).toBeFalsy();
    expect(noEmptySourceResult.warnings.length).toBe(0);

    const ruleEmptyLineBeforeResult = results.find(r =>
      /[/\\]rule-empty-line-before\.html$/.test(r.source)
    );
    expect(ruleEmptyLineBeforeResult.errored).toBe(true);
    expect(ruleEmptyLineBeforeResult.warnings.length).toBe(1);
    expect(ruleEmptyLineBeforeResult.warnings[0].line).toBe(8);
    expect(ruleEmptyLineBeforeResult.warnings[0].rule).toBe(
      "rule-empty-line-before"
    );
  });
});

describe("standalone with syntax set by extension", () => {
  let results;

  // The first tests here establish the meaningfulness of the last test

  describe("SASS", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "color-no-invalid-hex": true } }
      }).then(data => (results = data.results));
    });

    it("parsed as SASS", () => {
      const sassResult = results.find(r => path.extname(r.source) === ".sass");
      expect(sassResult._postcssResult.root.source.lang).toBe("sass");
    });
  });

  describe("SCSS", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } }
      }).then(data => (results = data.results));
    });

    it("parsed as SCSS", () => {
      const scssResult = results.find(r => path.extname(r.source) === ".scss");
      expect(scssResult._postcssResult.root.source.lang).toBe("scss");
    });
  });

  describe("Less", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } }
      }).then(data => (results = data.results));
    });

    it("parsed as Less", () => {
      const lessResult = results.find(r => path.extname(r.source) === ".less");
      expect(lessResult._postcssResult.root.source.lang).toBe("less");
    });
  });

  describe("SugarSS", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "block-no-empty": true } }
      }).then(data => (results = data.results));
    });

    it("parsed as SugarSS", () => {
      const sssResult = results.find(r => path.extname(r.source) === ".sss");
      expect(sssResult._postcssResult.root.source.lang).toBe("sugarss");
    });
  });

  describe("By extension", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: { rules: { "color-no-invalid-hex": true } }
      }).then(data => (results = data.results));
    });

    it("correct number of files", () => {
      expect(results.length).toBe(6);
    });

    it("parsed each according to its extension", () => {
      const sssResult = results.find(r => path.extname(r.source) === ".sss");
      const lessResult = results.find(r => path.extname(r.source) === ".less");
      const sassResult = results.find(r => path.extname(r.source) === ".sass");
      const scssResult = results.find(r => path.extname(r.source) === ".scss");
      const htmlResult = results.find(r => path.extname(r.source) === ".html");
      const jsResult = results.find(r => path.extname(r.source) === ".ts");

      expect(sssResult._postcssResult.root.source.lang).toBe("sugarss");
      expect(lessResult._postcssResult.root.source.lang).toBe("less");
      expect(sassResult._postcssResult.root.source.lang).toBe("sass");
      expect(scssResult._postcssResult.root.source.lang).toBe("scss");
      expect(htmlResult._postcssResult.root.source.lang).toBe("html");
      expect(jsResult._postcssResult.root.source.lang).toBe("jsx");

      results.forEach(result => {
        expect(result.warnings.length).toBe(1);
        expect(result.warnings[0].rule).toBe("color-no-invalid-hex");
      });
    });
  });

  describe("By extension with config processors to a empty array", () => {
    beforeEach(() => {
      return standalone({
        files: `${fixturesPath}/extension-sensitive.*`,
        config: {
          rules: { "color-no-invalid-hex": true },
          processors: []
        }
      }).then(data => (results = data.results));
    });

    it("parsed each according to its extension", () => {
      const sssResult = results.find(r => path.extname(r.source) === ".sss");
      const lessResult = results.find(r => path.extname(r.source) === ".less");
      const sassResult = results.find(r => path.extname(r.source) === ".sass");
      const scssResult = results.find(r => path.extname(r.source) === ".scss");
      expect(sssResult._postcssResult.root.source.lang).toBe("sugarss");
      expect(lessResult._postcssResult.root.source.lang).toBe("less");
      expect(sassResult._postcssResult.root.source.lang).toBe("sass");
      expect(scssResult._postcssResult.root.source.lang).toBe("scss");
    });
  });
});

it("standalone with automatic syntax inference", () => {
  return standalone({
    files: `${fixturesPath}/style-tag.*`,
    config: {
      rules: {
        "block-no-empty": true
      }
    }
  }).then(data => {
    const results = data.results;
    const htmlResult = results.find(r => path.extname(r.source) === ".html");
    const vueResult = results.find(r => path.extname(r.source) === ".vue");
    const mdResult = results.find(r => path.extname(r.source) === ".markdown");
    expect(htmlResult.warnings[0].line).toBe(8);
    expect(vueResult.warnings[0].line).toBe(3);
    expect(mdResult.warnings[0].line).toBe(6);
    results.forEach(result => {
      expect(result._postcssResult.css).toEqual(
        result._postcssResult.root.source.input.css
      );
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0].rule).toBe("block-no-empty");
      expect(result.warnings[0].column).toBe(1);
    });
  });
});

it("standalone with postcss-safe-parser", () => {
  return standalone({
    files: `${fixturesPath}/syntax_error.*`,
    config: {
      rules: {}
    },
    fix: true
  }).then(data => {
    const results = data.results;
    expect(results.length).toBe(6);

    return Promise.all(
      results.map(result => {
        if (/\.(css|pcss|postcss)$/i.test(result.source)) {
          const root = result._postcssResult.root;
          expect(results[0].errored).toBeFalsy();
          expect(results[0].warnings.length).toBe(0);
          expect(root.toString()).not.toBe(root.source.input.css);
          return pify(fs.writeFile)(
            root.source.input.file,
            root.source.input.css
          );
        } else {
          expect(result.warnings.length).toBe(1);
          const error = result.warnings[0];
          expect(error.line).toBe(1);
          expect(error.column).toBe(1);
          expect(error.rule).toBe("CssSyntaxError");
          expect(error.severity).toBe("error");
        }
      })
    );
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
