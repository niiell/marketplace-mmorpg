import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.shiftKey === event.shiftKey
      );

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault) {
          event.preventDefault();
        }
        matchingShortcut.action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}

// Common marketplace shortcuts
export const MARKETPLACE_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'f',
    ctrlKey: true,
    action: () => document.querySelector<HTMLInputElement>('[role="searchbox"]')?.focus(),
    preventDefault: true,
  },
  {
    key: '/',
    action: () => document.querySelector<HTMLInputElement>('[role="searchbox"]')?.focus(),
    preventDefault: true,
  },
  {
    key: 'Escape',
    action: () => document.activeElement instanceof HTMLElement && document.activeElement.blur(),
  },
  {
    key: 'g',
    ctrlKey: true,
    action: () => {
      const element = document.querySelector('[data-grid-view]');
      if (element instanceof HTMLElement) {
        element.click();
      }
    },
    preventDefault: true,
  },
  {
    key: 'l',
    ctrlKey: true,
    action: () => {
      const element = document.querySelector('[data-list-view]');
      if (element instanceof HTMLElement) {
        element.click();
      }
    },
    preventDefault: true,
  },
  {
    key: 'f',
    altKey: true,
    action: () => {
      const element = document.querySelector('[data-filter-button]');
      if (element instanceof HTMLElement) {
        element.click();
      }
    },
    preventDefault: true,
  },
];