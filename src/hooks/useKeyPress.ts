import { useEffect, useCallback } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

export function useKeyPress(targetKey: string, handler: KeyHandler) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === targetKey &&
        // Don't trigger if user is typing in an input/textarea
        !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
      ) {
        handler(event);
      }
    },
    [targetKey, handler]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
}