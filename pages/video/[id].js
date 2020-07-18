import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import toc from "markdown-it-toc-done-right";
import anchor from 'markdown-it-anchor';
import lists from 'markdown-it-task-lists';
import table from 'markdown-it-multimd-table';
// import markdownItAttrs from 'markdown-it-attrs'
import Head from 'next/head'
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Layout from '../../src/layout/Index';
import { GET } from '../../src/request';
import Disqus from "disqus-react"
import '../../src/css/github-markdown.css';
import '../../node_modules/highlight.js/styles/github.css';
import clipboardJs from "clipboard"


const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        maxWidth: 980,
        minWidth: 200,
        padding: '16px 32px 32px 32px',
        marginTop: 32,
        position: 'relative',
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
        right: -140,
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
function Article({ article, id }) {
    article = article ? article : {};
    const disqusShortname = "douyacun" //found in your Disqus.com dashboard
    const disqusConfig = {
        url: `http://www.douyacun.com/video/${id}`, //this.props.pageUrl
        identifier: id, //this.props.uniqueId
        title: article.title //this.props.title
    }
    const classes = useStyles();
    const md = new MarkdownIt({
        html: true,
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

    useEffect(() => {
        new clipboardJs(".copy")
    })

    return (<Layout >
        <Head>
            <title>{article.title} (douyacun)</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="Keywords" content={article.keywords} />
            <meta name="description" content={article.description} />
        </Head>
        <div className={classes.root}>
            <Typography variant="h2" className={classes.title}>{article.title}</Typography>
            <div className={classes.meta_content}>
                <Typography component="span" className={classes.media_meta}>原创:</Typography>
                <Typography component="span" className={classes.media_meta}>{article.author}</Typography>
                <Typography component="span" className={classes.media_meta}>{moment(article.date).calendar()}发布</Typography>
            </div>
            <article className="markdown-body" >
                <div dangerouslySetInnerHTML={{ __html: md.render(article.content) }}></div>
            </article>
            <Disqus.DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
            {
                article.wechat_subscription_qrcode && (
                    <div className={classes.qr_code}>
                        <img src={article.wechat_subscription_qrcode} />
                        <Typography variant="inherit">
                            微信扫一扫<br />
                            关注该公众号
                    </Typography>
                    </div>
                )
            }

        </div>

    </Layout >
    );
}

Article.getInitialProps = async ({ req, query }) => {
    const { id } = query
    const { data } = await GET({
        "url": `/api/video/${id}`,
        "headers": {
            "User-Agent": req.headers["user-agent"]
        }
    }).then(resp => {
        if (resp.code === 0) {
            return resp.data
        } else {
            return {}
        }
    })

    return { article: data, id: id }
}

export default Article;