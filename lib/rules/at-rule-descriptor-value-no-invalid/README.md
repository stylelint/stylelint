# at-rule-descriptor-value-no-invalid

Disallow invalid values for descriptors within at-rules.

<!-- prettier-ignore -->
```css
@counter-style foo {
  system: unknown;
/**       ↑
 * Values like this */
}
```

This rule considers descriptors and values defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what values are valid for a descriptor of an at-rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

This rule checks descriptor values within at-rules. You can use [`declaration-property-value-no-unknown`](../declaration-property-value-no-unknown/README.md) rule to disallow unknown values for properties within declarations.

Prior art:

- [stylelint-csstree-validator](https://www.npmjs.com/package/stylelint-csstree-validator)

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@counter-style foo {
  system: unknown;
}
```

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: unknown;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@counter-style foo {
  system: numeric;
}
```

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: "<color>";
}
```
