# 管理问题

您可以：

-   使用[标签](https://github.com/stylelint/stylelint/labels)，并且：
    -   添加 _一个_ `status: *` 标签（或者在准备好的时候添加 `help wanted` 标签）
    -   添加 _零或一个_  `type: *` 标签
    -   添加 _零或多个_ `non-standard syntax: *` 标签
    -   可选项，添加  `good first issue` 标签
-   把标题重命名为统一格式：
    -   以[更新日志组名](pull-requests.md)为开头，但使用的现在时：
        -   "Remove y" 例如："Remove unit-blacklist"
        -   "Deprecate x in y" 例如："Deprecate resolvedNested option in selector-class-pattern"
        -   "Add y" 例如："Add unit-blacklist"
        -   "Add x to y" 例如："Add ignoreProperties: [] to property-blacklist"
        -   "Fix false positives/negatives for x in y" 例如："Fix false positives for Less mixins in color-no-hex"
    -   使用 `*` 如果这个问题适用于一组规则，例如："Fix false negatives for SCSS variables in selector-*-pattern"
-   提供一个指向[开发者指南](../developer-guide.md)中相关部分的链接，当：
    -   添加 `help wanted` 标签来鼓励楼主去贡献提交 例如：[向现有规则添加选项](../developer-guide/rules.md#adding-an-option-to-an-existing-rule)或者[修复现有规则中的 bug](../developer-guide/rules.md#fixing-a-bug-in-an-existing-rule)
    -   关闭一个问题，因为该功能最好是生态系统的一部分 例如：[插件](https://github.com/stylelint/stylelint/blob/master/docs/developer-guide/plugins.md) 或者 [处理器](https://github.com/stylelint/stylelint/blob/master/docs/developer-guide/processors.md)
-   仅在问题上使用里程碑，而不要在拉取请求上使用里程碑，并且：
    -   为引入重大变化的问题使用 `future-major` 里程碑
    -   可选项，创建版本里程碑（例如 `8.x`）来管理即将发布的版本
-   使用以下保存的回复来关闭任何不使用模板的问题：

```md
感谢您创建此问题，但我们正在关闭它，因为提问需要使用我们的模板之一，以便我们能够清楚地了解您的具体情况。

请使用我们的模板之一[重新创建问题](https://github.com/stylelint/stylelint/issues/new/choose)，以便我们帮助您。
```

这里有三个何时使用何种标签的经验法则：

-   首次对问题进行分类时：`status: discussion`、`status: needs clarification` 或者 `status: needs investigation`
-   当行动方案达成一致时：`help wanted`、`type` (还有 `non-standard syntax: *` 和 `good first issue`)
-   有人说自己即将处理该问题时：`status: wip`
