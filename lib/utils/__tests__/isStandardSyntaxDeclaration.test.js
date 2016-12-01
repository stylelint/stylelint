"use strict"

const isStandardSyntaxDeclaration = require("../isStandardSyntaxDeclaration")
const less = require("postcss-less")
const postcss = require("postcss")
const scss = require("postcss-scss")

describe("isStandardSyntaxDeclaration", () => {
  it("standard prop and value", () => {
    return rules("a { a: b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("standard prop and scss var", () => {
    return rules("a { a: $b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("custom-property", () => {
    return rules("a { --custom-property: x }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("standard prop and calc value", () => {
    return rules("a { a : calc(b + c) }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("does not break @selector", () => {
    return rules("@page { size: A4 }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with scss variable interpolation (only)", () => {
    return scssRules("a { #{$var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with scss variable interpolation (end)", () => {
    return scssRules("a { prop#{$var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with scss variable interpolation (middle)", () => {
    return scssRules("a { prop#{$var}erty: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("custom property set", () => {
    return scssRules("a { --custom-property-set: { color: blue; } }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with less variable interpolation (only)", () => {
    return lessRules("a { @{var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with less variable interpolation (end)", () => {
    return lessRules("a { prop@{var}: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("property with less variable interpolation (middle)", () => {
    return lessRules("a { prop@{var}erty: 10px; }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
    })
  })

  it("scss var", () => {
    return scssRules("$var: b", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("scss list", () => {
    return scssRules("$list: (key: value, key2: value2)", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("scss map", () => {
    return scssRules("$map: (value, value2)", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("nested scss var", () => {
    return scssRules("a { $var: b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("nested scss list", () => {
    return scssRules("a { $list: (key: value, key2: value2) }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("scss nested property", () => {
    return scssRules("a { border: { style: solid; color: red; } }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("nested scss map", () => {
    return scssRules("a { $map: (value, value2) }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("less var", () => {
    return lessRules("@var: b", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })

  it("nested less var", () => {
    return lessRules("a { @var: b }", decl => {
      expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
    })
  })
})

function rules(css, cb) {
  return postcss().process(css)
  .then(result => {
    return result.root.walkDecls(cb)
  })
}

function scssRules(css, cb) {
  return postcss().process(css, { syntax: scss })
  .then(result => {
    return result.root.walkDecls(cb)
  })
}

function lessRules(css, cb) {
  return postcss().process(css, { syntax: less })
  .then(result => {
    return result.root.walkDecls(cb)
  })
}
