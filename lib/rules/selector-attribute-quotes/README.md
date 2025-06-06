# selector-attribute-quotes

Require or disallow quotes for attribute values.

<!-- prettier-ignore -->
```css
[target="_blank"] {}
/**     ↑      ↑
 * These quotes */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix most of the problems reported by this rule.

## Options

### `"always"`

Attribute values _must always_ be quoted.

```json
{
  "selector-attribute-quotes": "always"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[title=flower] {}
```

<!-- prettier-ignore -->
```css
[class^=top] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[title] {}
```

<!-- prettier-ignore -->
```css
[target="_blank"] {}
```

<!-- prettier-ignore -->
```css
[class|="top"] {}
```

<!-- prettier-ignore -->
```css
[title~='text'] {}
```

<!-- prettier-ignore -->
```css
[data-attribute='component'] {}
```

### `"never"`

Attribute values _must never_ be quoted.

```json
{
  "selector-attribute-quotes": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[target="_blank"] {}
```

<!-- prettier-ignore -->
```css
[class|="top"] {}
```

<!-- prettier-ignore -->
```css
[title~='text'] {}
```

<!-- prettier-ignore -->
```css
[data-attribute='component'] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[title] {}
```

<!-- prettier-ignore -->
```css
[title=flower] {}
```

<!-- prettier-ignore -->
```css
[class^=top] {}
```
