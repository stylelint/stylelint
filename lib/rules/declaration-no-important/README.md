# declaration-no-important

Disallow `!important` within declarations.

```css
a { color: pink !important; }
/**             ↑
 * This !important */
```

If you always want `!important` in your declarations, e.g. if you're writing [user styles](https://userstyles.org/), you can *safely* add them using [`postcss-safe-important`](https://github.com/crimx/postcss-safe-important).

## 选项

### `true`

以下模式被视为违规：

```css
a { color: pink !important; }
```

```css
a { color: pink ! important; }
```

```css
a { color: pink!important; }
```

以下模式*不*被视为违规：

```css
a { color: pink; }
```
