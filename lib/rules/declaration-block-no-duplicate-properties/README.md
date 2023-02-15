# declaration-block-no-duplicate-properties

Disallow duplicate properties within declaration blocks.

<!-- prettier-ignore -->
```css
a { color: pink; color: orange; }
/** ↑            ↑
 * These duplicated properties */
```

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; color: orange; }
```

<!-- prettier-ignore -->
```css
a { color: pink; background: orange; color: orange }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; }
```

<!-- prettier-ignore -->
```css
a { color: pink; background: orange; }
```

## Optional secondary options

### `ignore: ["consecutive-duplicates"]`

Ignore consecutive duplicated properties.

They can prove to be useful fallbacks for older browsers.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
p {
  font-size: 16px;
  font-weight: 400;
  font-size: 1rem;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
p {
  font-size: 16px;
  font-size: 1rem;
  font-weight: 400;
}
```

### `ignore: ["consecutive-duplicates-with-different-values"]`

Ignore consecutive duplicated properties with different values.

Including duplicate properties (fallbacks) is useful to deal with older browsers support for CSS properties. E.g. using `px` units when `rem` isn't available.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
/* properties with the same value */
p {
  font-size: 16px;
  font-size: 16px;
  font-weight: 400;
}
```

<!-- prettier-ignore -->
```css
/* nonconsecutive duplicates */
p {
  font-size: 16px;
  font-weight: 400;
  font-size: 1rem;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
p {
  font-size: 16px;
  font-size: 1rem;
  font-weight: 400;
}
```

### `ignore: ["consecutive-duplicates-with-same-prefixless-values"]`

Ignore consecutive duplicated properties with identical values, when ignoring their prefix.

This option is useful to deal with draft CSS values while still being future proof. E.g. using `fit-content` and `-moz-fit-content`.

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
/* nonconsecutive duplicates */
p {
  width: fit-content;
  height: 32px;
  width: -moz-fit-content;
}
```

<!-- prettier-ignore -->
```css
/* properties with different prefixless values */
p {
  width: -moz-fit-content;
  width: 100%;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
p {
  width: -moz-fit-content;
  width: fit-content;
}
```

### `ignoreProperties: ["/regex/", "non-regex"]`

Ignore duplicates of specific properties.

Given:

```json
["color", "/background-/"]
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; background: orange; background: white; }
```

<!-- prettier-ignore -->
```css
a { background: orange; color: pink; background: white; }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a { color: pink; color: orange; background-color: orange; background-color: white; }
```

<!-- prettier-ignore -->
```css
a { color: pink; background-color: orange; color: orange; background-color: white; }
```
