import React from 'react';

let conn;

const ONLINE = "ONLINE"

function WS({ ws_address, setOnline = undefined }) {
    React.useEffect(() => {
        connect()
    }, [])
    /**
     * websocket: 初始化 
     */
    const connect = () => {
        conn = new WebSocket(ws_address);
        conn.onmessage = handlerMessage;
        conn.onclose = function (e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                connect();
            }, 1000);
        };
        conn.onerror = function (e) {
            console.error('Socket encountered error: ', e.message, 'Closing socket');
            conn.close()
        }
    }
    /**
     * websocket: 接收
     */
    const handlerMessage = function (evt) {
        let msg = JSON.parse(evt.data)
        switch (msg.type) {
            case ONLINE:
                if (setOnline != undefined) {
                    setOnline(msg.content)
                }
        }
    }
    return (
        <div></div>
    )
}

export default WS