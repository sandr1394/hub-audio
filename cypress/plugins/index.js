/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { startDevServer } = require('@cypress/webpack-dev-server')
const { addCypressToWebpackEslintRulesInPlace } = require('@cypress/react/plugins/utils/eslint-helpers')
const { getTranspileFolders } = require('@cypress/react/plugins/utils/get-transpile-folders')
const { addFolderToBabelLoaderTranspileInPlace } = require('@cypress/react/plugins/utils/babel-helpers')
const { allowModuleSourceInPlace } = require('@cypress/react/plugins/utils/webpack-helpers')
const { rmdir } = require('fs')


function devServer (cypressDevServerConfig) {
  process.env.FAST_REFRESH = 'false'
  // Do this as the first thing so that any code reading it knows the right env.
  const envName = 'test'

  // @ts-expect-error override env is possible
  process.env.NODE_ENV = envName
  process.env.BABEL_ENV = envName

  let webpackConfig = require('../../config/webpack.config.js');
  webpackConfig = webpackConfig('development');

  addCypressToWebpackEslintRulesInPlace(webpackConfig)

  getTranspileFolders(cypressDevServerConfig.config).forEach((cypressFolder) => {
    allowModuleSourceInPlace(cypressFolder, webpackConfig)
    addFolderToBabelLoaderTranspileInPlace(cypressFolder, webpackConfig)
  })
  return startDevServer({
    options: cypressDevServerConfig,
    webpackConfig,
  })
}

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    deleteFolder (folderName) {
      console.log('deleting folder %s', folderName)

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error(err)

            return reject(err)
          }

          resolve(null)
        })
      })
    },
  })
  if (config.testingType === 'component') {
    on('dev-server:start', (cypressDevServerConfig) => {
      return devServer(cypressDevServerConfig)
    })
  }

  return config
};
