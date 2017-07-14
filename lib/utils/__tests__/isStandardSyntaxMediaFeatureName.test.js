"use strict";

const isStandardSyntaxMediaFeatureName = require("../isStandardSyntaxMediaFeatureName");

describe("isStandardSyntaxMediaFeatureName", () => {
  it("keyword", () => {
    expect(isStandardSyntaxMediaFeatureName("min-width")).toBeTruthy();
  });
  it("keyword", () => {
    expect(
      isStandardSyntaxMediaFeatureName("-webkit-min-device-pixel-ratio")
    ).toBeTruthy();
  });
  it("custom media query", () => {
    expect(isStandardSyntaxMediaFeatureName("--viewport-medium")).toBeTruthy();
  });
  it("scss var", () => {
    expect(isStandardSyntaxMediaFeatureName("$sass-variable")).toBeFalsy();
  });
  it("scss var", () => {
    expect(isStandardSyntaxMediaFeatureName("min-width + $value")).toBeFalsy();
  });
  it("scss var", () => {
    expect(isStandardSyntaxMediaFeatureName("$value + min-width")).toBeFalsy();
  });
  it("scss var", () => {
    expect(
      isStandardSyntaxMediaFeatureName("'min-width + $value'")
    ).toBeFalsy();
  });
  it("scss var", () => {
    expect(
      isStandardSyntaxMediaFeatureName("'$value + min-width'")
    ).toBeFalsy();
  });
  it("scss var", () => {
    expect(
      isStandardSyntaxMediaFeatureName('"min-width + $value"')
    ).toBeFalsy();
  });
  it("scss var", () => {
    expect(
      isStandardSyntaxMediaFeatureName('"$value + min-width"')
    ).toBeFalsy();
  });
  it("scss interpolation", () => {
    expect(isStandardSyntaxMediaFeatureName("min-width#{$value}")).toBeFalsy();
  });
  it("scss interpolation", () => {
    expect(isStandardSyntaxMediaFeatureName("#{$value}min-width")).toBeFalsy();
  });
  it("scss interpolation", () => {
    expect(
      isStandardSyntaxMediaFeatureName("'min-width#{$value}'")
    ).toBeFalsy();
  });
  it("scss interpolation", () => {
    expect(
      isStandardSyntaxMediaFeatureName("'#{$value}min-width'")
    ).toBeFalsy();
  });
  it("scss interpolation", () => {
    expect(
      isStandardSyntaxMediaFeatureName('"min-width#{$value}"')
    ).toBeFalsy();
  });
  it("scss interpolation", () => {
    expect(
      isStandardSyntaxMediaFeatureName('"#{$value}min-width"')
    ).toBeFalsy();
  });
});
