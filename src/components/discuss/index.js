import React, {useReducer, useState, useEffect, useRef } from 'react';
import MessageInputSmall from '../message_input/small';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import moment from 'moment';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies'
import CircularProgress from '@material-ui/core/CircularProgress';
import MarkdownIt from 'markdown-it'
import { GET } from '../../request';

import './discuss.css';
import '../../css/github-markdown.css';
import '../../css/highlight-github.css';


let MY_USER_ID, conn;
const TOP = 1;
const BOTTOME = 2;
/**
 * topOrBottom: 滑动条位置
 * - 新消息在最下方
 * - 下拉加载消息，保持滑动条原位置
 * remain: 剩余消息数量
 */
const initialState = { messages: [], dialogOpen: false, topOrBottom: BOTTOME, remain: 0 };
moment.locale('zh-cn');

function reducer(state, action) {
    let m = state.messages;
    switch (action.type) {
        case 'new_message':
            return { ...state, messages: [...state.messages, ...action.msgs], topOrBottom: BOTTOME };
        case 'history_messages':
            return { ...state, messages: [...action.messages, ...state.messages], topOrBottom: m.length > 0 ? TOP : BOTTOME, remain: action.remain };
        case "dialog_open"://
            return { ...state, dialogOpen: action.dialogOpen }
        default:
            throw new Error();
    }
}

function Discusss({ ws_address, articleId, styles, messages = [], messagesTotal }) {
    const [state, dispatch] = useReducer(reducer, { messages: messages, dialogOpen: false, topOrBottom: BOTTOME, remain: messagesTotal-messages.length });
    const [loading, setloading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [messagesHeight, setMessagesHeight] = useState(0);
    const router = useRouter();
    const contentRef = useRef(null);
    const scrollToBottom = () => {
        // 保证消息在最下面
        contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
    /**
     * markdown
     */
    const md = new MarkdownIt({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) { }
            }
            return '';
        },
        html: true,
        linkify: true,
    });
    /**
     * const [messages, setMessages] = React.useState([]);
     * useEffect 第二个参数的含义，保证initWebsocket只会初始化一次，这样会导致messages变化后，handlerMessage中message不会变化，故此采用dispatch的方式
     * @link https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often
     */
    useEffect(() => {
        if (messages.length == 0) {
            loadMore();
        }
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            MY_USER_ID = douyacun.id
            if (douyacun.id) {
                initWebsocket();
                setIsLogin(true);
            }
        }
        return () => { }
    }, []);
    /**
     * 滚动条位置
     */
    useEffect(() => {
        if (state.topOrBottom == BOTTOME) {
            scrollToBottom()
        } else {
            contentRef.current.scrollTop = contentRef.current.scrollHeight - messagesHeight;
        }
        return () => { }
    }, [state.messages]);

    /**
     * websocket: 初始化 
     */
    const initWebsocket = () => {
        conn = new WebSocket(ws_address);
        conn.onmessage = handlerMessage;
        conn.onclose = function () {
            dispatch({ type: "dialog_open", dialogOpen: true })
        };
        conn.onerror = function () {
            console.log("连接失败");
        }
    }
    /**
     * websocket: 接收
     */
    const handlerMessage = function (evt) {
        let msg = JSON.parse(evt.data)
        console.log("new message: " + msg)
        switch (msg['type']) {
            case "SYSTEM":
            case "TEXT":
                dispatch({ type: "new_message", msgs: [msg] });
                break;
        }
    }
    /**
     * 消息：加载历史
     */
    const loadMore = () => {
        let before;
        if (state.messages.length > 0) {
            let lastMessage = state.messages[0];
            before = moment(lastMessage.date).valueOf();
        } else {
            before = moment().valueOf();
        }
        setMessagesHeight(contentRef.current.scrollHeight);
        return GET({
            url: "/api/ws/article/messages",
            params: {
                before: before,
                article_id: articleId
            }
        }).then(({ data: { list, total } }) => {
            dispatch({ type: "history_messages", messages: list, remain: total - list.length > 0 ? total - list.length : 0 });
        });
    }
    /**
     * 消息：下拉加载更多
     */
    const upScrollLoadMore = () => {
        let scrollTop = contentRef.current.scrollTop;
        if (scrollTop == 0 && !loading && state.messages.length > 0 && state.remain > 0) {
            setloading(true);
            loadMore().then(setloading(false))
            // 上方显示加载框
            // setTimeout(() => (loadMore().then(setloading(false))), 500);
        }
    }
    /**
     * 消息：渲染
     */
    const renderMessages = (messages) => {
        if (!messages) {
            messages = [];
        }
        let i = 0;
        let messageCount = messages.length;
        let tempMessages = [];

        while (i < messageCount) {
            let previous = messages[i - 1];
            let current = messages[i];
            let isMine = current['sender']['id'] === MY_USER_ID;
            let isSystem = current['sender']['id'] === '0';
            let currentMoment = moment(current.date);
            let showTimestamp = true;

            if (previous) {
                let previousMoment = moment(previous.date);
                let previousDuration = moment.duration(currentMoment.diff(previousMoment));

                if (previousDuration.as('minutes') < 15) {
                    showTimestamp = false;
                }
            }
            let friendlyTimestamp = moment(current.date).calendar();
            tempMessages.push(
                <div className={['message', `${isMine ? 'mine' : ''}`].join(' ')} key={i}>
                    {
                        showTimestamp && (<div className="reminder">{friendlyTimestamp}</div>)
                    }
                    {
                        isSystem ?
                            (<div className="reminder"><div dangerouslySetInnerHTML={{ __html: md.render(current.content) }}></div></div>) :
                            <div>
                                {!isMine && (<div className="name">{current.sender.name}</div>)}
                                <div className="bubble-container">
                                    <div className="markdown-body bubble" title={friendlyTimestamp}>
                                        <div dangerouslySetInnerHTML={{ __html: md.render(current.content) }}></div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>

            );
            i += 1;
        }
        return tempMessages;
    }
    /**
     * 关闭websocket
     */
    const handlerExit = () => {
        conn.close();
        window.close();
    }
    const handlerRetry = () => {
        initWebsocket();
        dispatch({ type: "dialog_open", dialogOpen: false })
    }
    const send = (content) => {
        if (!isLogin) {
            window.location = `/login?redirect_uri=` + escape(router.asPath)
        } else {
            let data = JSON.stringify({
                content: content,
                article_id: articleId,
                type: "TEXT"
            })
            conn.send(data);
        }
    }
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div className="container" style={styles}>
            <div className="full scrollable" ref={contentRef} onScroll={upScrollLoadMore}>
                <div className="message-list">
                    <div>
                        <div className="message-list-container">
                            {loading && <div className="loading">
                                <CircularProgress color="inherit" />
                            </div>}
                            {renderMessages(state.messages)}
                        </div>
                    </div>
                </div>
                <div className="message-input-fix">
                    <MessageInputSmall send={send} />
                </div>
            </div>

            <Dialog
                fullScreen={fullScreen}
                open={state.dialogOpen}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        连接已断开，是否重新连接服务器？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlerExit}>
                        退出
                    </Button>
                    <Button autoFocus onClick={handlerRetry}>
                        重连
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Discusss;