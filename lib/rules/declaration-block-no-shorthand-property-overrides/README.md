# declaration-block-no-shorthand-property-overrides

Disallow shorthand properties that override related longhand properties.

<!-- prettier-ignore -->
```css
a { background-repeat: repeat; background: green; }
/**                            ↑
 * This overrides the longhand property before it */
```

In almost every case, this is just an authorial oversight. For more about this behavior, see [MDN's documentation of shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties).

This rule supports 2 [message arguments](../../../docs/user-guide/configure.md#message): the shorthand property and the overridden longhand declaration.

## Options

### `true`

```json
{
  "declaration-block-no-shorthand-property-overrides": true
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  padding-left: 10px;
  padding: 20px;
}
```

<!-- prettier-ignore -->
```css
a {
  transition-property: opacity;
  transition: opacity 1s linear;
}
```

<!-- prettier-ignore -->
```css
a {
  -webkit-transition-property: opacity;
  -webkit-transition: opacity 1s linear;
}
```

<!-- prettier-ignore -->
```css
a {
  border-top-width: 1px;
  top: 0;
  bottom: 3px;
  border: 2px solid blue;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { padding: 10px; padding-left: 20px; }
```

<!-- prettier-ignore -->
```css
a { transition-property: opacity; } a { transition: opacity 1s linear; }
```

<!-- prettier-ignore -->
```css
a { transition-property: opacity; -webkit-transition: opacity 1s linear; }
```
