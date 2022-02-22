const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const workspaceJson = require('../../workspace.json');

const remoteApps = [];

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
  'core',
  'modules'
]);

module.exports = {
  output: {
    uniqueName: 'platform',
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
      name: 'platform',
      filename: 'remoteEntry.js',
      remotes: buildRemotes(),
      exposes: {
        './Module': 'apps/platform/src/app/platform-entry/platform-entry.module.ts',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true, requiredVersion: '12.2.16' },
        '@angular/common': { singleton: true, strictVersion: true, requiredVersion: '12.2.16' },
        '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: '12.2.16' },
        '@angular/router': { singleton: true, strictVersion: true, requiredVersion: '12.2.16' },
        ...sharedMappings.getDescriptors(),
      },
    }),
    sharedMappings.getPlugin(),
  ],
};
