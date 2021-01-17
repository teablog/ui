import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Google, Github } from '../src/layout/icon';
import { GoogleLogin } from 'react-google-login';
import { useRouter } from 'next/router';
import { POST } from '../src/request';
import { parseCookies } from 'nookies'
import { ENV } from '../src/config';

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

function Login({ github_oauth, host}) {
    const classes = useStyles();
    const router = useRouter();
    React.useEffect(() => {
        let redirect_uri = unescape(router.query["redirect_uri"])
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            if (Boolean(douyacun)) {
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
    let redirect_uri = router.query["redirect_uri"] ? router.query["redirect_uri"] : "/"
    github_oauth = github_oauth + escape(`${host}/api/oauth/github?redirect_uri=${host}${redirect_uri}`)
    return (
        <div className={classes.sign}>
            <div className={classes.main}>
                <h2 className={classes.logo}><a href="/">Douyacun</a></h2>
                <h5 className={classes.title}>
                    社交账号登录
                </h5>
                <div className={classes.icons}>
                    {/* <a href=""><Wechat className={classes.icon}></Wechat></a> */}
                    <a href={github_oauth}><Github className={classes.icon}></Github></a>
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

Login.getInitialProps = async ({ req, query }) => {
    return {...ENV}
}

export default Login