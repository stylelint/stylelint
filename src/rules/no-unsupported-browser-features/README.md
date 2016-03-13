# no-unsupported-browser-features

Disallow features that are unsupported by the browsers that you are targeting.

```css
.foo { opacity: 1; }
/**    ↑                 
 * Features like this, which is unsupported in IE 8 */
```

This rule uses [doiuse](https://github.com/anandthakker/doiuse) to detect browser support. doiuse itself checks your code against the ["Can I use"](http://caniuse.com/) database.

**This is a good rule to use with "warning"-level severity**, because its primary purpose is to warn you that you are using features not all browsers support *and therefore ought to provide fallbacks*. But the warning will continue even if you have a fallback in place (it doesn't know); so you probably do not want this rule to break your build. Instead, consider it a friendly reminder to double-check certain spots for fallbacks.

Bugs and feature requests should be reported on the [doiuse issue tracker](https://github.com/anandthakker/doiuse/issues).

## Optional Options

These options are passed directly to doiuse.

### `browsers: "browserslist string"`

A string interpreted by [browserslist](https://github.com/ai/browserslist) that designates precisely which browsers you wish to support. Something like `"> 1%, last 2 versions, ie >= 8"`. For details about the syntax (which is the same as when using Autoprefixer, by the way), please read [the browserslist documentation](https://github.com/ai/browserslist).

Defaults to the doiuse default, which is `"> 1%, last 2 versions, Firefox ESR, Opera 12.1"`.

For example, with the default settings, the following is considered a warning, because IE8 (which as of this writing had *just over* 1% global usage) does not support `opacity`:

```css
.foo { opacity: 0.5; }
```

But if you set `browsers: "last 2 versions, ie >=9"` the declaration above is allowed.

### `ignore: [ "array", "of", "features", "to", "ignore" ]`

If you no longer want to be warned about, say, your use of `rem`, you can use `ignore: ["rem"]`.
