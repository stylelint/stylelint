"use strict";

const lessSyntax = require("postcss-less");
const path = require("path");
const postcss = require("postcss");
const scssSyntax = require("postcss-scss");
const stylelint = require("../");

const config = {
  rules: {
    "block-opening-brace-newline-after": "always",
    "declaration-property-unit-blacklist": {
      width: ["px", "em"]
    },
    "color-no-invalid-hex": [
      true,
      {
        severity: "warning",
        message: "You made a mistake"
      }
    ],
    "function-blacklist": ["calc"],
    "function-whitelist": null,
    "no-duplicate-selectors": true
  }
};

const css = `
a { background: pink; }

b {
  height: 1rem;
  display: block;
  width: 10px;
  color: #zzz;
}

/* stylelint-disable color-no-invalid-hex */
.foo {
  color: #yyy;
}
/* stylelint-enable */

.bar:before {
  color: #mmm;
  height: calc(1rem - 100%)
}
`;

describe("integration test expecting warnings", () => {
  let result;

  beforeEach(() => {
    return postcss()
      .use(stylelint(config))
      .process(css)
      .then(data => (result = data));
  });

  it("number and type", () => {
    expect(result.messages.length).toBe(5);
    expect(result.messages.every(m => m.type === "warning")).toBeTruthy();
    expect(result.messages.every(m => m.plugin === "stylelint")).toBeTruthy();
  });

  it("block-opening-brace-newline-after - string primary option", () => {
    expect(result.messages[0].text).toBe(
      'Expected newline after "{" (block-opening-brace-newline-after)'
    );
    expect(result.messages[0].severity).toBe("error");
  });

  it("declaration-property-unit-blacklist - object primary option", () => {
    expect(result.messages[1].text).toBe(
      'Unexpected unit "px" for property "width" (declaration-property-unit-blacklist)'
    );
    expect(result.messages[1].severity).toBe("error");
  });

  it("color-no-invalid-hex - true primary option", () => {
    expect(result.messages[2].text).toBe("You made a mistake");
    expect(result.messages[2].severity).toBe("warning");
    expect(result.messages[3].text).toBe("You made a mistake");
    expect(result.messages[3].severity).toBe("warning");
  });

  it("function-blacklist - array primary option", () => {
    expect(result.messages[4].text).toBe(
      'Unexpected function "calc" (function-blacklist)'
    );
    expect(result.messages[4].severity).toBe("error");
  });
});

it("Less integration test", () => {
  const less = `.foo(@bar) {
      color: @bar;
  }
  `;

  return postcss()
    .use(stylelint({ rules: {} }))
    .process(less, { syntax: lessSyntax })
    .then(result => {
      expect(result.messages.length).toBe(0);
    });
});

it("Scss integration test", () => {
  const scss = `.foo-#{variable} {
      color: $color;
  }
  `;

  return postcss()
    .use(stylelint({ rules: {} }))
    .process(scss, { syntax: scssSyntax })
    .then(result => {
      expect(result.messages.length).toBe(0);
    });
});

describe("integration test null option", () => {
  let results;

  beforeEach(() => {
    return stylelint
      .lint({
        config: {
          extends: [path.join(__dirname, "fixtures/config-no-pixels")],
          rules: {
            "unit-blacklist": null
          }
        },
        code: "a { top: 10px; }"
      })
      .then(data => (results = data.results));
  });

  it("no invalid option warnings", () => {
    expect(results[0].invalidOptionWarnings.length).toBe(0);
  });

  it("no warnings", () => {
    expect(results[0].warnings.length).toBe(0);
  });
});

describe("integration test [null] option", () => {
  let results;

  beforeEach(() => {
    return stylelint
      .lint({
        config: {
          extends: [path.join(__dirname, "fixtures/config-no-pixels")],
          rules: {
            "unit-blacklist": [null]
          }
        },
        code: "a { top: 10px; }"
      })
      .then(data => (results = data.results));
  });

  it("no invalid option warnings", () => {
    expect(results[0].invalidOptionWarnings.length).toBe(0);
  });

  it("no warnings", () => {
    expect(results[0].warnings.length).toBe(0);
  });
});
