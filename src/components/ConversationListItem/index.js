import React, { useEffect } from 'react';
// import shave from 'shave';

import './ConversationListItem.css';

export default function ConversationListItem({ setChannel, data, channel }) {
  const { members, title, id } = data;
  const handleChangeChannel = (c) => {
    setChannel(c)
  }
  // let photo = members[0]["avatar_url"]
  let photo = '/images/blog/1/mysql/assert/mysql-locks-cover.png';
  return (
    <div className={["conversation-list-item", channel && channel.id == id ? "conversation-list-item-current": "" ].join(" ")} onClick={() => handleChangeChannel(data)} >
      <img className="conversation-photo" src={photo} alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{title}</h1>
        <p className="conversation-snippet">这里是最近消息</p>
      </div>
    </div>
  );
}