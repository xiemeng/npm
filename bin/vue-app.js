#!/usr/bin/env node

const download = require('download-git-repo')
const program = require('commander')
const exists = require('fs').existsSync
const path = require('path')
const ora = require('ora')
const home = require('user-home')
const tildify = require('tildify')
const chalk = require('chalk')
const inquirer = require('inquirer')
const rm = require('rimraf').sync
const logger = require('../lib/logger')

/**
 * Usage.
 */

program
  .usage('<template-name> [project-name]')
  .option('-c, --clone', 'use git clone')
  .option('--offline', 'use cached template')

/**
 * Help.
 */

program.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # 创建react app'))
  console.log('abbo-react webpack')
  console.log(chalk.gray('    # 创建vue 活动模板'))
  console.log('abbo-vue-activity webpack')
  console.log(chalk.gray('    # 创建vue app 模板'))
  console.log('abbo-vue-app webpack')
  console.log()
  console.log(chalk.gray('    # create a new project straight from a github template'))
  console.log('    $ vue init username/repo my-project')
  console.log()
})

/**
 * Help.
 */

function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

/**
 * Settings.
 */

let template = program.args[0]
const hasSlash = template.indexOf('/') > -1
const rawName = program.args[1]
const inPlace = !rawName || rawName === '.'
const name = inPlace ? path.relative('../', process.cwd()) : rawName
const to = path.resolve(rawName || '.')
const clone = program.clone || false

const tmp = path.join(home, '.vue-templates', template.replace(/\//g, '-'))
console.log(tmp)
if (program.offline) {
  console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`)
  template = tmp
}

/**
 * Padding.
 */

console.log()
process.on('exit', () => {
  console.log()
})

if (exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(logger.fatal)
} else {
  run()
}

/**
 * Check, download and generate the project.
 */

function run () {
  // check if template is local
  downloadAndGenerate('xiemeng/creat-vue-app')
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate (template) {
  const spinner = ora('downloading template')
  spinner.start()
  // Remove if local template exists
  if (exists(tmp)) rm(tmp)
download(template, 'tmp', { clone }, function (err) {
	console.log(err)
		spinner.stop()
	})
//download(template, 'tmp', { clone }, err => {
//  spinner.stop()
//  if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
//  generate(name, tmp, to, err => {
//    if (err) logger.fatal(err)
//    console.log()
//    logger.success('Generated "%s".', name)
//  })
//})
}