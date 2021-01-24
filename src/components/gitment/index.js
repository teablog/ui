import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Pagination from '@material-ui/lab/Pagination';
import MarkdownTextarea from './markdown_textarea'
import { GET, POST } from '../../request';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import Settled from '../settled';
import "../../css/github-markdown.css";
import { parseCookies } from 'nookies'
import Avatar from '@material-ui/core/Avatar';
import Prompt from '../prompt';
import ReplyIcon from '@material-ui/icons/Reply';

const markdown = new MarkdownIt();
const TEXTMSG = "TEXT"

const userStyle = makeStyles(theme => ({
    root: {
        marginTop: 10,
    },
    discussion_timeline: {
        marginTop: "10px",
        borderTop: "1px solid #e6ebf1",
        position: "relative",
        "&::before": {
            content: '""',
            backgroundColor: "#e6ebf1",
            bottom: 0,
            display: "block",
            left: 79,
            position: "absolute",
            top: 0,
            width: 2,
            zIndex: -1
        },
        "& a": {
            textDecoration: "none",
        },
        "& a:hover": {
            textDecoration: "underline"
        }
    },
    timeline_comment_wrapper: {
        borderBottom: "2px solid #fff",
        borderTop: "2px solid #fff",
        marginBottom: 15,
        marginTop: 15,
        paddingLeft: 60,
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
        },
    },
    timeline_comment_avatar: {
        borderRadius: 3,
        float: "left",
        marginLeft: -60,
        position: "relative",

    },
    timeline_comment: {
        backgroundColor: '#fff',
        border: "1px solid #d1d5da",
        borderRadius: 3,
        position: "relative",
        '&:before': {
            position: 'absolute',
            top: 11,
            right: "100%",
            bottom: 0,
            left: -16,
            zIndex: 2,
            content: '" "',
            width: 0,
            height: 0,
            display: 'block',
            pointerEvents: 'none',
            borderColor: 'transparent',
            borderStyle: 'solid solid outset',
            transition: 'border-color .25s ease-in-out',
            borderWidth: 8,
            borderRightColor: "rgb(209, 213, 218)",
        },
        '&:after': {
            position: 'absolute',
            top: 11,
            right: "100%",
            bottom: 0,
            left: -16,
            zIndex: 2,
            content: '" "',
            width: 0,
            height: 0,
            display: 'block',
            pointerEvents: 'none',
            borderColor: 'transparent',
            borderStyle: 'solid solid outset',
            borderWidth: 7,
            marginTop: 1,
            marginLeft: 2,
            borderRightColor: "rgb(246, 248, 250)",
        },
    },
    timeline_comment_current_user: {
        '&:before': {
            borderRightColor: "rgb(212, 226, 248)",
        },
        '&:after': {
            borderRightColor: "rgb(241, 248, 255)",
        },
    },
    timeline_comment_header: {
        display: "flex",
        alignItems: "center",
        backgroundColor: '#f6f8fa',
        borderBottom: "1px solid rgba(3, 102, 214, 0.2)",
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        color: "#586069",
        paddingLeft: 15,
        paddingRight: 15,
    },
    timeline_comment_header_current_user: {
        borderBottomColor: '#c0d3eb',
        backgroundColor: '#f1f8ff'
    },
    timeline_comment_header_text: {
        // maxWidth: "78%",
        paddingBottom: 10,
        paddingTop: 10,
        flex: 1,
    },
    author: {
        maxWidth: 125,
        overflow: "hidden",
        textOverflow: "ellipsis",
        verticalAlign: "top",
        whiteSpace: "nowrap",
        display: "inline-block",
        color: "#586069",
        fontWeight: 600,
    },
    comment_body: {
        fontSize: 14,
        overflow: 'visible',
        padding: 15,
        width: '100%'
    },
    comment_login: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    discussion_timeline_actions: {
        backgroundColor: "#fff"
    },
    discussion_timeline_pagenation: {
        display: "flex",
        marginTop: "10px",
        justifyContent: "center"
    },
    timeline_new_comment: {
        marginBottom: 0,
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 10,
            paddingLeft: 0,
        },
    },
    timeline_comment_group: {
        backgroundColor: '#fff',
        border: "1px solid #d1d5da",
        borderRadius: 3,
        position: "relative",
        "&::before": {
            borderColor: "transparent",
            borderStyle: "solid solid outset",
            content: '"',
            display: "block",
            height: 0,
            left: -16,
            pointerEvents: "none",
            position: "absolute",
            right: "100%",
            top: 11,
            width: 0
        },
        "&::after": {
            borderRightColor: "#f6f8fa",
            borderWidth: 7,
            marginLeft: 2,
            marginTop: 1
        }
    },
    tabnav_tabs: {
        marginBottom: -1,
    },
    avatar: {
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "1px solid #d1d5da",
        width: 44,
        height: 44,
        color: "#666",
        fontWeight: 500,
        [theme.breakpoints.down('sm')]: {
            display: "none"
        },
    },
    senderUrl: {
        "&:hover": {
            textDecoration: "none !important"
        }
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: "#666"
    },
    commentIcon: {
        cursor: "pointer"
    }
}))

function Gitment({ articleId = "", msgData: { list, total: t, page: p, size: s } }) {
    const [commentValue, setCommentValue] = React.useState("")
    const [comments, setComments] = React.useState(list)
    const [user, setUser] = React.useState({})
    const [total, setTotal] = React.useState(t)
    const [open, setOpen] = React.useState(false);
    const [size, setSize] = React.useState(s)
    const [page, setPage] = React.useState(p);
    const [prompt, setPrompt] = React.useState({
        open: false,
        content: "",
    });
    const isLogin = (u) => {
        return u && u.id !== ""
    }
    const classes = userStyle()
    // 首次加载
    React.useEffect(() => {
        const all = parseCookies();
        if (all.douyacun) {
            setUser(JSON.parse(all.douyacun));
        }
        return () => {
        }
    }, [])
    /**
     * 分页：
     */
    const changePage = (event, value) => {
        LoadMessage(value)
    };
    /**
     * 消息：加载
     */
    const LoadMessage = (p) => {
        if (p == page) {
            return
        }
        return GET({
            url: "/api/article/messages",
            params: {
                article_id: articleId,
                page: p
            }
        }).then(({ data: { list, total } }) => {
            setComments(list)
            setTotal(total)
            setPage(page)
        })
    }
    /**
     * 消息：发布 todo
     */
    const onComment = async () => {
        if (!isLogin(user)) {
            return;
        }
        await POST({
            url: "/api/article/comment",
            data: {
                content: commentValue,
                article_id: articleId,
                type: TEXTMSG,
            }
        }).then(({ code, data, message }) => {
            if (code == 401) {
                setOpen(true);
            }
            if (code == 503) {
                setPrompt({open: true, content: message})
            }
            if (code === 0) {
                setComments([...comments, data])
            }
        })
    }
    /**
     * 消息回复：replay
     */
    const replay = (name) => {
        let v
        if (commentValue != "") {
            v = commentValue + " @" +  name + " "
        } else {
            v = "@" + name + " "
        }
        
        setCommentValue(v);
    }
    return (
        <div className={classes.root}>
            <Typography variant="subtitle2">{total} 条评论 </Typography>
            <div className={classes.discussion_timeline}>
                {
                    comments && comments.length > 0 ? comments.map((item, key) => {
                        let isMe = user.id == item.sender.id ? true : false;
                        return (<div className={classes.timeline_comment_wrapper} key={key}>
                            <div className={classes.timeline_comment_avatar}>
                                {
                                    item.sender.url ?
                                        <a href={item.sender.url} className={classes.senderUrl} target="_blank">
                                            <Avatar className={classes.avatar}>{item.sender && item.sender.name.length > 0 ? item.sender.name[0] : "D"}</Avatar>
                                        </a> :
                                        <Avatar className={classes.avatar}>{item.sender && item.sender.name.length > 0 ? item.sender.name[0] : "D"}</Avatar>
                                }
                            </div>
                            <div className={classes.timeline_comment + " " + (isMe ? classes.timeline_comment_current_user : "")}>
                                <div className={classes.timeline_comment_header + " " + (isMe ? classes.timeline_comment_header_current_user : '')}>
                                    <Typography variant="h5" className={classes.timeline_comment_header_text}>
                                        <strong>
                                            {
                                                item.sender.url ?
                                                    <a href={item.sender.url} className={classes.author} target="_blank" rel="nofollow">{item.sender.name}</a> :
                                                    item.sender.name
                                            }
                                        </strong> commented <relative-time datetime=""> {moment(item.date).calendar()}</relative-time>
                                    </Typography>
                                    <ReplyIcon className={classes.commentIcon} onClick={() => replay(item.sender.name)} />
                                </div>
                                <div className={classes.comment_body}>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: markdown.render(item.content) }}
                                        className="markdown-body"
                                    />
                                </div>
                            </div>
                        </div>)
                    }) : ""
                }
            </div>
            <div className={classes.discussion_timeline_actions}>
                <div className={classes.discussion_timeline_pagenation}>
                    <Pagination count={Math.ceil(total / size) > 0 ? Math.ceil(total / size) : 1} page={page} onChange={changePage} />
                </div>
                <div className={classes.timeline_comment_wrapper + " " + classes.timeline_new_comment}>
                    <span className={classes.timeline_comment_avatar}>
                        {
                            user.url ?
                                <a href={user.url} target="_blank">
                                    <Avatar className={classes.avatar}>{user && user.name ? user.name[0] : "D"}</Avatar>
                                </a> :
                                <Avatar className={classes.avatar}>{user && user.name ? user.name[0] : "D"}</Avatar>
                        }
                    </span>
                    <div className={classes.timeline_comment_group}>
                        {
                            isLogin(user) ? '' : (<div onClick={() => setOpen(true)} target="_blank" rel="nofollow" className={classes.comment_login} />)
                        }
                        <div>
                            <MarkdownTextarea
                                render={value => markdown.render(value)}
                                onChange={setCommentValue}
                                onComment={onComment}
                                isLogin={isLogin(user)}
                                toolbarAlwaysVisible={true}
                                value={commentValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Settled open={open} close={setOpen} setUser={(u) => setUser(u)} />
            <Prompt open={prompt.open} close={() => { setPrompt({open: false, content: ""}) }} content={prompt.content}/>
        </div >
    )
}

export default Gitment