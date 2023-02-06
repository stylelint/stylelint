# selector-attribute-operator-space-after

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Require a single space or disallow whitespace after operators within attribute selectors.

<!-- prettier-ignore -->
```css
[target= _blank]
/**    ↑
 * The space after operator */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be a single space after the operator.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[target=_blank] {}
```

<!-- prettier-ignore -->
```css
[target =_blank] {}
```

<!-- prettier-ignore -->
```css
[target='_blank'] {}
```

<!-- prettier-ignore -->
```css
[target="_blank"] {}
```

<!-- prettier-ignore -->
```css
[target ='_blank'] {}
```

<!-- prettier-ignore -->
```css
[target ="_blank"] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[target] {}
```

<!-- prettier-ignore -->
```css
[target= _blank] {}
```

<!-- prettier-ignore -->
```css
[target= '_blank'] {}
```

<!-- prettier-ignore -->
```css
[target= "_blank"] {}
```

<!-- prettier-ignore -->
```css
[target = _blank] {}
```

<!-- prettier-ignore -->
```css
[target = '_blank'] {}
```

<!-- prettier-ignore -->
```css
[target = "_blank"] {}
```

### `"never"`

There _must never_ be a single space after the operator.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[target= _blank] {}
```

<!-- prettier-ignore -->
```css
[target = _blank] {}
```

<!-- prettier-ignore -->
```css
[target= '_blank'] {}
```

<!-- prettier-ignore -->
```css
[target= "_blank"] {}
```

<!-- prettier-ignore -->
```css
[target = '_blank'] {}
```

<!-- prettier-ignore -->
```css
[target = "_blank"] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[target] {}
```

<!-- prettier-ignore -->
```css
[target=_blank] {}
```

<!-- prettier-ignore -->
```css
[target='_blank'] {}
```

<!-- prettier-ignore -->
```css
[target="_blank"] {}
```

<!-- prettier-ignore -->
```css
[target =_blank] {}
```

<!-- prettier-ignore -->
```css
[target ='_blank'] {}
```

<!-- prettier-ignore -->
```css
[target ="_blank"] {}
```
