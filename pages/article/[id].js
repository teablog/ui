import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import toc from "markdown-it-toc-done-right";
import anchor from 'markdown-it-anchor';
import lists from 'markdown-it-task-lists';
import table from 'markdown-it-multimd-table';
import Head from 'next/head'
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Layout from '../../src/layout/Index';
import { GET } from '../../src/request';
import Discuss from '../../src/components/discuss';
import Drawer from '@material-ui/core/Drawer';
import { parseCookies } from 'nookies'
import Gitment from '../../src/components/gitment';
import '../../src/css/github-markdown.css';
import '../../node_modules/highlight.js/styles/github.css';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100vh",
        display: "inline-flex",
        overflow: "auto",
    },
    left: {
        maxWidth: 980,
        minWidth: 200,
        padding: '0 10px 30px 0px',
        position: 'relative',
        backgroundColor: "#fff",
        marginTop: "84px",
        '@media screen and (max-width: 1736px)': {
            'dyc-app[open-and-visible="true"] &': {
                marginLeft: '300px'
            }
        },
        '@media screen and (min-width: 460px)': {
            '&': {
                paddingBottom: 0,
            }
        },
        '@media screen and (min-width: 1280px)': {
            '&': {
                marginLeft: "20px",
                maxWidth: 700,
            }
        },
        '@media screen and (min-width: 1460px)': {
            '&': {
                // marginLeft: "320px",
                maxWidth: 980,
            }
        },
        '@media screen and (min-width: 1700px)': {
            '&': {
                // margin: "auto",
                marginLeft: "320px",
                maxWidth: 980,
            }
        },
    },
    drawerPaper: {
        // width: 800,
        overflow: "overlay",
        minWidth: 480,
        [theme.breakpoints.up('sm')]: {
            width: 480,
        },
        backgroundColor: 'rgb(250,250,250)',
        borderRight: 'None',
        zIndex: 200,
        overflow: "hidden",
    },
    bottom: {
        height: '3rem',
        textAlign: 'center',
        padding: '1rem 0'
    },
    title: {
        fontSize: 22,
        lineHeight: 1.4,
        marginBottom: 14
    },
    meta_content: {
        marginBottom: 22,
        wordWrap: "breakWord",
        wordBreak: "breakAll",
    },
    media_meta: {
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0 10px 10px 0',
        fontSize: 15,
        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,0.3)'
    },
    qr_code: {
        position: 'absolute',
        left: -180,
        top: 0,
        width: 140,
        padding: 16,
        border: '1px solid #d9dadc',
        backgroundColor: '#fff',
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        fontSize: 14,
        textAlign: 'center',
        color: '#717375',
        '& img': {
            width: 102,
            height: 102,
            position: 'relative'
        },
        display: "none",
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    }
}))

moment.locale('zh-cn');
function Article({ article = {}, articleId, isSmallDevice, messages, messagesTotal }) {
    const [user, setUser] = React.useState({})
    React.useEffect(() => {
        const all = parseCookies();
        if (all.douyacun) {
            setUser(JSON.parse(all.douyacun));
        }
        return () => { }
    }, [])
    const classes = useStyles();
    const md = new MarkdownIt({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) { }
            }
            return ''; // use external default escaping
        },
    });
    md.use(anchor)
    md.use(toc)
    md.use(lists)
    md.use(table)
    return (<Layout marginTop={false} >
        <Head>
            <title>{article.title} (douyacun)</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="Keywords" content={article.keywords} />
            <meta name="description" content={article.description} />
        </Head>
        <div className={classes.root}>
            <div className={classes.left}>
                <Typography variant="h2" className={classes.title}>{article.title}</Typography>
                <div className={classes.meta_content}>
                    <Typography component="span" className={classes.media_meta}>原创:</Typography>
                    <Typography component="span" className={classes.media_meta}>{article.author}</Typography>
                    <Typography component="span" className={classes.media_meta}>{moment(article.date).calendar()}发布</Typography>
                </div>
                <article className="markdown-body" >
                    <div dangerouslySetInnerHTML={{ __html: md.render(article.content) }}></div>
                </article>
                {
                    isSmallDevice ? (
                        <div>
                            <Gitment articleId={articleId} messages={messages} messagesTotal={messagesTotal} user={user} />
                        </div>
                    ) : ""
                }

                {/* <div className={classes.qr_code}>
                    <img src={article.wechat_subscription_qrcode} />
                    <Typography variant="inherit">
                        微信扫一扫<br />
                        关注该公众号
                    </Typography>
                </div> */}
            </div>
            {
                !isSmallDevice ? (
                    <Drawer
                        open={true}
                        // onClose={toggleDrawer()}
                        // variant={props.isWide ? "persistent" : "temporary"}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor="right"
                        variant="persistent"
                        transitionDuration={200}
                    >
                        <div>
                            <Discuss articleId={articleId} styles={{ paddingTop: 64 }} />
                        </div>
                    </Drawer>
                ) : ""
            }

        </div>
    </Layout >
    );
}

Article.getInitialProps = async ({ req, query }) => {
    const { id } = query
    // 是否位小设备
    let isSmallDevice = false;
    if (/(iPhone|Android|iPad|iPod|iOS)/i.test(req.headers["user-agent"])) {
        isSmallDevice = true
    }
    // 文章详情
    const { data } = await GET({
        "url": `/api/article/${id}`,
    }).then(resp => {
        if (resp.code === 0) {
            return resp.data
        } else {
            return {}
        }
    })
    // 评论列表
    const { messages, messagesTotal } = await GET({
        url: "/api/ws/article/messages",
        params: {
            article_id: id,
            sort: "asc"
        },
        headers: {
            Cookie: req.headers.cookie
        }
    }).then(({ data: { list, total } }) => {
        return { messages: list, messagesTotal: total }
    })
    return { article: data, articleId: id, isSmallDevice, messages, messagesTotal }
}

export default Article;