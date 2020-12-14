import React, { Fragment, useReducer, useState, useEffect, useRef } from 'react';
import MessageInputSmall from '../messageInput/messageInputSmall';
import Button from '@material-ui/core/Button';
import Message from '../message';
import Toolbar from '../Toolbar';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import moment from 'moment';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies'
import CircularProgress from '@material-ui/core/CircularProgress';
import { POST, GET } from '../../request';
import { ENV } from '../../config';
import './discuss.css';


let MY_USER_ID, conn;
const TOP = 1;
const BOTTOME = 2;
const initialState = { messages: [], dialogOpen: false, topOrBottom: BOTTOME };
moment.locale('zh-cn');

function reducer(state, action) {
    let m = state.messages;
    switch (action.type) {
        case 'push_message':// 栈底：压入
            return { ...state, messages: [...state.messages, ...action.msgs], topOrBottom: BOTTOME };
        case 'unshift_messages': // 栈顶：压入
            let t = TOP
            if (m.length == 0) {
                t = BOTTOME
            }
            return { ...state, messages: [...action.messages, ...state.messages], topOrBottom: t };
        case "dialog_open"://
            return { ...state, dialogOpen: action.dialogOpen }
        default:
            throw new Error();
    }
}

function Discusss({ ws_address, articleId }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setloading] = useState(false);
    const [messagesHeight, setMessagesHeight] = useState(0);
    const router = useRouter();
    const contentRef = useRef(null);
    const scrollToBottom = () => {
        // 保证消息在最下面
        contentRef.current.scrollTop = contentRef.current.scrollHeight
        console.log(contentRef.current.scrollHeight);
    }
    /**
     * const [messages, setMessages] = React.useState([]);
     * useEffect 第二个参数的含义，保证initWebsocket只会初始化一次，这样会导致messages变化后，handlerMessage中message不会变化，故此采用dispatch的方式
     * @link https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often
     */
    useEffect(() => {
        initWebsocket();
        loadMore();
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            MY_USER_ID = douyacun.id
        } else {
            window.location = `/login?redirect_uri=` + escape(router.asPath)
        }
        return () => {
            // _isMounted = false;
        }
    }, []);
    /**
     * 滚动条位置
     */
    useEffect(() => {
        if (state.topOrBottom == BOTTOME) {
            scrollToBottom()
            return () => {}
        } else {
            let t = setTimeout(loadMore, 1000);
            if (!loading) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight - messagesHeight;
            }
            return () => {
                clearTimeout(t);
            }
        }
    }, [state.messages]);
    /**
     * websocket: 初始化 
     */
    const initWebsocket = () => {
        conn = new WebSocket("ws://douyacun.io/api/ws/join");
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
                dispatch({ type: "push_message", msgs: [msg] });
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
        }).then(({ data: { list } }) => {
            dispatch({ type: "unshift_messages", messages: list });
            setloading(false);
        });
    }
    /**
     * 消息：下拉加载更多
     */
    const upScrollLoadMore = () => {
        let scrollTop = contentRef.current.scrollTop;
        console.log("scrollTop: ", scrollTop);

        // if (scrollTop == 0 && !loading && state.messages.length > 0) {
        //     setloading(true);
        // }
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
            tempMessages.push(
                <Message
                    key={i}
                    isMine={isMine}
                    isSystem={isSystem}
                    showTimestamp={showTimestamp}
                    data={current}
                />
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
        let data = JSON.stringify({
            content: content,
            article_id: articleId,
            type: "TEXT"
        })
        conn.send(data);
    }

    const getLastMessage = (messages) => {
        if (messages && messages.length > 0) {
            let message = messages[messages.length - 1];
            return message['sender']["name"] + ": " + message["content"];
        } else {
            return ""
        }
    }

    // console.log(state.messages);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div className="container">
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

// Discusss.getInitialProps = async ({ req, query }) => {
//     let ws_address;
//     if (ENV.protocol == "https") {
//         ws_address = "wss://" + ENV.host + "/api/ws/join"
//     } else {
//         ws_address = "ws://" + ENV.host + "/api/ws/join"
//     }
//     return { ...ENV, ws_address }
// }
export default Discusss;