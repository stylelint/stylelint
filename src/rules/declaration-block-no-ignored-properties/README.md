# declaration-block-no-ignored-properties

Disallow properties has no effect.

```css
a { display: inline; width: 100px; }
/**                        ↑
 *                  This property */
```

The following patterns are considered warnings:

```css
a { display: inline; width: 100px; }
```

```css
a { display: inline; height: 100px; }
```

```css
a { display: inline; margin: 10px; }
```

```css
a { display: inline-block; float: left; }
```

```css
a { display: block; vertical-align: baseline; }
```

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

```css
a { display: block; float: left; }
```
