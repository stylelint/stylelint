# stylelint-disable-reason

***Deprecated: See [CHANGELOG](../../../CHANGELOG.md).***

Require a reason comment before or after `stylelint-disable` comments.

```css
a {
  /* stylelint-disable no-browser-hacks */
  /* Need for IE 6 */                      /*←*/
  _display: block;                         /*↑*/
  /* stylelint-enable no-browser-hacks */  /*↑*/
}                                          /*↑*/
/**                                          ↑
*                          This reason comment */
```

## Options

`string`: `"always-before"|"always-after"`

### `"always-before"`

There *must always* be a reason comment before the `stylelint-disable` comment.

The following patterns are considered violations:

```css
a {
  /* stylelint-disable no-browser-hacks */
  _display: block;
  /* stylelint-enable no-browser-hacks */
}
```

```css
a {
  /* stylelint-disable no-browser-hacks */
  /* Need for IE 6 */
  _display: block;
  /* stylelint-enable no-browser-hacks */
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

The following patterns are *not* considered violations:

```css
a {
  /* Reason for disable */
  /* stylelint-disable no-browser-hacks */
  _display: block;
  /* stylelint-enable no-browser-hacks */
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

```css
a {
  /* Reason for disable */
  _display: block; /* stylelint-disable-line no-browser-hacks */
}
```

### `"always-after"`

There *must always* be a reason comment after the `stylelint-disable` disable comment.

The following patterns are considered violations:

```css
a {
  /* stylelint-disable no-browser-hacks */
  _display: block;
  /* stylelint-enable no-browser-hacks */
}
```

```css
a {
  /* Need for IE 6 */
  /* stylelint-disable no-browser-hacks */
  _display: block;
  /* stylelint-enable no-browser-hacks */
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

The following patterns are *not* considered violations:

```css
a {
  /* stylelint-disable no-browser-hacks */
  /* Need for IE 6 */
  _display: block;
  /* stylelint-enable no-browser-hacks */
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

```css
a {
  _display: block; /* stylelint-disable-line no-browser-hacks */
  /* Reason for disable */
}
```
