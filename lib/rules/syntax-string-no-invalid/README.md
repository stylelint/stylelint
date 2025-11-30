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

Syntax strings are used for the `syntax` descriptor value of the `@property` at-rule. This rule checks their grammar and flags unsupported type names.

You can check [§5.1 “Supported Names” of the CSS Properties & Values API](https://drafts.css-houdini.org/css-properties-values-api/#supported-names) for a list of valid syntax component names.

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
