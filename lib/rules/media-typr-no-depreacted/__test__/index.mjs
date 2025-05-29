import rule from '../index.mjs';

const { messages, ruleName } = rule;

testRule({
  ruleName,
  config: [true],
  fix: true,
  accept: [
    { code: '@media screen {}' },
    { code: '@media (min-width: 100px) {}' },
    { code: '@media only screen and (color) {}' },
  ],
  reject: [
    {
      code: '@media tty {}',
      fixed: '@media  {}',
      message: messages.rejected('tty'),
      line: 1,
      column: 8,
    },
    {
      code: '@media speech and (color) {}',
      fixed: '@media (color) {}',
      message: messages.rejected('speech'),
      line: 1,
      column: 8,
    },
  ],
});

testRule({
  ruleName,
  config: [true, { ignoreMediaTypes: ['speech'] }],
  accept: [
    { code: '@media speech {}' },
    { code: '@media Speech {}' },
  ],
  reject: [
    {
      code: '@media tty {}',
      message: messages.rejected('tty'),
    },
  ],
});
