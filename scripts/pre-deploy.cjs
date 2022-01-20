/* eslint-disable @typescript-eslint/no-unused-vars */
const path = require('path')
const { cwd } = require('process')
const fs = require('fs')
const execa = require('execa')
const minimist = require('minimist')
const merge = require('merge-package-json')

require('root-check')()
const log = require('npmlog')

const argv = minimist(process.argv.slice(2))
const target = argv.target
const service = argv.service || target
const rootDir = cwd()
const targetBaseDir = path.resolve(__dirname, `../apps/${target}`)
let distDir

if (!target) {
  const msg = `target should not be undefined. You can use 'node ${__filename} --target TARGET_NAME'`
  throw new Error(msg)
}

if (!fs.existsSync(targetBaseDir)) {
  const msg = `target base dir ${targetBaseDir} not exists`
  throw new Error(msg)
}
log.info(`target dir: ${targetBaseDir}`)

function init() {
  log.info('init', 'starting...')
  const isDebug = argv.debug || argv.d
  if (isDebug) {
    log.level = 'verbose'
  } else {
    log.level = 'info'
  }

  distDir = path.resolve(rootDir, `dist/${target}`)
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, {
      recursive: true,
      force: true,
    })
  }

  if (fs.existsSync(path.resolve(targetBaseDir, 'common'))) {
    const msg = `Avoid to use common as dir name`
    throw new TypeError(msg)
  }

  fs.mkdirSync(distDir, {
    recursive: true,
  })
  log.info(`init`, `target will be stored in ${distDir}`)
  log.info('init', 'success')
}

function build() {
  log.info('build', 'starting...')
  // build
  process.chdir(targetBaseDir)
  execa.commandSync(`yarn build`, {
    stdio: 'inherit',
  })
  log.verbose(`build`, 'success')
  process.chdir(rootDir)
  log.info('build', 'success')
}

function pack() {
  log.info('pack', 'starting...')
  const resolve = p => path.resolve(targetBaseDir, p)
  fs.writeFileSync(path.resolve(distDir, '.gitignore'), 'node_modules')

  execa.commandSync(`cp -r ${path.resolve(rootDir, 'common')} ${distDir}`, {
    stderr: 'inherit',
  })

  const files = [
    '.nuxt',
    'tailwind.config.js',
    'static',
    'config',
    'nuxt.config.js',
  ]
    .map(file => resolve(file))
    .join(' ')
  execa.commandSync(`cp -r ${files}  ${distDir}`, {
    stderr: 'inherit',
  })
  log.info('pack', 'success')
}

function mergePkgs(...pkgs) {
  log.info(`merge`, 'starting..')
  let res = merge(...pkgs).toString()
  res = JSON.parse(res)
  res = {
    name: res.name,
    version: res.version,
    private: res.private,
    dependencies: res.dependencies,
    workspaces: res.workspaces,
    scripts: {
      dev: 'nuxt',
      build: 'nuxt build',
      start: 'nuxt start',
      generate: 'nuxt generate',
    },
  }
  log.info(`merge`, 'success')
  return res
}

// function rewriteConfig() {
//   log.info(`rewrite config`, 'starting...')
//   const configFile = path.resolve(distDir, 'nuxt.config.js')
//   const config = fs.readFileSync(configFile, 'utf-8').toString()
//   const newConfig = config.replace('../../common', `./common`)
//   fs.readFileSync(configFile)
//   fs.writeFileSync(configFile, newConfig, {
//     encoding: 'utf-8',
//   })
//   log.info(`rewrite config`, 'starting...')
// }

function writeScripts() {
  fs.writeFileSync(
    path.resolve(distDir, 'app.yaml'),
    `runtime: nodejs12
service: ${service}

instance_class: F2

handlers:
  - url: /_nuxt
    static_dir: .nuxt/dist/client
    secure: always

  - url: /(.*\\.(gif|png|jpg|ico|txt))$
    static_files: static/\\1
    upload: static/.*\\.(gif|png|jpg|ico|txt)$
    secure: always

  - url: /.*
    script: auto
    secure: always

env_variables:
  HOST: '0.0.0.0'
`,
  )

  fs.writeFileSync(
    path.resolve(distDir, 'deploy.sh'),
    `git pull
yarn
gcloud  app deploy app.yaml --quiet
`,
  )
}

function main() {
  init()
  build()
  pack()
  const basePkg = require(path.resolve(rootDir, 'package.json'))
  const targetPkg = require(path.resolve(targetBaseDir, 'package.json'))
  const pkg = mergePkgs(basePkg, targetPkg)
  fs.writeFileSync(path.resolve(distDir, 'package.json'), JSON.stringify(pkg))
  // rewriteConfig()
  writeScripts()
  log.info('pre-deploy', 'done')
}

main()
