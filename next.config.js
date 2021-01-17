const withCSS = require('@zeit/next-css')

const isProd = process.env.NODE_ENV === 'production'

module.exports = withCSS({
    distDir: 'build',
    assetPrefix: isProd ? process.env.CDN_HOST : '',
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
