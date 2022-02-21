const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const workspaceJson = require('../../workspace.json');

const remoteApps = ['platform'];

function buildRemotes() {
  const isCiProcess = process.env.CI;

  return remoteApps.reduce(
    (result, remoteName) => {
      const remoteAppPort = workspaceJson.projects[remoteName].targets.serve.options.port;
      const remotePath = isCiProcess ? `/apps/${remoteName}` : `http://localhost:${remoteAppPort}`;
      return ({...result, [remoteName]: `${remoteName}@${remotePath}/remoteEntry.js`  })
  }, {});
} 

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
  'core/*',
  'modules/*'
]);

module.exports = {
  output: {
    uniqueName: 'shell',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
    minimize: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: buildRemotes(),
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/common/http': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true },
        ...sharedMappings.getDescriptors(),
      },
    }),
    sharedMappings.getPlugin(),
  ],
};
