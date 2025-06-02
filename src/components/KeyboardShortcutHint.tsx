"use client";

import { Fragment } from "react";

interface KeyboardShortcutHintProps {
  keys: string[];
  label?: string;
  className?: string;
}

export default function KeyboardShortcutHint({
  keys,
  label,
  className = "",
}: KeyboardShortcutHintProps) {
  const isMac = typeof window !== "undefined" && navigator.platform.includes("Mac");

  const keyMap: Record<string, string> = {
    Control: isMac ? "⌘" : "Ctrl",
    Alt: isMac ? "⌥" : "Alt",
    Shift: "⇧",
    Enter: "↵",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Escape: "Esc",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ${className}`}
    >
      {label && <span className="mr-1">{label}</span>}
      {keys.map((key, index) => (
        <Fragment key={key}>
          <kbd className="min-w-[1.2em] rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-medium text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {keyMap[key] || key}
          </kbd>
          {index < keys.length - 1 && <span>+</span>}
        </Fragment>
      ))}
    </div>
  );
}