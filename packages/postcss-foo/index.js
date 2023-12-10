import postcss from 'postcss'; // eslint-disable-line n/no-extraneous-import

const parse = postcss.parse;

const stringify = postcss.stringify;

export default { parse, stringify };
