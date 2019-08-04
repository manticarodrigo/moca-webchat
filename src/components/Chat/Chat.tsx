import React, { ChangeEvent, FormEvent, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.scss';

import useGroupedMessages from '../../hooks/useGroupedMessages';
import useScrollToBottom from '../../hooks/useScrollToBottom';

import ChatMessages from '../ChatMessages/ChatMessages';

export type ChatMessage = {
  user: number;
  text: string;
};

export type User = {
  id: number;
  username: string;
};

type ChatState = {
  users: User[];
  messages: ChatMessage[];
  currentMessageText: string;
};

const initalState = {
  users: [],
  messages: [],
  currentMessageText: '',
};


const chatUrl = 'http://localhost:8000/api/chat/1/';
const authConf = {
  headers: {
    'Authorization': `Token a9886093415439ff273274c966c34f1dd35272d7`
  },
};

const Chat = () => {
  const [state, setState] = useState<ChatState>(initalState);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageGroups = useGroupedMessages(state.messages);

  useScrollToBottom(state.messages, messageListRef);

  useEffect(() => {
    const getMessages = async() => {
      const { data } = await axios.get(chatUrl, authConf);

      setState((prevState) => ({
        ...prevState,
        users: data.users ? data.users : prevState.users,
        messages: data.messages.reverse(),
      }));
    };

    getMessages();
  }, []);

  const handleMessageTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, currentMessageText: event.target.value });

  const handleSendMessage = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (state.currentMessageText) {
      const response = await axios.post(chatUrl, { text: state.currentMessageText }, authConf);

      setState({
        ...state,
         messages: [...state.messages, response.data],
         currentMessageText: '',
      });
    }
  };

  return (
    <footer>
      <aside className="chat">
        <div className="chat__container">
          <div className="chat__header">
            <div className="chat__header__image">
              <img src={require('../../assets/images/utility/chat.png')} alt="" />
            </div>
            <button className="chat__header__button" />
          </div>
          <div className="chat__messages" ref={messageListRef}>
              <ChatMessages users={state.users} messageGroups={messageGroups} />
          </div>
          <form className="chat__form" onSubmit={handleSendMessage}>
            <button className="chat__form__button chat__form__attachment" type="button" />
            <input
              className="chat__form__input"
              type="text"
              placeholder="Send a message"
              value={state.currentMessageText}
              onChange={handleMessageTextChange}
            />
            <button className="chat__form__button chat__form__submit" type="submit" />
          </form>
        </div>
      </aside>
    </footer>
  );
};

export default Chat;
