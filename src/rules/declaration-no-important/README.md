# declaration-no-important

Disallow the use of `!important` within declarations.

## Options

* `true`: there *must not* be `!important` within declarations.
* `false`: there *can* be `!important` within declarations.

### `true`

The following patterns are *not* considered warnings:

```css
body {
  background: pink !important;
}
```

The following patterns are considered warnings:

```css
body {
  background: pink;
}
```

### `false`

The following patterns are *not* considered warnings:

```css
body {
  background: pink;
  color: red !important;
}
```
