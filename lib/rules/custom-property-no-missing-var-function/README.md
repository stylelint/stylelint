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
- It does not check properties that can contain author-defined identifiers, e.g. `transition-property`.

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
