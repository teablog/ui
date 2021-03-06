import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Topic from '../src/layout/Topic';
import Layout from '../src/layout/Index';
import { GET } from '../src/request';
import { PAGE_SIZE, ENV } from '../src/config';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies'
import Weather from 'react-tencent-weather/lib/ssr/index.js';
import Head from 'next/head'
import AdSense from 'react-ssr-adsense';
import 'react-tencent-weather/lib/ssr/index.css';

const useStyles = makeStyles(theme => ({
    marginTop: {
        height: 64,
        [theme.breakpoints.down('sm')]: {
            height: 66,
            backgroundColor: "#EBEDEF",
        },
    },
    root: {
        maxWidth: '1282px',
        margin: 'auto',
        display: "flex",
        '@media screen and (max-width: 1736px)': {
            'dyc-app[open-and-visible="true"] &': {
                marginLeft: 290,
                marginRight: 10,
            }
        },
        [theme.breakpoints.up('md')]: {
            padding: '16px 10px'
        },
    },
    dycGridGap: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: '8px 32px',
        [theme.breakpoints.up('sm')]: {
            gridGap: '16px 32px',
        },
    },
    dycGridColmn: {
        gridColumn: 'span 12',
    },
    dycArticles: {
        [theme.breakpoints.down('sm')]: {
            backgroundColor: "#EBEDEF"
        },
    },
    main: {
        flex: 1,
        // gridColumn: 'span 8',
        width: 900,
        [theme.breakpoints.up('md')]: {
            marginRight: 32,
        },
    },
    aside: {
        width: 350,
        '@media screen and (max-width: 800px)': {
            '&': {
                display: 'none'
            }
        },
    },
    dycAsideColumn: {
        borderRadius: '8px',
        background: '#f8f9fa',
    },
    dycAsideColumnTopic: {
        color: '#5f6368',
        padding: '12.8px 0',
        borderBottom: '1px solid #dadce0',
        display: 'flex',
        flexDirection: 'row'
    },
    dycAsideTag: {
        margin: '16px 0'
    },
    dycAsideTagButton: {
        margin: '0 8px 8px 0',
        color: '#5f6368',
        borderRadius: '8px',
        background: '#fff',
        padding: '8px 6px',
        '&:hover': {
            background: '#fff',
            color: '#3c4043',
            borderColor: '#b2b3b5',
        },
        '& a': {
            color: "inherit"
        }
    },
    // 栏目
    dycColumn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "stretch",
        marginTop: '2.4rem',
        border: 0,
        position: 'relative',
        '@media screen and (max-width: 800px)': {
            marginTop: '0.6rem'
        }
    },
    dycColumnMore: {
        display: 'flex',
        flex: '1 1 auto',
        textAlign: 'end',
        flexDirection: 'column'
    },
    dycSubtitle: {
        fontSize: '1rem',
        '@media screen and (max-width: 1023px)': {
            fontSize: '0.8rem'
        }
    },
    // 分页
    dycPagenation: {
        textAlign: "center",
        justifyContent: "center"
    },
    // 备案号
    dycIPC: {
        display: "flex",
        alignItems: "center",
    },
    dycFooter: {
        padding: '16px 16px',
        lineHeight: 3,
        fontSize: 13,
        color: '#8590a6'
    }
}));

function Index({ total, articles, labels, page, outside}) {
    const classes = useStyles();
    const [location, setLocation] = useState(undefined)
    const [snackbarState, setSnackbarState] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    const router = useRouter();
    useEffect(() => {
        if (!/(iPhone|Android|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            getLocation()
        }
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            if (Boolean(douyacun)) {
                if (router.query["redirect_uri"]) {
                    let redirect_uri = unescape(router.query["redirect_uri"])
                    window.location = redirect_uri
                }
            }
        }
    }, [])
    useEffect(() => {
        if (errMessage != "") {
            setSnackbarState(true)
        }
    }, [errMessage])
    /**
     * @param {string} latitude 
     * @param {string} longitude 
     */
    const getLocation = (latitude = "", longitude = "") => {
        GET({
            "url": `/api/tools/location?latitude=${latitude}&longitude=${longitude}`,
            "headers": {
                "token": "UgDS8nRousuEQ9LHXHQ2JaBCSbIn0iqE"
            }
        }).then(({ data }) => {
            // console.log(data)
            setLocation(data)
        })
    }
    const closeSnackbar = () => {
        setSnackbarState(false)
    }
    return (
        <Layout leftDrawerDefaultDisplay={true} marginTop={false}>
            <Head>
                <title data-react-helmet="true">Douyacun</title>
                <meta data-react-helmet="true" httpEquiv="cleartype" content="on" />
                <meta data-react-helmet="true" name="apple-mobile-web-app-capable" content="yes" />
                <meta data-react-helmet="true" name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes" />
                <meta data-react-helmet="true" name="description" content="不要质疑你付出，这些都会一种累积一种沉淀，它们会默默铺路，只为让你成为更优秀的人" />
                <meta property="og:description" content="不要质疑你的付出，这些都会一种累积一种沉淀，它们会默默铺路，只为让你成为更优秀的人" />
                <meta property="og:title" content="Douyacun" />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
                <meta name="og:image" content="https://cdn.douyacun.com/images/blog/1/assert/douyacun_qrcode.jpg" />
                <meta property="og:site_name" content={process.env.NEXT_PUBLIC_HOSTNAME} />
            </Head>
            <div className={classes.marginTop}></div>
            <div className={classes.root}>
                <main className={classes.main}>
                    <div className={classes.dycGridGap + ' ' + classes.dycArticles}>
                        {/* <Column title="Headlines" subtitle="Recommended based on your interests" more="More For you" /> */}
                        {
                            articles.map((item, key) => (
                                <Topic
                                    key={key}
                                    article={item}
                                />
                            ))
                        }
                        <div className={classes.dycGridColmn}>
                            <div className={classes.dycPagenation}>
                                {
                                    parseInt(page) > 1 ?
                                        (
                                            <Button variant="outlined" href={`/?page=` + (parseInt(page) - 1)} style={{ marginRight: 30, backgroundColor: "#fff", marginBottom: 30 }}>
                                                上一页
                                            </Button>
                                        ) : ''
                                }
                                {
                                    parseInt(page) < Math.ceil(total / PAGE_SIZE) ?
                                        (<Button variant="outlined" href={`/?page=` + (parseInt(page) + 1)} style={{ backgroundColor: "#fff", marginBottom: 30 }}>
                                            下一页
                                        </Button>) : ''
                                }
                            </div>
                        </div>
                    </div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={snackbarState}
                        autoHideDuration={6000}
                        onClose={closeSnackbar}
                        message={errMessage}
                        action={
                            <React.Fragment>
                                <Button color="secondary" size="small" onClick={closeSnackbar}>知道了</Button>
                                <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                </main>
                <aside className={classes.aside}>
                    {/* 天气组件 */}
                    {
                        location && location.hasOwnProperty("city") && location.hasOwnProperty("province") && typeof document !== "undefined" ?
                            (<div className={classes.dycGridColmn}> <Weather province={location["province"]["name"]} city={location["city"]["name"]} showDays={false} showLiving={false} /> </div>) :
                            ""
                    }
                    <AdSense
                        style={{ display: 'block' }}
                        format='auto'
                        layoutKey='-g4+g+8-eu+rh'
                        client='ca-pub-2963446487596884'
                        slot='6753687404'
                        responsive='true'
                    />
                    <div>
                        <div className={classes.dycAsideColumnTopic}>
                            <Typography variant="h4">关键字</Typography>
                        </div>
                        <div className={classes.dycAsideTag}>
                            {
                                labels.map((item, key) => (
                                    <Button variant="outlined" className={classes.dycAsideTagButton} key={key}>
                                        <a href={`/article/${item.id}`}><Typography variant="h6">{item.label}</Typography></a>
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                    <div>
                        <div className={classes.dycAsideColumnTopic}>
                            <Typography variant="h4">友情链接</Typography>
                        </div>
                        <div className={classes.dycAsideTag}>
                            {
                                outside.map((item, key) => (
                                    <Button variant="outlined" className={classes.dycAsideTagButton} key={key}>
                                        <a href={item.url} target="_blank"><Typography variant="h6">{item.title}</Typography></a>
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                    <div >
                        <div className={classes.dycFooter}>
                            <div className={classes.dycIPC}>
                                <img src="/images/icp.png" style={{ width: 20, height: 20, marginRight: 8 }} />
                                <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" rel="nofollow" target="_blank" style={{ color: "#8590a6" }}>鲁ICP备20003688号-1</a>
                            </div>
                            <div>联系我: douyacun@gmail.com</div>
                        </div>
                    </div>
                </aside>
            </div>
        </Layout>
    );
}

Index.getInitialProps = async ({ req, query, res }) => {
    let { page, redirect_uri } = query;
    page = page > 0 ? page : 1;
    const { data, total } = await GET({
        url: `/api/articles?page=${page}`,
        headers: {
            "User-Agent": req.headers["user-agent"]
        }
    }).then(resp => resp.data)

    const outside = await GET({
        url: "/api/outside"
    }).then(({data, code}) => {
        if (code === 0) {
            return data.list
        }
        return []
    })
    const labels = await GET({ url: "/api/articles/labels" }).then(resp => resp.data);
    return { total, articles: data, labels, page: page, outside}
}

export default Index;

