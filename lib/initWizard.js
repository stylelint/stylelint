/* @flow */
'use strict';

const chalk = require('chalk');
const childProcess = require('child_process');
const cosmiconfig = require('cosmiconfig').cosmiconfig;
const fs = require('fs');
const handleError = require('./handleError');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const util = require('util');

const exec = util.promisify(childProcess.exec);
const writeFile = util.promisify(fs.writeFile);
const explorer = cosmiconfig('stylelint');

const defaultConfigs = {
	js: {
		fileName: 'stylelint.config.js',
		config: (config) => `module.exports = {\n\textends: 'stylelint-config-${config}',\n};\n`,
	},
	yaml: {
		fileName: '.stylelintrc.yaml',
		config: (config) => `extends: stylelint-config-${config}\n`,
	},
	json: {
		fileName: '.stylelintrc.json',
		config: (config) => `{\n\t"extends": "stylelint-config-${config}"\n}`,
	},
};

module.exports = function() {
	return explorer
		.search()
		.then((config) => {
			if (config) {
				process.stdout.write(
					chalk.cyan(`\nYour project is already configured with ${chalk.magenta('Stylelint')}\n`),
				);

				return;
			}

			return inquirer
				.prompt([
					{
						type: 'list',
						name: 'config',
						message: chalk.cyan('1. How would you like to use stylelint?'),
						choices: [
							{
								name: 'To check for possible errors',
								value: 'standard',
							},
							{
								name: 'To check for possible errors and enforce common stylistic conventions',
								value: 'recommended',
							},
						],
					},
					{
						type: 'list',
						name: 'fileType',
						message: chalk.cyan('2. What format do you want your config file to be in?'),
						choices: [
							{ name: 'JavaScript', value: 'js' },
							{ name: 'YAML', value: 'yaml' },
							{ name: 'JSON', value: 'json' },
						],
					},
					{
						type: 'confirm',
						name: 'installDependencies',
						message: (answers) =>
							chalk.cyan(
								'3. The config that you`ve selected requires the following dependencies:\n\n' +
									`\tstylelint-config-${answers.config}@latest\n\n` +
									'Would you like to install them now with npm?',
							),
						default: true,
					},
				])
				.then((result) => {
					const { config, fileType, installDependencies } = result;

					if (installDependencies) {
						// This `console.log` is for the new line only
						console.log(); // eslint-disable-line no-console
						const loader = ora({
							text: chalk.cyan('Installing dependencies...'),
							type: 'dots',
						}).start();

						exec(`npm install stylelint-config-${config}@latest --save-dev`)
							.then(() => {
								loader
									.succeed(chalk.cyan('All necessary dependencies were successfully installed.'))
									.stop();
								const data = defaultConfigs[fileType];
								const projectPath = process.cwd();

								writeFile(path.join(projectPath, data.fileName), data.config(config))
									.then(() => {
										process.stdout.write(
											chalk.cyan(
												`\n${chalk.green('√')} Successfully created ${chalk.magenta(
													data.fileName,
												)} in ${chalk.magenta(projectPath)}.\n\n` +
													'You may want to add rules to your config that limit language features (https://stylelint.io/user-guide/rules#limit-language-features) as these will be specific to your team and/or project.\n',
											),
										);
									})
									.catch(handleError);
							})
							.catch(handleError);
					}
					/**
					 * TODO What if user is not agreed with package installation
					 */
				})
				.catch(handleError);
		})
		.catch(handleError);
};
