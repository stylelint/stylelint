# custom-property-no-missing-var-function

Disallow missing `var` function for custom properties.

<!-- prettier-ignore -->
```css
    :root { --foo: red; }
    a { color: --foo; }
/**            ↑
 *             This custom property */
```

This rule has the following limitations:

- It only reports custom properties that are defined within the same source.
- It does not check properties that accept a `<custom-ident>` or `<dashed-ident>` as their whole value, e.g. `transition-property`.

You can filter the [CSSTree Syntax Reference](https://csstree.github.io/docs/syntax/) to find out what properties accept them, and use the [`languageOptions`](../../../docs/user-guide/configure.md#languageoptions) configuration property to extend it.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the custom property.

## Options

### `true`

```json
{
  "custom-property-no-missing-var-function": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
:root { --foo: red; }
a { color: --foo; }
```

<!-- prettier-ignore -->
```css
@property --foo {}
a { color: --foo; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
:root { --foo: red; }
a { color: var(--foo); }
```

<!-- prettier-ignore -->
```css
@property --foo {}
a { color: var(--foo); }
```

<!-- prettier-ignore -->
```css
@property --foo {}
a { transition-property: --foo; }
```
