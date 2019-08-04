import { useMemo } from 'react';
import { ChatMessage } from '../components/Chat/Chat';

const useGroupedMessages = (messages: ChatMessage[]) => useMemo(() =>
  messages.reduce((groups: ChatMessage[][], message, index) => {
    const isPreviousUser = index > 0 && messages[index - 1].user === message.user;

    if (isPreviousUser) {
      const previousGroup = [...(groups.pop() || []), message];

      return [...groups, previousGroup];
    } else {
      return [...groups, [message]];
    }
  }, []),
[messages]);

export default useGroupedMessages;
