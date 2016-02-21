# color-no-almost-identical

Disallow colors that are suspiciously close to being identical.

```css
h1 { color: black; background: #010101; }
/**           ↑                  ↑
 *              Colors like these */
```

This rule uses [css-colorguard](https://github.com/SlexAxton/css-colorguard), which itself uses [the CIEDE2000 algorithm](http://en.wikipedia.org/wiki/Color_difference#CIEDE2000) behind-the-scenes, to determine when colors are so close that they probably *should* be the same.

In CSS, nearly identical colors often occur because that color was guessed at or eye-dropped at different times, by different people, with different software, etc.; and the intent was always to use the same color, but unfortunately things didn't turn out that way. Instead of having 5 shades of pale light blue, for example, you probably wanted just one,

For more details about how css-colorguard works, please read [that module's documentation]([css-colorguard](https://github.com/SlexAxton/css-colorguard)).
