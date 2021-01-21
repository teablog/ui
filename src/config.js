const GITHUB_LOGO = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
const DEFAULT_AVATAR = "/images/avatar/noavatar88.png"
const PAGE_SIZE = 10;

const ENV = {
  host: process.env.NEXT_PUBLIC_HOST,
  protocol: process.env.NEXT_PUBLIC_PROTOCOL,
  github_oauth: `https://github.com/login/oauth/authorize?client_id=25fc4f51f48cb5d52edf&scope=user:email&redirect_uri=`,
}

export {
  GITHUB_LOGO,
  DEFAULT_AVATAR,
  PAGE_SIZE,
  ENV
}