import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../ThemeProvider";

interface EmojiPickerProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  forceAbove?: boolean;
}

type PickerPos = { top: number; left: number; arrowX: number };

export function EmojiPicker({
  anchorRef,
  onEmojiSelect,
  onClose,
  forceAbove = true,
}: EmojiPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<PickerPos>({ top: 0, left: 0, arrowX: 12 });
  const { theme } = useTheme();

  const emojis = [
    "😀","😃","😄","😁","😅","😂","🤣","😊","😇","🙂",
    "🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋",
    "😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩","🥳",
    "👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👈","👉",
    "👆","👇","☝️","👋","🤚","🖐️","✋","🖖","👏","🙌",
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💖","💔",
    "💻","🖥️","⌨️","🖱️","🧠","🔌","🔗","⚙️","💿","💾",
    "💯","⭐","🌟","💫","✨","🎉","🎁","🔥","👩‍💻","👨‍💻"
  ];

  const PICKER_W = 360;
  const PICKER_H = 360;
  const GAP = 8;

  const isDarkMode = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const computePosition = () => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const bodyW = window.innerWidth;
    const bodyH = window.innerHeight;

    let left = rect.left + rect.width / 2 - PICKER_W / 2;
    let top = rect.top - PICKER_H - GAP;

    const minL = 8;
    const maxL = bodyW - PICKER_W - 8;
    if (left < minL) left = minL;
    if (left > maxL) left = maxL;

    let arrowX = rect.left + rect.width / 2 - left;
    arrowX = Math.min(Math.max(arrowX, 12), PICKER_W - 12);

    if (!forceAbove) {
      const spaceBelow = bodyH - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow > spaceAbove && spaceBelow > PICKER_H + GAP) {
        top = rect.bottom + GAP;
      }
    }

    top = Math.min(Math.max(top, 8), bodyH - PICKER_H - 8);
    setPos({ top, left, arrowX });
  };

  useEffect(() => {
    computePosition();
    const handle = () => computePosition();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!containerRef.current?.contains(t) && !anchorRef.current?.contains(t)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onClose, anchorRef]);

  const popup = (
    <div
      ref={containerRef}
      data-emoji-picker
      className="fixed z-[9999] border rounded-lg shadow-xl p-3 w-[360px] select-none"
      style={{
        top: pos.top,
        left: pos.left,
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? '#374151' : '#d1d5db',
        opacity: 1,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span 
          className="text-sm font-medium"
          style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
        >
          Pick an emoji
        </span>
        <button
          onClick={onClose}
          className="text-sm font-bold w-5 h-5 flex items-center justify-center rounded transition-colors"
          style={{
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
            e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
          }}
          aria-label="Close emoji picker"
        >
          ✕
        </button>
      </div>

      <div
        className="mt-1"
        style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4 }}
      >
        {emojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="inline-flex items-center justify-center w-8 h-8 text-xl rounded transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  return createPortal(popup, document.body);
}