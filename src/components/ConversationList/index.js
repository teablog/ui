import React from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import './ConversationList.css';

export default function ConversationList({conversations, setChannel, channel}) {
  return (
    <div className="conversation-list">
      <ConversationSearch />
      {
        conversations.map(conversation =>
          <ConversationListItem
            key={conversation.id}
            data={conversation}
            setChannel={setChannel}
            channel={channel}
          />
        )
      }
    </div>
  );
}