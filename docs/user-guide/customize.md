# Customizing

You can customize stylelint to meet your needs.

## Your configuration

For example, you may want to use the:

-   [`stylelint-config-sass-guidelines` config](https://github.com/bjankord/stylelint-config-sass-guidelines) if you write SCSS
-   [`stylelint-order` plugin](https://github.com/hudochenkov/stylelint-order) if you want to order things like properties

You'll find more [configs](https://github.com/ntwb/awesome-stylelint#configs) and [plugins](https://github.com/ntwb/awesome-stylelint#plugins) listed in [awesome stylelint](https://github.com/ntwb/awesome-stylelint).

To further customize stylelint, you can configure:

-   [rules](configure.md#rules)
-   [shared configs](configure.md#extends)
-   [plugins](configure.md#plugins)

We recommend you add [rules that limit language features](rules/list.md#limit-language-features) to your configuration file. These are important rules that you can use to enforce non-stylistic consistency in your code.

## Your usage

You don't have to use [Command Line Interface](usage/cli.md); you can also use the:

-   [Node API](usage/node-api.md)
-   [PostCSS plugin](usage/postcss-plugin.md)

There are integrations for [editors](integrations/editor.md), [task-runners](integrations/task-runner.md) and [others](integrations/other.md) too.

Our [extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) is a popular choice that lets you see violations inline in your editor.
