# at-rule-prelude-no-invalid

Disallow invalid preludes for at-rules.

<!-- prettier-ignore -->
```css
@property --foo {}
/**       ↑
 * Preludes like this */
```

This rule considers preludes for at-rules defined within the CSS specifications, up to and including Editor's Drafts, to be valid.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what descriptors are known for an at-rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

Prior art:

- [stylelint-csstree-validator](https://www.npmjs.com/package/stylelint-csstree-validator)

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@property foo {}
```

<!-- prettier-ignore -->
```css
@font-palette-values foo {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@property --foo {}
```

<!-- prettier-ignore -->
```css
@font-palette-values --foo {}
```

## Secondary Options

### `ignoreAtRules: ["/regex/", /regex/, "string"]`

Given:

```json
["property", "/^font-/"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@property foo;
```

<!-- prettier-ignore -->
```css
@font-palette-values foo {}
```

<!-- prettier-ignore -->
```css
@font-feature-values #foo {}
```
