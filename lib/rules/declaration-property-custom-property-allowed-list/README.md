# declaration-property-custom-property-allowed-list

Specify a list of allowed property and custom property pairs within declarations.

<!-- prettier-ignore -->
```css
a { color: var(--foo); }
/** ↑          ↑
 * These properties and these custom properties */
```

You can use this rule to enforce a subset of custom properties for a property as a convention. For example, allow only:

- `/^--radius-/` for `/radius$/`, so that only radius tokens are used for radii
- `/^--space-/` for `/^(margin|padding|gap)/`, so that only spacing tokens are used for spacing

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the property name and the disallowed custom property.

## Options

### `Object<string, Array<string>>`

```json
{ "property-name": ["array", "of", "custom-properties", "/regex/"] }
```

You can specify a regex for a property name, such as `{ "/^animation/": [] }`.

Given:

```json
{
  "declaration-property-custom-property-allowed-list": {
    "/color/": ["/^--foo-/"],
    "border": ["/^--foo-/", "--bar"]
  }
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: var(--bar); }
```

<!-- prettier-ignore -->
```css
a { background-color: var(--bar); }
```

<!-- prettier-ignore -->
```css
a { border: var(--baz) solid var(--qux); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: var(--foo-baz); }
```

<!-- prettier-ignore -->
```css
a { background-color: var(--foo-baz); }
```

<!-- prettier-ignore -->
```css
a { border: var(--foo-baz) solid var(--bar); }
```
