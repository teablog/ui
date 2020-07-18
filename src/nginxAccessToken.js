const { createHash } = require('crypto');

const generateNginxAccessToken = (options = {}) => {
  const {
    secret,
    path,
    expires
  } = options;

  if (!secret) {
    throw new Error('No secret key was provided. This is required to generate/validate access tokens.');
  }

  if (!path) {
    throw new Error('No resource path was provided. This is required to generate access tokens.');
  }

  // Expression based on ngx_http_secure_link_module
  const data = `${secret}${path}${expires}`;

  // Match secure_link_md5 directive
  const hash = createHash('md5').update(data).digest();

  return Buffer.from(hash)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
};


module.exports = generateNginxAccessToken;