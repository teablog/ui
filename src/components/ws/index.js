import React from 'react';

function WS(host) {
    React.useEffect(() => {

    }, [])
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
    return (
        <div></div>
    )
}

export default WS