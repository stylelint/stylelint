# value-no-vendor-prefix

Disallow vendor prefixes for values.

<!-- prettier-ignore -->
```css
a { display: -webkit-flex; }
/**           ↑
 *  This prefix */
```

This rule does not fix vendor-prefixed values that weren't handled by [Autoprefixer](https://github.com/postcss/autoprefixer) version 10.2.5. Exceptions may be added on a case by case basis.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule. However, it will not remove duplicate values produced when the prefixes are removed. You can use [Autoprefixer](https://github.com/postcss/autoprefixer) itself, with the [`add` option off and the `remove` option on](https://github.com/postcss/autoprefixer#options), in these situations.

## Options

### `true`

```json
{
  "value-no-vendor-prefix": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { display: -webkit-flex; }
```

<!-- prettier-ignore -->
```css
a { max-width: -moz-max-content; }
```

<!-- prettier-ignore -->
```css
a { background: -webkit-linear-gradient(bottom, #000, #fff); }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { display: flex; }
```

<!-- prettier-ignore -->
```css
a { max-width: max-content; }
```

<!-- prettier-ignore -->
```css
a { background: linear-gradient(bottom, #000, #fff); }
```

## Optional secondary options

### `ignoreValues`

```json
{ "ignoreValues": ["array", "of", "values", "/regex/"] }
```

Given:

```json
{
  "value-no-vendor-prefix": [
    true,
    { "ignoreValues": ["grab", "max-content", "/^-moz-all$/"] }
  ]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { cursor: -webkit-grab; }
```

<!-- prettier-ignore -->
```css
a { max-width: -moz-max-content; }
```

<!-- prettier-ignore -->
```css
a { -moz-user-select: -moz-all; }
```

> [!WARNING]
> An _exact_ match comparison will be performed for non-regex strings in the next major version.
> If you want to keep the legacy behavior, please consider using a regex instead.
> E.g. `[/^(-webkit-|-moz-)?max-content$/]`.
