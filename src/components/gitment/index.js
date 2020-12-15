import react from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import MarkdownTextarea from './markdown_textarea'
import { POST, GET } from '../../request';
import { GITHUB_LOGO, BACKEND_URL, DEFAULT_AVATAR } from '../../config';
import { useRouter } from 'next/router'
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import "../../css/github-markdown.css";

const markdown = new MarkdownIt();


const userStyle = makeStyles(theme => ({
    discussion_timeline: {
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
        position: 'relative'
    },
    timeline_comment_avatar: {
        borderRadius: 3,
        float: "left",
        marginLeft: -60,
        position: "relative"
    },
    timeline_comment: {
        backgroundColor: '#fff',
        border: "1px solid #d1d5da",
        borderRadius: 3,
        position: "relative"
    },
    timeline_comment_header: {
        backgroundColor: '#f6f8fa',
        borderBottom: "1px solid #d1d5da",
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        color: "#586069",
        paddingLeft: 15,
        paddingRight: 15,
    },
    timeline_comment_current_user: {
        borderBottomColor: '#c0d3eb',
        backgroundColor: '#f1f8ff'
    },
    timeline_comment_header_text: {
        maxWidth: "78%",
        paddingBottom: 10,
        paddingTop: 10,
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
        backgroundColor: "#fff",
        borderTop: "2px solid #e6ebf1"
    },
    timeline_new_comment: {
        marginBottom: 0,
        // maxWidth: 780,
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
}))

function Gitment({articleId, messages}) {
    // console.log(messages);
    const [user] = react.useState(() => {
        // return userInfo && userInfo.length > 0 ? JSON.parse(Base64.decode(userInfo)) : {}
        return {}
    })
    const [commentValue, setCommentValue] = react.useState("")
    const [comments, setComments] = react.useState(messages)
    const isLogin = () => {
        // return user && user.id > 0
        return true
    }
    const classes = userStyle()
    const router = useRouter()
    // const oauth = GITHUB_OAUTH + escape("https://www.00h.tv/oauth/github?redirect=" + router.asPath)
    const oauth = "" // 登录页

    /**
     * 消息：加载
     */
    const LoadMore = () => {
        let after = moment().unix()
        if (comments.length > 0) {
            after = moment(comments[0].date).unix()
        }
        return GET({
            url: "/api/ws/article/messages",
            params: {
                after: after,
                article_id: articleId
            }
        }).then((list, total) => {
            setComments([...list, ...comments])
        })
    } 

    /**
     * 消息：发布
     */
    const onComment = async () => {
        if (!isLogin()) {
            return;
        }
        await POST({
            url: BACKEND_URL.discussion + router.query.id,
            data: {
                content: commentValue,
                user_id: user.id
            }
        }).then(LoadMore)
        return false
    }

    return (
        <div className={classes.discussion_timeline}>
            <div>
                {
                    comments && comments.length > 0 ? comments.map((item, key) => (
                        <div className={classes.timeline_comment_wrapper} key={key}>
                            <div className={classes.timeline_comment_avatar}>
                                {
                                    item.sender.link ?
                                        <a href={item.sender.link} target="_blank" rel="nofollow"><img src={item.sender.avatar_url ? item.sender.avatar_url : DEFAULT_AVATAR} height="44" weight="44" /></a> :
                                        <img src={item.sender.avatar_url ? item.sender.avatar_url : DEFAULT_AVATAR} height="44" weight="44" />
                                }
                            </div>
                            <div className={classes.timeline_comment}>
                                <div className={classes.timeline_comment_header + " " + (user.id == item.user_id ? classes.timeline_comment_current_user : '')}>
                                    <Typography variant="h5" className={classes.timeline_comment_header_text}>
                                        <strong>
                                            {
                                               item.sender.link ? 
                                                <a href={item.sender.link} className={classes.author} target="_blank" rel="nofollow">{item.sender.name}</a>:
                                                item.sender.name
                                            }
                                        </strong> commented <relative-time datetime=""> {moment(item.created_at).calendar()}</relative-time>
                                    </Typography>
                                </div>
                                <div className={classes.comment_body}>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: markdown.render(item.content) }}
                                        className="markdown-body"
                                    />
                                </div>
                            </div>
                        </div>
                    )) :
                        ""
                }
                <div className={classes.discussion_timeline_actions}>
                    <div className={classes.timeline_comment_wrapper + " " + classes.timeline_new_comment}>
                        <span className={classes.timeline_comment_avatar}>
                            {
                                user.link ? <a href={user.link} target="_blank" rel="nofollow"><img src={user.avatar_url ? user.avatar_url : GITHUB_LOGO} alt={user.name} width="44" height="44" /></a> : ''
                            }
                        </span>
                        <div className={classes.timeline_comment_group}>
                            {
                                // isLogin() ? '' : (<a href={oauth} target="_blank" rel="nofollow" className={classes.comment_login} />)
                            }
                            <div>
                                <MarkdownTextarea
                                    render={value => markdown.render(value)}
                                    onChange={setCommentValue}
                                    onComment={onComment}
                                    isLogin={isLogin}
                                    toolbarAlwaysVisible={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Gitment