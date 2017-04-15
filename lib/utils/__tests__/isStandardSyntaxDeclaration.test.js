"use strict";

const isStandardSyntaxDeclaration = require("../isStandardSyntaxDeclaration");
const less = require("postcss-less");
const postcss = require("postcss");
const sass = require("postcss-sass");
const scss = require("postcss-scss");

describe("isStandardSyntaxDeclaration", () => {
  it("standard prop and value", () => {
    return decls("a { a: b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("standard prop and scss var", () => {
    return decls("a { a: $b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("custom-property", () => {
    return decls("a { --custom-property: x }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("standard prop and calc value", () => {
    return decls("a { a : calc(b + c) }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("does not break @selector", () => {
    return decls("@page { size: A4 }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with scss variable interpolation (only)", () => {
    return scssDecls("a { #{$var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with scss variable interpolation (end)", () => {
    return scssDecls("a { prop#{$var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with sass variable interpolation (end)", () => {
    return sassDecls("a\n  prop#{$var}: 10px", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with scss variable interpolation (middle)", () => {
    return scssDecls("a { prop#{$var}erty: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with sass variable interpolation (middle)", () => {
    return sassDecls("a\n  prop#{$var}erty: 10px", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("custom scss property set", () => {
    return scssDecls("a { --custom-property-set: { color: blue; } }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with less variable interpolation (only)", () => {
    return lessDecls("a { @{var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with less variable interpolation (end)", () => {
    return lessDecls("a { prop@{var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("property with less variable interpolation (middle)", () => {
    return lessDecls("a { prop@{var}erty: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy();
    });
  });

  it("scss var", () => {
    return scssDecls("$var: b", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("sass var", () => {
    return sassDecls("$var: b", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("scss list", () => {
    return scssDecls("$list: (key: value, key2: value2)", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("sass list", () => {
    return sassDecls("$list: (key: value, key2: value2)", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("scss map", () => {
    return scssDecls("$map: (value, value2)", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("sass map", () => {
    return sassDecls("$map: (value, value2)", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("nested scss var", () => {
    return scssDecls("a { $var: b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("nested scss list", () => {
    return scssDecls("a { $list: (key: value, key2: value2) }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("scss nested property", () => {
    return scssDecls("a { border: { style: solid; color: red; } }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("nested scss map", () => {
    return scssDecls("a { $map: (value, value2) }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("less var", () => {
    return lessDecls("@var: b", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });

  it("nested less var", () => {
    return lessDecls("a { @var: b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy();
    });
  });
});

function decls(css, cb) {
  return postcss()
    .process(css, { from: undefined })
    .then(result => {
      return result.root.walkDecls(cb);
    });
}

function scssDecls(css, cb) {
  return postcss()
    .process(css, { syntax: scss, from: undefined })
    .then(result => {
      return result.root.walkDecls(cb);
    });
}

function lessDecls(css, cb) {
  return postcss()
    .process(css, { syntax: less, from: undefined })
    .then(result => {
      return result.root.walkDecls(cb);
    });
}

function sassDecls(css, cb) {
  return postcss().process(css, { parser: sass }).then(result => {
    return result.root.walkDecls(cb)
  })
}
