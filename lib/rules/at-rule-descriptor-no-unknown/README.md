# at-rule-descriptor-no-unknown

Disallow unknown descriptors for at-rules.

<!-- prettier-ignore -->
```css
@counter-style foo {
  unknown-descriptor: cyclic;
/**                ↑
 * Descriptors like this */
}
```

This rule considers descriptors defined in the CSS Specifications, up to and including Editor's Drafts, to be known.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what descriptors are known for an at-rule.


The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

Prior art:
- [stylelint-csstree-validator](https://www.npmjs.com/package/stylelint-csstree-validator)

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@counter-style example {
  unknown-descriptor: value;
}
```

```css
@property --example {
  unknown-descriptor: value;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@counter-style example {
  system: cyclic;
  symbols: "•";
}
```

<!-- prettier-ignore -->
```css
@property --example {
  syntax: "<color>";
  inherits: false;
  initial-value: "aqua";
}
```
