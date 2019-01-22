# at-rule-name-case

Specify lowercase or uppercase for at-rules names.

```css
   @media (min-width: 10px) {}
/** ↑
 * These at-rule names */
```

Only lowercase at-rule names are valid in SCSS.

[命令行](../../../docs/user-guide/cli.md#自动修复错误)中的 `--fix` 选项可以自动修复此规则报告的一些问题。

## 选项

`string`: `"lower"|"upper"`

### `"lower"`

以下模式被视为违规：

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

以下模式*不*被视为违规：

```css
@charset 'UTF-8';
```

```css
@media (min-width: 50em) {}
```

### `"upper"`

以下模式被视为违规：

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

以下模式*不*被视为违规：

```css
@CHARSET 'UTF-8';
```

```css
@MEDIA (min-width: 50em) {}
```
