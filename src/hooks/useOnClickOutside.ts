import { RefObject, useEffect } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: Handler
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains((event.target as Node))) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}