# no-indistinguishable-colors

***Deprecated: See [CHANGELOG](../../../CHANGELOG.md).***

Disallow colors that are suspiciously close to being identical.

```css
a { color: black; background: #010101; }
/**        ↑                  ↑
 *         Colors like these two */
```

This rule uses [css-colorguard](https://github.com/SlexAxton/css-colorguard), which itself uses [the CIEDE2000 algorithm](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000) behind-the-scenes, to determine when colors are so close that they probably *should* be the same.

In CSS, nearly identical colors often occur because that color was guessed at or eye-dropped at different times, by different people, with different software, etc.; and the intent was always to use the same color, but unfortunately things didn't turn out that way. Instead of having 5 shades of pale light blue, for example, you probably wanted just one,

For more details about how css-colorguard works, please read [that module's documentation](https://github.com/SlexAxton/css-colorguard).

Bugs and feature requests should be reported on the [css-colorguard issue tracker](https://github.com/SlexAxton/css-colorguard/issues).

## Options

### `true`

Defaults to css-colorguard's default threshold of `3`.

The following patterns are considered warnings:

```css
a { color: black; background: #010101; }
```

The following patterns are *not* considered warnings:

```css
a { color: black; background: #FFF; }
```

## Optional secondary options

The options below directly correspond to the css-colorguard options.

### `threshold: number`

Number can be between `0` and `100`. The default is `3`.

The lower the threshold, the more similar colors have to be to trigger a warning. The higher the threshold, the more warnings you will get.

### `ignore: ["array", "of", "hexes", "to", "ignore"]`

Given:

```js
ignore: ["black"]
```

The following patterns are considered warnings:

```css
a { color: #020202; background: #010101; }
```

The following patterns are *not* considered warnings:

```css
a { color: black; background: #010101; }
```

### `whitelist: [ [ "#colorA", "#colorB" ], [ "#colorA", "#colorB" ] ]`

An array of color pairs to ignore. Each pair is an array with two items.

Given:

```js
whitelist: [ [ "black", "#010101" ] ]
```

The following patterns are considered warnings:

```css
a { color: #020202; background: #010101; }
```

```css
a { color: black; background: #020202; }
```

The following patterns are *not* considered warnings:

```css
a { color: black; background: #010101; }
```
