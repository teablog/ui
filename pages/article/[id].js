import React from 'react';
import Error from "../_error"
import { makeStyles } from '@material-ui/core/styles'
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import toc from "markdown-it-toc-done-right";
import anchor from 'markdown-it-anchor';
import lists from 'markdown-it-task-lists';
import table from 'markdown-it-multimd-table';
import mdSmartArrows from 'markdown-it-smartarrows';
import Head from 'next/head'
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Layout from '../../src/layout/Index';
import { GET } from '../../src/request';
import Discuss from '../../src/components/discuss';
import { parseCookies } from 'nookies'
import Gitment from '../../src/components/gitment';
import { ENV } from '../../src/config';
import '../../src/css/github-markdown.css';
import '../../node_modules/highlight.js/styles/github.css';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100vh",
        display: "inline-flex",
        position: "fixed",
    },
    left: {
        marginTop: "64px",
        overflowY: "scroll",
        padding: 10,
        "&::-webkit-scrollbar": {
            width: 4
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(105, 112, 125, 0.5)"
        }
    },
    content: {
        maxWidth: 980,
        padding: '20px 10px 30px 0px',
        position: 'relative',
        backgroundColor: "#fff",
        margin: "0 auto",
    },
    conAppResizer: {
        userSelect: "none",
        display: "flex",
        backgroundColor: "#fafbfd",
        width: 14,
        cursor: "ew-resize",
        flex: "0 0 14px",
        alignItems: "center",
        justifyContent: "center",
        border: "0.5px solid rgba(0, 0, 0, 0.07)",
    },
    right: {
        width: "100%",
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
        right: 0,
        top: 20,
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
const DiscussLeftWidth = "article_discuss_left_width"
const DiscussRightWidth = "article_discuss_right_right"
const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }
        return ''; // use external default escaping
    },
    html: true,
    linkify: true,
});
md.use(anchor)
md.use(toc)
md.use(lists)
md.use(table)
md.use(mdSmartArrows)

function Article({ article = {}, statusCode, errMessage, articleId, isSmallDevice, messages, messagesTotal, ws_address }) {
    const [user, setUser] = React.useState({})
    const [canMove, setCanMove] = React.useState(false) // 聊天框：是否移动
    const [leftWidth, setLeftWidth] = React.useState(70);   // 窗口：文章宽度
    const [rightWidth, setRightWidth] = React.useState(29); // 窗口：聊天框宽度Î
    const [screenWidth, setScreenWidth] = React.useState(100); // 聊天框：当前窗口宽度，计算左右比例
    const [lockResize, setLockResize] = React.useState(false); // 聊天框：加载锁，不要设置太快了
    const [userSelect, setUserSelect] = React.useState("text"); // 聊天框：移动时，文章内容不要选中
    const leftRef = React.useRef(null);
    // 首次加载
    React.useEffect(() => {
        const all = parseCookies();
        if (all.douyacun) {
            setUser(JSON.parse(all.douyacun));
        }
        // 加载聊天框宽度
        if (isSmallDevice) {
            setLeftWidth(100)
        } else {
            let lw = localStorage.getItem(DiscussLeftWidth);
            if (lw > 0) {
                setLeftWidth(lw);
            }
            let rw = localStorage.getItem(DiscussRightWidth);
            if (rw > 0) {
                setRightWidth(rw);
            }
        }
        setScreenWidth(document.body.clientWidth);
        return () => {
        }
    }, [])
    React.useEffect(() => {
        // document：鼠标抬起时结束移动
        document.addEventListener("mouseup", mouseUpHandler);
        return () => {
            document.removeEventListener("mouseup", mouseUpHandler);
        }
    }, [leftWidth, rightWidth])
    // 聊天框：开启移动
    const mousedownHandler = (e) => {
        setCanMove(true)
        setUserSelect("none");
    }
    // 聊天框：结束移动
    const mouseUpHandler = () => {
        setCanMove(false)
        setUserSelect("text");
        // 持久化聊天宽度
        localStorage.setItem(DiscussLeftWidth, leftWidth);
        localStorage.setItem(DiscussRightWidth, rightWidth);
    }
    const mouseMoveHandler = (e) => {
        if (canMove) {
            let lw = (e.clientX / screenWidth * 100).toFixed(3)
            let rw = (100 - lw - 1).toFixed(3);
            if (!lockResize && lw > 50 && (screenWidth - e.clientX) > 300) {
                setLeftWidth(lw)
                setRightWidth(rw)
                setLockResize(true)
                setTimeout(() => { setLockResize(false) }, 10)
            }
        }
    }
    const classes = useStyles();
    if (statusCode != 0) {
        return <Error statusCode={statusCode} message={errMessage}/>
    }
    return (<Layout marginTop={false} >
        <Head>
            <title data-react-helmet="true">{article.title} (douyacun)</title> 
            <meta data-react-helmet="true" http-equiv="cleartype" content="on" />
            <meta data-react-helmet="true" name="apple-mobile-web-app-capable" content="yes" />
            <meta data-react-helmet="true" name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes" />
            <meta data-react-helmet="true" name="description" content={article.description} />
            <meta data-react-helmet="true" property="og:description" content={article.description}  />
            <meta data-react-helmet="true" property="og:title" content={article.title}/>
            <meta data-react-helmet="true" property="og:url" content={"https://www.douyacun.com/article/" + articleId} />
            <meta data-react-helmet="true" property="og:site_name" content="douyacun" />
            <meta data-react-helmet="true" name="keywords" content={article.keywords}/>
            <meta data-react-helmet="true" name="twitter:card" content="summary" />
            <meta data-react-helmet="true" name="twitter:url" content={"https://www.douyacun.com/article/" + articleId} />
            <meta data-react-helmet="true" name="twitter:title" content={article.title}/>
            <meta data-react-helmet="true" name="twitter:description" content={article.description}/> 
        </Head>
        <div className={classes.root} onMouseMove={mouseMoveHandler}>
            <div className={classes.left} style={{ width: leftWidth + "%", userSelect: userSelect }} ref={leftRef}>
                <div className={classes.content}>
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
                                <Gitment
                                    articleId={articleId}
                                    messages={messages}
                                    messagesTotal={messagesTotal}
                                    user={user}
                                    isSmallDevice={isSmallDevice}
                                />
                            </div>
                        ) : ""
                    }
                    <div className={classes.qr_code}>
                        <img src={article.wechat_subscription_qrcode} />
                        <Typography variant="inherit">
                            微信扫一扫<br />
                        关注该公众号
                    </Typography>
                    </div>
                </div>
            </div>
            {
                !isSmallDevice ?
                    (
                        <React.Fragment>
                            <div
                                className={classes.conAppResizer}
                                onMouseDown={mousedownHandler}
                            >︙</div>
                            <div className={classes.right} style={{ width: rightWidth + "%" }}>
                                <Discuss
                                    ws_address={ws_address}
                                    articleId={articleId}
                                    styles={{ paddingTop: 64 }}
                                    messages={messages}
                                    messagesTotal={messagesTotal}
                                />
                            </div>
                        </React.Fragment>
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
    let sort = "desc"
    if (/(iPhone|Android|iPad|iPod|iOS)/i.test(req.headers["user-agent"])) {
        isSmallDevice = true
        sort = "asc"
    }
    // let isSmallDevice = true;
    // let sort = "asc"
    // 文章详情
    const { article, statusCode, errMessage } = await GET({
        "url": `/api/article/${id}`,
    }).then(resp => {
        return {article: resp.data, statusCode: resp.code, errMessage: resp.message}
    })
    // 评论列表
    const { messages, messagesTotal } = await GET({
        url: "/api/ws/article/messages",
        params: {
            article_id: id,
            sort: sort
        },
        headers: {
            Cookie: req.headers.cookie
        }
    }).then(({ data: { list, total } }) => {
        return { messages: list, messagesTotal: total }
    })
    // websocket 地址
    let ws_address;
    if (ENV.protocol == "https") {
        ws_address = "wss://" + ENV.host + "/api/ws/join?article_id=" + id
    } else {
        ws_address = "ws://" + ENV.host + "/api/ws/join?article_id=" + id
    }
    return { article: article, statusCode: statusCode, errMessage: errMessage, articleId: id, isSmallDevice, messages, messagesTotal, ws_address: ws_address }
}

export default Article;