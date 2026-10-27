# syntax-string-no-invalid

Disallow invalid syntax strings.

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: "<color>";
/**       ↑
 * Syntax strings like this */
}
```

You can use this rule to avoid custom properties that never register. An invalid syntax string [invalidates the whole `@property` rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property/syntax).

Syntax strings are used for the `syntax` descriptor value of the `@property` at-rule. This rule reports invalid syntax strings and unsupported type names.

You can check [§5.1 “Supported Names” of the CSS Properties & Values API](https://drafts.css-houdini.org/css-properties-values-api/#supported-names) for a list of valid syntax component names.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the invalid syntax string.

## Options

### `true`

```json
{
  "syntax-string-no-invalid": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: "<bar>";
}
```

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: "<alpha-value>";
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: "<color>";
}
```

<!-- prettier-ignore -->
```css
@property --foo {
  syntax: "<length> | <color>";
}
```
