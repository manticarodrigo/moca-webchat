import React from 'react';
import './ChatMessages.scss';

import { User, ChatMessage } from '../Chat/Chat';

type ChatMessagesProps = {
  users: User[];
  messageGroups: ChatMessage[][];
}

type ChatMessageGroupsProps = {
  users: User[];
  messages: ChatMessage[];
}

const ChatMessages = ({ users, messageGroups }: ChatMessagesProps) => (
  <ul className="u-list-unstyled u-margin-hug--vert">
    {messageGroups.map((messages, index) => (
      <ChatMessageGroup key={index} users={users} messages={messages} />
    ))}
  </ul>
);

const ChatMessageGroup = ({ users, messages }: ChatMessageGroupsProps) => {
  const author = users.find(user => user.id === messages[0].user) || { username: 'Unknown User' };

  return (
    <li className="u-margin-bottom">
      <p className="u-margin-hug--vert">
        <b>{author.username}</b>
      </p>
      <ul className="u-list-unstyled u-margin-hug--vert">
        {messages.map((message, index) => (
          <li key={index}>
            <p className="u-margin-hug--vert u-margin-left">{message.text}</p>
          </li>
        ))}
      </ul>
    </li>
  )
};

export default ChatMessages;
