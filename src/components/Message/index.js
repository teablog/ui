import React from 'react';
import moment from 'moment';
import './Message.css';

export default function Message(props) {
  const {
    data,
    isMine,
    showTimestamp,
    isSystem
  } = props;

  const friendlyTimestamp = moment(data.date).calendar();
  return (
    <div className={[
      'message',
      `${isMine ? 'mine' : ''}`
    ].join(' ')}>
      {
        showTimestamp &&
        <div className="reminder">
          {friendlyTimestamp}
        </div>
      }
      {
        isSystem ?
          <div className="reminder">
            {data.content}
          </div> :
          <div>
            {
              !isMine && (<div className="name">{data.sender.name}</div>)
            }
            <div className="bubble-container">
              <div className="bubble" title={friendlyTimestamp}>
                {data.content}
              </div>
            </div>
          </div>
      }
    </div>
  );
}