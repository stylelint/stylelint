# selector-pseudo-class-case

Specify lowercase or uppercase for pseudo-class selectors.

```css
  a:hover {}
/** ↑
 * This pseudo-class selector */
```

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered violations:

```css
a:Hover {}
```

```css
a:hOvEr {}
```

```css
a:HOVER {}
```

```css
:ROOT {}
```

```css
:-MS-INPUT-PLACEHOLDER {}
```

The following patterns are *not* considered violations:

```css
a:hover {}
```

```css
:root {}
```

```css
:-ms-input-placeholder {}
```

### `"upper"`

The following patterns are considered violations:

```css
a:Hover {}
```

```css
a:hOvEr {}
```

```css
a:hover {}
```

```css
:root {}
```

```css
:-ms-input-placeholder {}
```

The following patterns are *not* considered violations:

```css
a:HOVER {}
```

```css
:ROOT {}
```

```css
:-MS-INPUT-PLACEHOLDER {}
```
