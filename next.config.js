const withCSS = require('@zeit/next-css')

module.exports = withCSS({
    distDir: 'build',
    webpack: function (config) {
      config.node = { fs: 'empty' };
      return config
    },
    publicRuntimeConfig: { // Will be available on both server and client
      staticFolder: '/static',
      mySecret: 'ljM8B&JMR' // Pass through env variable
    },
    cssModules: false,
    env: {
      env: process.env.NODE_ENV
    }
});
