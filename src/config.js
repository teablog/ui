const URL="http://www.douyacun.com"
const GITHUB_OAUTH=process.env.GITHUB_OAUTH
const GITHUB_LOGO="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
const DEFAULT_AVATAR="https://image.00h.tv/noavatar92.png"
const PAGE_SIZE = 10;

const BACKEND_URL = {
    "oauth_github": "/api/oauth/github",
    "discussion": "/api/discussion"
}


const env = process.env.NODE_ENV || 'development';

const WS_ADDRESS = {
  development: "ws://douyacun.io/api/ws/join",
  production: "wss://www.douyacun.com/api/ws/join",
}[env];

const HOST = {
  development: process.env.HOST_DEBUG,
  production: process.env.HOST,
}[env];

export {
    URL, 
    GITHUB_OAUTH,
    GITHUB_LOGO,
    BACKEND_URL,
    DEFAULT_AVATAR,
    PAGE_SIZE,
    WS_ADDRESS,
    HOST
}