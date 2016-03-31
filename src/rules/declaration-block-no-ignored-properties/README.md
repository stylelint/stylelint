# declaration-block-no-ignored-properties

Disallow property values that are ignored due to another property value in the same rule.

```css
a { display: inline; width: 100px; }
/**                  ↑
 *       This property */
```

Certain property value pairs rule out other property value pairs, causing them to be ignored by the browser. For example, when en element has display: inline, any further declarations about width, height and margin-top properties will be ignored. Sometimes this is confusing: maybe you forgot that your margin-top will have no effect because the element has display: inline, so you spend a while struggling to figure out what you've done wrong. This rule protects against that confusion by ensuring that within a single rule you don't use property values that are ruled out by other property values in that same rule.

The rule warns when it finds:

- `display: inline` used with `width`, `height`, `margin`, `margin-top`, `margin-bottom`, and `float`.
- `display: inline-block` used with `float`.
- `display: block` used with `vertical-align`.
- `display: table-*` used with `margin` (and all variants) or `float`.
- `position: static` used with `top`, `right`, `bottom`, and `left`.
- `position: absolute` used with `float`.
- `position: fixed` used with `float`.

The following patterns are considered warnings:

```css
a { display: inline; width: 100px; }
```

`display: inline` causes `width` to be ignored.

```css
a { display: inline; height: 100px; }
```

`display: inline` causes `height` to be ignored.

```css
a { display: inline; margin: 10px; }
```

`display: inline` causes `margin` to be ignored.

```css
a { display: inline-block; float: left; }
```

`display: inline-block` causes `float` to be ignored.

```css
a { display: block; vertical-align: baseline; }
```

`display: block` causes `vertical-align` to be ignored.

The following patterns are *not* considered warnings:

```css
a { display: inline: margin-left: 10px; }
```

```css
a { display: inline: margin-right: 10px; }
```

```css
a { display: inline: padding: 10px; }
```

```css
a { display: inline-block; width: 100px; }
```

Although `display: inline` causes `width` to be ignored, `inline-block` works with `width`.

```css
a { display: block; float: left; }
```

Although `display: inline-block` causes `float` to be ignored, `block` works with `float`.
