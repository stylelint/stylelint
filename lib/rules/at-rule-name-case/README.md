# at-rule-name-case

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Specify lowercase or uppercase for at-rules names.

<!-- prettier-ignore -->
```css
   @media (min-width: 10px) {}
/** ↑
 * This at-rule name */
```

Only lowercase at-rule names are valid in SCSS.

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@Charset 'UTF-8';
```

<!-- prettier-ignore -->
```css
@cHarSeT 'UTF-8';
```

<!-- prettier-ignore -->
```css
@CHARSET 'UTF-8';
```

<!-- prettier-ignore -->
```css
@Media (min-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@mEdIa (min-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@MEDIA (min-width: 50em) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@charset 'UTF-8';
```

<!-- prettier-ignore -->
```css
@media (min-width: 50em) {}
```

### `"upper"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@Charset 'UTF-8';
```

<!-- prettier-ignore -->
```css
@cHarSeT 'UTF-8';
```

<!-- prettier-ignore -->
```css
@charset 'UTF-8';
```

<!-- prettier-ignore -->
```css
@Media (min-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@mEdIa (min-width: 50em) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 50em) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@CHARSET 'UTF-8';
```

<!-- prettier-ignore -->
```css
@MEDIA (min-width: 50em) {}
```
