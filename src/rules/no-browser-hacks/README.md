# no-browser-hacks

Disallow browser hacks that are irrelevant to the browsers you are targeting.

```css
h1 { _color: white; }
/**  ↑                 
 * Hacks like this */
```

If you are uncertain what "browser hacks" are, ["An Introduction to Browser-Specific Hacks"](http://www.sitepoint.com/browser-specific-css-hacks/) explains it well.

This rule uses [stylehacks](https://github.com/ben-eb/stylehacks) to detect the hacks. Then, in the spirit of stylelint, it tells you that you've done something wrong. If instead you would like to automatically remove browser hacks, use [stylehacks](https://github.com/ben-eb/stylehacks) directly.

[stylehacks](https://github.com/ben-eb/stylehacks) is only compatible with standard CSS syntax.

Bugs and feature requests should be reported on the [stylehacks issue tracker](https://github.com/ben-eb/stylehacks/issues).

## Optional Options

### `browsers: "browserslist string"`

A string interpreted by [browserslist](https://github.com/ai/browserslist) that designates precisely which browsers you wish to support. Something like `"> 1%, last 2 versions, ie >= 8"`. For details about the syntax (which is the same as when using Autoprefixer, by the way), please read [the browserslist documentation](https://github.com/ai/browserslist).

Defaults to the browserslist default, which targets modern browsers.

For example, with the default settings, the following, which targets IE7-8, is considered a warning:

```css
.foo { color/*\**/: pink\9; }
```

But if you set `browsers: [ "last 2 versions", "ie >=7" ]` the hack above is allowed.
