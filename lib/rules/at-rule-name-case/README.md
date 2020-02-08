# at-rule-name-case

Specify lowercase or uppercase for at-rules names.

```css
   @media (min-width: 10px) {}
/** ↑
 * This at-rule name */
```

Only lowercase at-rule names are valid in SCSS.

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix some of the problems reported by this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered violations:

```css
@Charset 'UTF-8';
```

```css
@cHarSeT 'UTF-8';
```

```css
@CHARSET 'UTF-8';
```

```css
@Media (min-width: 50em) {}
```

```css
@mEdIa (min-width: 50em) {}
```

```css
@MEDIA (min-width: 50em) {}
```

The following patterns are *not* considered violations:

```css
@charset 'UTF-8';
```

```css
@media (min-width: 50em) {}
```

### `"upper"`

The following patterns are considered violations:

```css
@Charset 'UTF-8';
```

```css
@cHarSeT 'UTF-8';
```

```css
@charset 'UTF-8';
```

```css
@Media (min-width: 50em) {}
```

```css
@mEdIa (min-width: 50em) {}
```

```css
@media (min-width: 50em) {}
```

The following patterns are *not* considered violations:

```css
@CHARSET 'UTF-8';
```

```css
@MEDIA (min-width: 50em) {}
```
