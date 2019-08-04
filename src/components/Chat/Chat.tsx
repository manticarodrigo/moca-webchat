import React, { ChangeEvent, FormEvent, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.scss';

import useGroupedMessages from '../../hooks/useGroupedMessages';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
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
  next?: string;
  previous?: string;
  count?: string;
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
  const [isFetching, onFetchComplete] = useInfiniteScroll(messageListRef.current);

  useEffect(() => {
    const fetchInitialMessages = async() => {
      const { data } = await axios.get(chatUrl, authConf);
      const { next, previous, count, users = [], messages = [] } = data;

      setState((prevState) => ({
        ...prevState,
        next,
        previous,
        count,
        users,
        messages: messages.reverse(),
      }));
    };

    fetchInitialMessages();
  }, []);

  useEffect(() => {
    const fetchMoreMessages = async() => {
      if (isFetching && state.next) {
        const { data } = await axios.get(state.next, authConf);
        const { next, previous, count, messages = [] } = data;
  
        setState((prevState) => ({
          ...prevState,
          next,
          previous,
          count,
          messages: [...messages.reverse(), ...prevState.messages],
        }));
  
        onFetchComplete();
      }
    };

    fetchMoreMessages();
  }, [isFetching, onFetchComplete, state.next]);

  const handleMessageTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setState({ ...state, currentMessageText: event.target.value });

  const handleMessageSubmit = async(event: FormEvent<HTMLFormElement>) => {
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

  useScrollToBottom(messageListRef.current);

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
          <form className="chat__form" onSubmit={handleMessageSubmit}>
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
