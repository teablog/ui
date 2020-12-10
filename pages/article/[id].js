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
import { ENV } from "../../src/config";
import Discuss from '../../src/components/discuss';
import '../../src/css/github-markdown.css';
import '../../node_modules/highlight.js/styles/github.css';
import { Autorenew } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100vh",
        display: "inline-flex",
        backgroundColor: "rgb(250,250,250)",
    },
    left: {
        // marginLeft: '2px',
        // '@media screen and (min-width: 1736px)': {
        //     'dyc-app[open-and-visible="true"] &': {
        //         marginLeft: '280px'
        //     }
        // },
        maxWidth: 980,
        minWidth: 200,
        padding: '32px',
        position: 'relative',
        backgroundColor: "#fff",
        marginTop: "64px"
    },
    right: {
        flex: 1,
        transform: "scale(1,1)",
        backgroundColor: "#fff",
    },
    scrollable: {
        position: "relative",
        "overflow-y": "scroll",
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
function Article({ article, id, host, disqus_short_name, protocol, disqus_enable }) {
    article = article ? article : {};
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
            <div className={classes.left + " " + classes.scrollable}>
                <Typography variant="h2" className={classes.title}>{article.title}</Typography>
                <div className={classes.meta_content}>
                    <Typography component="span" className={classes.media_meta}>原创:</Typography>
                    <Typography component="span" className={classes.media_meta}>{article.author}</Typography>
                    <Typography component="span" className={classes.media_meta}>{moment(article.date).calendar()}发布</Typography>
                </div>
                <article className="markdown-body" >
                    <div dangerouslySetInnerHTML={{ __html: md.render(article.content) }}></div>
                </article>
                {/* <div className={classes.qr_code}>
                    <img src={article.wechat_subscription_qrcode} />
                    <Typography variant="inherit">
                        微信扫一扫<br />
                        关注该公众号
                    </Typography>
                </div> */}
            </div>
            <div className={classes.right + " " + classes.scrollable}>
                <div style={{ height: '64px' }}></div>
                <Discuss />
            </div>

        </div>
    </Layout >
    );
}

Article.getInitialProps = async ({ req, query }) => {
    const { id } = query
    const { data } = await GET({
        "url": `/api/article/${id}`,
        "headers": {
            // "User-Agent": req.headers["user-agent"]
        }
    }).then(resp => {
        if (resp.code === 0) {
            return resp.data
        } else {
            return {}
        }
    })
    return { article: data, id: id, ...ENV }
}

export default Article;