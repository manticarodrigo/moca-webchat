import { useEffect } from 'react';

const useScrollToBottom = (element: HTMLElement | null) => useEffect(() => {
    const scrollToBottom = () => {
      if (element) {
        const scrollHeight = element.scrollHeight;
        const height = element.clientHeight;
        const maxScrollTop = scrollHeight - height;

        element.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }
    };

    scrollToBottom();
  }, [element])

export default useScrollToBottom;
