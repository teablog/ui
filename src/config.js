const GITHUB_LOGO = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
const DEFAULT_AVATAR = "/images/avatar/noavatar88.png"
const PAGE_SIZE = 10;

const ENV = {
  host: process.env.HOST,
  protocol: process.env.PROTOCOL,
  github_oauth: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=user:email&redirect_uri=`,
  disqus_enable: process.env.DISQUS_ENABLE,
  disqus_short_name: process.env.DISQUS_SHORT_NAME,
}

export {
  GITHUB_LOGO,
  DEFAULT_AVATAR,
  PAGE_SIZE,
  ENV
}