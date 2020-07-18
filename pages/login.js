import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Wechat, Google, Github } from '../src/layout/icon';
import { GoogleLogin } from 'react-google-login';
import { useRouter } from 'next/router';
import { GITHUB_OAUTH } from '../src/config';
import { POST } from '../src/request';
import { parseCookies } from 'nookies'

const useStyles = makeStyles(theme => ({
    sign: {
        minHeight: '100vh',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& a": {
            textDecoration: "none",
        }
    },
    logo: {
        textAlign: "center",
        "&>a": {
            textDecoration: "none",
            fontSize: 36,
            color: 'inherit',
            fontWeight: "bold"
        }
    },
    main: {
        width: 400,
        backgroundColor: "#fff",
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,.1)",
        padding: '50px 30px',
        minHeight: 100,
    },
    icons: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        lineHeight: 1
    },
    icon: {
        width: 75,
        height: 75,
        cursor: "pointer",
    },
    title: {
        margin: "0px 0px 10px 0px",
        textAlign: "center",
        color: "#b5b5b5",
    },
}))

function Login() {
    const classes = useStyles();
    const router = useRouter();
    let githubOauth = GITHUB_OAUTH
    let redirect_uri = "/";
    React.useEffect(() => {
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            if (Boolean(douyacun)) {
                if (router.query["redirect_uri"]) {
                    redirect_uri = unescape(router.query["redirect_uri"])
                }
                window.location = redirect_uri
            }
        }
    }, []);
    const responseGoogle = async (googleUser) => {
        if (googleUser && googleUser.profileObj) {
            await POST({
                url: "/api/oauth/google", data: {
                    id: googleUser.profileObj.googleId,
                    avatar_url: googleUser.profileObj.imageUrl,
                    email: googleUser.profileObj.email,
                    name: googleUser.profileObj.name
                }
            })
            window.location = redirect_uri
        }
    }
    const errorHandlerGoogle = (error) => {
        console.log(error);
    }
    return (
        <div className={classes.sign}>
            <div className={classes.main}>
                <h2 className={classes.logo}><a href="https://www.douyacun.com/">Douyacun</a></h2>
                <h5 className={classes.title}>
                    社交账号登录
                </h5>
                <div className={classes.icons}>
                    {/* <a href=""><Wechat className={classes.icon}></Wechat></a> */}
                    <a href={githubOauth}><Github className={classes.icon}></Github></a>
                    <GoogleLogin
                        clientId="338282311853-qn72rjnqig52pp2h5oo1chu1ov7endcs.apps.googleusercontent.com"
                        render={renderProps => (
                            <Google onClick={renderProps.onClick} disabled={renderProps.disabled} className={classes.icon}></Google>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={errorHandlerGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>
        </div>
    )
}

export default Login