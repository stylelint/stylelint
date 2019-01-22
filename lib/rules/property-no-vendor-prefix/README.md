# property-no-vendor-prefix

Disallow vendor prefixes for properties.

```css
a { -webkit-transform: scale(1); }
/**  ↑
 * These prefixes */
```

This rule does not blanketly condemn vendor prefixes. Instead, it uses [Autoprefixer's](https://github.com/postcss/autoprefixer) up-to-date data (from [caniuse.com](http://caniuse.com/)) to know whether a vendor prefix should cause a violation or not. *If you've included a vendor prefixed property that has a standard alternative, one that Autoprefixer could take care of for you, this rule will complain about it*. If, however, you use a non-standard vendor-prefixed property, one that Autoprefixer would ignore and could not provide (such as `-webkit-touch-callout`), this rule will ignore it.

## 选项

### `true`

以下模式被视为违规：

```css
a { -webkit-transform: scale(1); }
```

```css
a { -moz-columns: 2; }
```

以下模式*不*被视为违规：

```css
a { transform: scale(1); }
```

```css
a {
columns: 2; }
```

```css
a { -webkit-touch-callout: none; }
```

## 可选的辅助选项

### `ignoreProperties: ["/regex/", /regex/, "string"]`

给定：

```js
["transform", "columns"]
```

以下模式*不*被视为违规：

```css
a { -webkit-transform: scale(1); }
```

```css
a { -moz-columns: 2; }
```
