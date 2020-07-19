import React, { Fragment, useReducer, useState, useEffect, useRef } from 'react';
import MessageInputSmall from '../src/components/MessageInput/MessageInputSmall';
import Button from '@material-ui/core/Button';
import Message from '../src/components/Message';
import Toolbar from '../src/components/Toolbar';
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
import { Info } from '../src/layout/icon';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import DModal from '../src/components/Modal';
import UserList from '../src/components/UserList';
import { POST, GET } from '../src/request';
import { ENV } from '../src/config';
import '../src/css/chat.css';


let MY_USER_ID, conn;
const initialState = { messages: {}, channels: [], currentId: "douyacun", dialogOpen: false };
const READ_HISTORY = "read_history";
moment.locale('zh-cn');

function reducer(state, action) {
    let prev = [];
    let m = state.messages;
    let newChannels = [];
    let channels = state.channels;
    switch (action.type) {
        case 'new_message':// 新消息
            if (m.hasOwnProperty(action.channel_id)) {
                prev = m[action.channel_id];
            }
            m[action.channel_id] = [...prev, action.msg];
            // console.log(m);
            return { ...state, messages: m };
        case 'history_messages': // 加载更多历史消息
            m = state.messages;
            if (m.hasOwnProperty(action.channel_id)) {
                prev = m[action.channel_id];
            }
            for (let k in channels) {
                if (channels[k].id == action.channel_id) {
                    channels[k].total = action.total
                }
            }
            m[action.channel_id] = [...action.messages, ...prev];
            return { ...state, messages: m, channels: channels };
        case 'channels':// 加载订阅channel
            let channel;
            for (let k in action.channels) {
                channel = action.channels[k];
                prev = [];
                if (m.hasOwnProperty(channel.id)) {
                    prev = m[channel.id];
                }
                m[channel.id] = [...channel['messages'], ...prev]
                delete (channel.messages);
                newChannels.push(channel)
            }
            return { ...state, channels: newChannels, messages: m };
        case 'new_channel':// 创建新的channel
        console.log(channels, action);
            for (let k in channels) {
                if (channels[k].id == action.channel.id) {
                    return { ...state, currentId: action.channel.id };
                }
            }
            return { ...state, channels: [...state.channels, action.channel], currentId: action.channel.id }
        case 'current':// 当前阅读窗口
            return { ...state, currentId: action.channel_id }
        case "dialog_open"://
            return { ...state, dialogOpen: action.dialogOpen }
        default:
            throw new Error();
    }
}

function Chat({ws_address}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setloading] = useState(false);
    const [messagesHeight, setMessagesHeight] = useState(0);
    const router = useRouter();
    const contentRef = useRef(null);
    const scrollToBottom = () => {
        // 保证消息在最下面
        contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
    /**
     * const [messages, setMessages] = React.useState([]);
     * useEffect 第二个参数的含义，保证initWebsocket只会初始化一次，这样会导致messages变化后，handlerMessage中message不会变化，故此采用dispatch的方式
     * @link https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often
     */
    useEffect(() => {
        initWebsocket();
        getChannels().then(scrollToBottom)
        const all = parseCookies();
        if (all.douyacun) {
            const douyacun = JSON.parse(all.douyacun);
            MY_USER_ID = douyacun.id
            console.log(MY_USER_ID);
        } else {
            window.location = `/login?redirect_uri=` + escape(router.asPath)
        }
        return () => {
            _isMounted = false;
        }
    }, []);

    const loadMore = () => {
        if (loading) {
            let channelMessages = state.messages[state.currentId];
            if (channelMessages && channelMessages.length > 0) {
                let channel = getChannelById(state.currentId);
                if (channel.total > 0) {
                    let lastMessage = channelMessages[0];
                    let before = moment(lastMessage.date).valueOf();
                    setMessagesHeight(contentRef.current.scrollHeight);
                    GET({
                        url: "/api/ws/channel/messages",
                        params: {
                            before: before,
                            channel_id: state.currentId
                        }
                    }).then(({ data: { messages, total } }) => {
                        dispatch({ type: "history_messages", channel_id: state.currentId, messages: messages, total: total });
                        setloading(false);
                    });
                }
            }
        }
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
        let scrollTop = contentRef.current.scrollTop;
        let channelMessages = state.messages[state.currentId];
        if (scrollTop == 0 && !loading && channelMessages && channelMessages.length > 0) {
            let channel = getChannelById(state.currentId);
            if (channel.total > 0) {
                setloading(true);
            }
        }
    }
    const getChannelById = (channel_id) => {
        let channels = state.channels;
        for (let k in channels) {
            if (channels[k].id == channel_id) {
                return channels[k];
            }
        }
        return undefined;
    }
    const getChannelTitle = (channel_id) => {
        let channel = getChannelById(channel_id);
        if (channel) {
            return channel.title
        } else {
            return "douyacun"
        }
    }
    const handlerMessage = function (evt) {
        let msg = JSON.parse(evt.data)
        switch (msg['type']) {
            case "SYSTEM":
            case "TEXT":
                dispatch({ type: "new_message", msg: msg, channel_id: msg['channel_id'] });
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
    const switchChannel = (channel_id) => {
        dispatch({ type: "current", channel_id: channel_id })
        // 获取消息的最后一条的时间
        let messages = state.messages[channel_id];
        if (messages && messages.length > 0) {
            let message = messages[messages.length - 1];
            let data = localStorage.getItem(READ_HISTORY);
            let read;
            if (data) {
                read = JSON.parse(data);
            } else {
                read = {};
            }
            read[channel_id] = message.date
            localStorage.setItem(READ_HISTORY, JSON.stringify(read));
        }
    }
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
    const send = (content) => {
        let data = JSON.stringify({
            content: content,
            channel_id: state.currentId
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
    // 请求接口
    const createChannel = async (members) => {
        if (members.length > 0) {
            let type = "";
            if (members.length == 1) {
                type = "private";
            } else {
                type = "public"
            }
            POST({
                url: "/api/ws/channel",
                data: {
                    type: type,
                    members: members,
                    title: ""
                }
            }).then(({ data }) => {
                dispatch({ type: 'new_channel', channel: data })
            })
        }
    }
    const getChannels = () => {
        let readHistory = localStorage.getItem(READ_HISTORY);
        return GET({
            url: "/api/ws/channel/subscribe",
            q: readHistory
        }).then(({ data }) => {
            dispatch({ type: "channels", channels: data })
        })
    }
    return (
        <Fragment>
            <div className="messenger">
                <div className="scrollable sidebar">
                    <Toolbar
                        title="Messenger"
                        leftItems={[
                            <SettingsOutlinedIcon key="setting" className="button" />
                        ]}
                        rightItems={[
                            <AddCircleOutlineOutlinedIcon key="add" className="button" onClick={() => setModalOpen(true)} />
                        ]}
                    />
                    <div className="conversation-list">
                        <div className="conversation-search">
                            <input
                                type="search"
                                className="conversation-search-input"
                                placeholder="Search Messages"
                            />
                        </div>
                        {
                            state.channels.map(channel => (
                                <div
                                    key={channel.id}
                                    onClick={() => switchChannel(channel.id)}
                                    className={["conversation-list-item", channel && channel.id == state.currentId ? "conversation-list-item-current" : ""].join(" ")}
                                >
                                    {
                                        Boolean(channel.members[0]) ?
                                            <Avatar className="conversation-photo" src={channel.members[0].avatar_url} /> :
                                            <Avatar className="conversation-photo">D</Avatar>
                                    }
                                    <div className="conversation-info">
                                        <h1 className="conversation-title">{channel.title}</h1>
                                        <p className="conversation-snippet">{getLastMessage(state.messages[channel.id])}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="scrollable content" ref={contentRef} onScroll={upScrollLoadMore}>
                    <div className="message-list">
                        {
                            state.currentId ? (<div>
                                <Toolbar
                                    title={getChannelTitle(state.channel_id)}
                                    rightItems={[
                                        <Info key="info" className="button" />
                                    ]}
                                />
                                <div className="message-list-container">
                                    {loading && <div className="loading">
                                        <CircularProgress color="inherit" />
                                    </div>}
                                    {renderMessages(state.messages[state.currentId])}
                                </div>
                                <div className="message-input-fix">
                                    <MessageInputSmall send={send} />
                                </div>
                            </div>) : ''
                        }
                    </div>
                </div>
            </div>

            <DModal open={modalOpen} setOpen={setModalOpen}><UserList setOpen={setModalOpen} createChannel={createChannel} myUserId={MY_USER_ID} /></DModal>
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
        </Fragment>
    );
}

Chat.getInitialProps = async ({ req, query }) => {
    let ws_address;
    if (ENV.protocol == "https") {
        ws_address = "wss://" + ENV.host + "/api/ws/join"
    } else {
        ws_address = "ws://" + ENV.host + "/api/ws/join"
    }
    return { ...ENV, ws_address }
}
export default Chat;