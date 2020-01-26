# Syntaxes

There are many styling languages, ranging from CSS language extension like SCSS to entirely different notations like CSS-in-JS objects. These styling languages can be then be embedded within other languages, including HTML `<style>` tags, markdown fences and JavaScript variables.

We aim to support all these use cases, but it's a complicated task.

We use [PostCSS syntaxes](https://github.com/postcss/postcss#syntaxes) to transform these languages into something that resembles CSS, which is the language that:

-   underpins all the other styling languages
-   is best understood by stylelint

We need your help to [support and improve](https://github.com/postcss/postcss/blob/master/docs/syntax.md) the following PostCSS syntaxes:

-   postcss-html
-   postcss-jsx
-   postcss-less
-   postcss-markdown
-   postcss-sass
-   postcss-scss
