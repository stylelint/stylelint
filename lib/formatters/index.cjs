'use strict';

const _interopNamespaceDefaultOnly = e => Object.freeze({ __proto__: null, default: e });

/** @type {import('stylelint').Formatters} */
const formatters = {
	get compact() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./compactFormatter.cjs'))).then((m) => m.default);
	},
	get github() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./githubFormatter.cjs'))).then((m) => m.default);
	},
	get json() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./jsonFormatter.cjs'))).then((m) => m.default);
	},
	get string() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./stringFormatter.cjs'))).then((m) => m.default);
	},
	get tap() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./tapFormatter.cjs'))).then((m) => m.default);
	},
	get unix() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./unixFormatter.cjs'))).then((m) => m.default);
	},
	get verbose() {
		return Promise.resolve().then(() => /*#__PURE__*/_interopNamespaceDefaultOnly(require('./verboseFormatter.cjs'))).then((m) => m.default);
	},
};

module.exports = formatters;
