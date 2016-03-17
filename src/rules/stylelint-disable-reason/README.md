# stylelint-disable-reason

Control comments should be preceded by a comment explaining why stylelint are being disabled.

```css
a {
  /* Need for IE 6 */                   /*←*/
  /* eslint-disable no-browser-hacks */ /*↑*/
  /* Need for IE 6 */                   /*←*/
  _display: block;                      /*↑*/
  /* eslint-enable no-browser-hacks */  /*↑*/
}                                       /*↑*/
/**                                       ↑
*                           The reason of disable stylelint */
```

## Options

`string`: `"always-preceding"|"always-succeeding"`

### `"always-preceding"`

There must always be a reason comment before the stylelint disable comment.

The following patterns are considered warnings:

```css
a {
  /* eslint-disable no-browser-hacks */
  _display: block;
  /* eslint-enable no-browser-hacks */
}
```

```css
a {
  /* eslint-disable no-browser-hacks */
  /* Need for IE 6 */
  _display: block;
  /* eslint-enable no-browser-hacks */
}
```

```css
a {} /* stylelint-disable-line block-no-empty */
```

```css
a {
  _display: block; /* stylelint-disable-line block-no-empty */
}
```

The following patterns are not considered warnings:

```css
a {
  /* Reason for disable */
  /* eslint-disable no-browser-hacks */
  _display: block;
  /* eslint-enable no-browser-hacks */
}
```

```css
a {} /* Reason for disable */ /* stylelint-disable-line block-no-empty */
```

```css
a {
  _display: block; /* Reason for disable */ /* stylelint-disable-line no-browser-hacks */
}
```

### `"always-succeeding"`

There must always be a reason comment after the stylelint disable comment.

The following patterns are considered warnings:

```css
a {
  /* eslint-disable no-browser-hacks */
  _display: block;
  /* eslint-enable no-browser-hacks */
}
```

```css
a {
  /* Need for IE 6 */
  /* eslint-disable no-browser-hacks */
  _display: block;
  /* eslint-enable no-browser-hacks */
}
```

```css
a {} /* stylelint-disable-line block-no-empty */
```

```css
a {
  _display: block; /* stylelint-disable-line no-browser-hacks */
}
```

The following patterns are not considered warnings:

```css
a {
  /* eslint-disable no-browser-hacks */
  /* Need for IE 6 */
  _display: block;
  /* eslint-enable no-browser-hacks */
}
```

```css
a {} /* stylelint-disable-line block-no-empty */ /* Reason for disable */
```

```css
a {
  _display: block; /* stylelint-disable-line no-browser-hacks */ /* Reason for disable */
}
```
