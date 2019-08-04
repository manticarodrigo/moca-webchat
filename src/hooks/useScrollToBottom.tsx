import { RefObject, useEffect } from 'react';
import { ChatMessage } from '../components/Chat/Chat';

const useScrollToBottom = (messages: ChatMessage[], messageListRef: RefObject<HTMLDivElement>) => useEffect(() => {
    const scrollToBottom = () => {
      if (messageListRef) {
        const scrollHeight = messageListRef.current!.scrollHeight;
        const height = messageListRef.current!.clientHeight;
        const maxScrollTop = scrollHeight - height;

        messageListRef.current!.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }
    };

    scrollToBottom();
  }, [messages, messageListRef])

export default useScrollToBottom;
