# value-type-custom-property-required-list

Specify a list of value types that require custom properties.

<!-- prettier-ignore -->
```css
a { border: 1px solid red; }
/**         ↑         ↑
 * These <length> and <color> values */
```

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

### `ignoreProperties`

```json
{
  "ignoreProperties": { "property-name": ["array", "of", "values", "/regex/"] }
}
```

Ignore the specified property and value pairs.

Keys in the object indicate property names and values indicate the parts of a value.

You can specify a regex for a property name, such as `{ "/.+/": ["transparent"] }`, and for a value, such as `{ "transform": ["/.+/"] }`.

Given:

```json
{
  "value-type-custom-property-required-list": [
    ["color", "length"],
    {
      "ignoreProperties": {
        "/.+/": ["transparent"],
        "transform": ["/.+/"]
      }
    }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: transparent; }
```

<!-- prettier-ignore -->
```css
a { transform: translateX(4px); }
```
