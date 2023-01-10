# unit-case

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Specify lowercase or uppercase for units.

<!-- prettier-ignore -->
```css
    a { width: 10px; }
/**              ↑
 *     These units */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix most of the problems reported by this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10PX;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10Px;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10pX;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10PIXEL;
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(10PX * 2);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10px;
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(10px * 2);
}
```

### `"upper"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10px;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10Px;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10pX;
}
```

<!-- prettier-ignore -->
```css
a {
  width: 10pixel;
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(10px * 2);
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  width: 10PX;
}
```

<!-- prettier-ignore -->
```css
a {
  width: calc(10PX * 2);
}
```
