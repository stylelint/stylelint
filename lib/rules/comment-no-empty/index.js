"use strict";

const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "comment-no-empty";

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty comment"
});

function createReportForComment(comment, result) {
  report({
    message: messages.rejected,
    node: comment,
    result,
    ruleName
  });
}

function checkComment(comment) {
  return comment.text && comment.text.length !== 0;
}

function createReportForSCSScommentsGroup(group, result) {
  group.comments.forEach(comment => createReportForComment(comment, result));
}

function checkSCSScommentsGroup(group) {
  return group.comments.every(c => !checkComment(c));
}

const rule = function(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    let lastInlineCommentsGroup = null;

    root.walkComments(comment => {
      // SCSS comments
      if (comment.raws.inline || comment.inline) {
        if (lastInlineCommentsGroup) {
          if (comment.source.start.line === lastInlineCommentsGroup.line) {
            lastInlineCommentsGroup.line++;
            lastInlineCommentsGroup.comments.push(comment);

            return;
          } else if (checkSCSScommentsGroup(lastInlineCommentsGroup)) {
            // check is group valid
            createReportForSCSScommentsGroup(lastInlineCommentsGroup, result);
          }
        }

        lastInlineCommentsGroup = {
          line: comment.source.start.line + 1,
          comments: [comment]
        };
      } else if (!checkComment(comment)) {
        createReportForComment(comment, result);
      }
    });

    // check is group valid, if it exists
    if (
      lastInlineCommentsGroup &&
      checkSCSScommentsGroup(lastInlineCommentsGroup)
    ) {
      createReportForSCSScommentsGroup(lastInlineCommentsGroup, result);
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
