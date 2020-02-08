# Ignoring code

You can ignore sections within files or files entirely.

## Sections within files

You can temporarily turn off rules using special comments in your CSS. For example, you can either turn all the rules off:

```css
/* stylelint-disable */
a {}
/* stylelint-enable */
```

Or you can turn off individual rules:

```css
/* stylelint-disable selector-no-id, declaration-no-important */
#id {
  color: pink !important;
}
/* stylelint-enable selector-no-id, declaration-no-important */
```

You can turn off rules for individual lines with a `/* stylelint-disable-line */` comment, after which you do not need to explicitly re-enable them:

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

stylelint supports complex, overlapping disabling & enabling patterns:

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

## Files entirely

You can use a `.stylelintignore` file to ignore specific files.

The patterns in your `.stylelintignore` file must match [`.gitignore` syntax](https://git-scm.com/docs/gitignore). (Behind the scenes, [`node-ignore`](https://github.com/kaelzhang/node-ignore) parses your patterns.) *Your patterns in `.stylelintignore` are always analyzed relative to `process.cwd()`.*

stylelint looks for a `.stylelintignore` file in `process.cwd()`. You can also specify a path to your ignore patterns file (absolute or relative to `process.cwd()`) using the `--ignore-path` (in the CLI) and `ignorePath` (in JS) options.

Alternatively, you can add an [`ignoreFiles` property](configure.md#ignorefiles) within your configuration object.
