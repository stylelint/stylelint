# Ignoring code

You can ignore sections of code within files or ignore specific files.

## Ignoring sections of code

Rules can be temporarily turned off by using special comments in your CSS. For example, you can either turn all the rules off:

```css
/* stylelint-disable */
a {}
/* stylelint-enable */
```

Or you can turn off individual rules:

```css
/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
  color: pink !important;
}
/* stylelint-enable */
```

You can turn off rules for individual lines only with a `/* stylelint-disable-line */` comment, after which you do not need to explicitly re-enable them:

```css
#id { /* stylelint-disable-line */
  color: pink !important; /* stylelint-disable-line declaration-no-important */
}
```

You can also turn off rules for *the next line only* with a `/* stylelint-disable-next-line */` comment, after which you do not need to explicitly re-enable them:

```css
#id {
  /* stylelint-disable-next-line declaration-no-important */
  color: pink !important;
}
```

Complex, overlapping disabling & enabling patterns are supported:

```css
/* stylelint-disable */
/* stylelint-enable foo */
/* stylelint-disable foo */
/* stylelint-enable */
/* stylelint-disable foo, bar */
/* stylelint-disable baz */
/* stylelint-enable baz, bar */
/* stylelint-enable foo */
```

**Caveat:** Comments within *selector and value lists* are currently ignored.

## Ignoring specific files

You can use a `.stylelintignore` file (or point to another ignore patterns file) to ignore specific files.

These files will be excluded from the files glob before the file system is check at all, so it is an efficient method for ignoring lots of files.

The patterns in your `.stylelintignore` file must match [`.gitignore` syntax](https://git-scm.com/docs/gitignore). (Behind the scenes, [`node-ignore`](https://github.com/kaelzhang/node-ignore) parses your patterns.) One implication of this is that *your patterns in `.stylelintignore` are always analyzed relative to `process.cwd()`.*

stylelint will look for a `.stylelintignore` file in `process.cwd()`. You can also specify a path to your ignore patterns file (absolute or relative to `process.cwd()`) using the `--ignore-path` (in the CLI) and `ignorePath` (in JS) options.

Alternatively, you can add a `ignoreFiles` property within your configuration object.
