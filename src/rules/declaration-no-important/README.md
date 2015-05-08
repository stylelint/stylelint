# declaration-no-important

Disallow the use of `!important` within declarations.

```css
body {
  background: pink !important;
}
```

## Options

* `true`: there *must not* be `!important` within declarations.
* `false`: there *can* be `!important` within declarations.
