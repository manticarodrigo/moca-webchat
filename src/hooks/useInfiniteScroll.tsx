import { useState, useEffect } from 'react';

type InfiniteScrollReturn = [boolean, () => void];

const useInfiniteScroll = (element: HTMLElement | null): InfiniteScrollReturn => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isFetching && element && element.scrollTop === 0) {
        setIsFetching(true);
      }
    };

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    }
  }, [element, isFetching]);

  const handleFetchComplete = () => setIsFetching(false);

  return [isFetching, handleFetchComplete];
};

export default useInfiniteScroll;
