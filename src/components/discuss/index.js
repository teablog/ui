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
import { Info } from '../../layout/icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import DModal from '../modal';
import UserList from '../userList';
import { POST, GET } from '../../request';
import { ENV } from '../../config';
import './discuss.css';


let MY_USER_ID, conn;
const initialState = { messages: [], dialogOpen: false };
const READ_HISTORY = "read_history";
moment.locale('zh-cn');

function reducer(state, action) {
    let m = state.messages;
    switch (action.type) {
        case 'new_message':// 新消息
            console.log("new message: " + action.msg);
            return { ...state, messages: [...state.messages, action.msg] };
        case 'history_messages': // 加载更多历史消息
            return { ...state, messages: [...action.messages, ...state.messages] };
        case "dialog_open"://
            return { ...state, dialogOpen: action.dialogOpen }
        default:
            throw new Error();
    }
}

const messages = [
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },
    {
        "id": "4505040792cc359c870f4f7566055667",
        "date": "2020-05-20T21:22:21.312387+08:00",
        "sender": {
            "id": "a647d9d3d464a8fa",
            "name": "douyacun liu"
        },
        "type": "TEXT",
        "content": "😍",
        "channel_id": "douyacun"
    },

]
function Discusss({ ws_address, articleId }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [modalOpen, setModalOpen] = useState(false);
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
        loadMore().then(scrollToBottom);
        scrollToBottom()
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            MY_USER_ID = douyacun.id
            console.log(MY_USER_ID);
        } else {
            window.location = `/login?redirect_uri=` + escape(router.asPath)
        }
        return () => {
            // _isMounted = false;
        }
    }, []);

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
        }).then(({ data: { messages, total } }) => {
            dispatch({ type: "history_messages", messages: messages });
            setloading(false);
        });
    }
    useEffect(() => {
        let t = setTimeout(loadMore, 1000);
        if (!loading) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight - messagesHeight;
        }
        return () => {
            clearTimeout(t);
        }
    }, [loading]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const upScrollLoadMore = () => {
        // let scrollTop = contentRef.current.scrollTop;
        // let channelMessages = state.messages[state.currentId];
        // if (scrollTop == 0 && !loading && channelMessages && channelMessages.length > 0) {
        //     let channel = getChannelById(state.currentId);
        //     if (channel.total > 0) {
        //         setloading(true);
        //     }
        // }
    }
    const handlerMessage = function (evt) {
        let msg = JSON.parse(evt.data)
        console.log("new message: " + msg)
        switch (msg['type']) {
            case "SYSTEM":
            case "TEXT":
                dispatch({ type: "new_message", msg: msg });
                scrollToBottom();
                break;
        }
    }
    const handlerExit = () => {
        conn.close();
        window.close();
    }
    const handlerRetry = () => {
        initWebsocket();
        dispatch({ type: "dialog_open", dialogOpen: false })
    }
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
    const send = (content) => {
        let data = JSON.stringify({
            content: content,
            article_id: articleId,
            type: "TEXT"
        })
        conn.send(data);
    }
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
    const getLastMessage = (messages) => {
        if (messages && messages.length > 0) {
            let message = messages[messages.length - 1];
            return message['sender']["name"] + ": " + message["content"];
        } else {
            return ""
        }
    }

    // console.log(state.messages);
    return (
        <div className="container" ref={contentRef} onScroll={upScrollLoadMore}>
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