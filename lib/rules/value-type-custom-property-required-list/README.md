# value-type-custom-property-required-list

Specify a list of value types that require custom properties.

<!-- prettier-ignore -->
```css
a { border: 1px solid red; }
/**         ↑         ↑
 * These <length> and <color> values */
```

> [!WARNING]
> This rule is **experimental**, as it's our first whose options take value types. To give feedback on them, [open an issue](https://github.com/stylelint/stylelint/issues/new/choose).

Use this rule to enforce a convention. For example, require custom properties for:

- `color`, so that colors come from your palette
- `length`, so that spacing comes from your scale

For custom properties defined within the same source or within the files specified in the [`referenceFiles`](../../../docs/user-guide/configure.md#referencefiles) configuration property, this rule substitutes their declared values for the `var()`s in a value to find the types of the parts beside them. It ignores the declarations of custom properties, values that contain unknown custom properties, and the fallbacks of `var()`.

The types are those of the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/), without their angle brackets, e.g. `color`, `length` and `time`. You can use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property to extend them.

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the value and its type.

Prior art:

- [stylelint-declaration-strict-value](https://www.npmjs.com/package/stylelint-declaration-strict-value)

## Options

### `Array<string>`

```json
["array", "of", "types"]
```

Given:

```json
{
  "value-type-custom-property-required-list": ["color", "length"]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: red; }
```

<!-- prettier-ignore -->
```css
a { margin: 1px; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  color: var(--foo);
}
```

<!-- prettier-ignore -->
```css
a {
  margin: var(--bar);
}
```

## Optional secondary options

### `ignoreFunctions`

```json
{ "ignoreFunctions": { "type": ["array", "of", "functions", "/regex/"] } }
```

Ignore the parts of a type that are within the specified functions.

Given:

```json
{
  "value-type-custom-property-required-list": [
    ["color", "number", "angle", "percentage"],
    {
      "ignoreFunctions": {
        "number": ["/.+/"],
        "color": ["color-mix"],
        "/^(angle|percentage)$/": ["/-gradient$/"]
      }
    }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: scale(1.5); }
```

<!-- prettier-ignore -->
```css
a { color: color-mix(in srgb, red, blue); }
```

<!-- prettier-ignore -->
```css
a { background: linear-gradient(45deg, var(--foo) 0%, var(--bar) 100%); }
```

### `ignoreProperties`

```json
{ "ignoreProperties": { "type": ["array", "of", "properties", "/regex/"] } }
```

Ignore the parts of a type in the values of the specified properties.

Given:

```json
{
  "value-type-custom-property-required-list": [
    ["color", "length"],
    { "ignoreProperties": { "/.+/": ["transform"], "length": ["/^border/"] } }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { transform: translateX(1px); }
```

<!-- prettier-ignore -->
```css
a { border-width: 1px; }
```

### `ignoreValues`

```json
{ "ignoreValues": ["array", "of", "values", "/regex/"] }
```

Ignore the specified parts of a value.

Given:

```json
{
  "value-type-custom-property-required-list": [
    ["color", "number"],
    { "ignoreValues": ["0", "transparent"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { flex: 0; }
```

<!-- prettier-ignore -->
```css
a { color: transparent; }
```
