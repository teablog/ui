import React from 'react';
import './Compose.css';

export default function Compose(props) {
  return (
    <div className="compose">
      <div className="compose-left">
        <input
          type="text"
          className="compose-input"
          onKeyPress={props.send}
          placeholder="Type a message, @name"
        />
      </div>
      <div>
        {
          props.rightItems
        }
      </div>

    </div>
  );
}