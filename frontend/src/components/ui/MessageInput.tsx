import React, { useRef, useState } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { EmojiPicker } from "./EmojiPicker";
import { useTheme } from "../ThemeProvider";

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MessageInput({
  message,
  onMessageChange,
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
  className = "",
}: MessageInputProps) {
  const { theme } = useTheme();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const smileyAnchorRef = useRef<HTMLDivElement>(null);

  const isDarkMode = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onMessageChange(message + emoji);
  };

  return (
    <div className={`px-6 py-6 border-t border-border bg-background/80 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`pr-12 text-base py-3 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:bg-gray-800' 
                : 'bg-gray-50/50 border-gray-200/80 focus:border-blue-400/50 focus:bg-white'
            }`}
          />

          <div
            ref={smileyAnchorRef}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <div
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-1.5 cursor-pointer rounded-md transition-all duration-200 ${
                showEmojiPicker 
                  ? isDarkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-yellow-500"
                  : isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"
              }`}
              aria-label="Open emoji picker"
            >
              <Smile className="w-5 h-5" />
            </div>
          </div>
        </div>

        <Button 
          onClick={onSendMessage} 
          disabled={!message.trim() || disabled} 
          size="sm" 
          className={`px-4 py-3 transition-all duration-200 ${
            message.trim() && !disabled
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
              : 'opacity-50'
          }`}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {showEmojiPicker && (
        <EmojiPicker
          anchorRef={smileyAnchorRef}
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
          forceAbove
        />
      )}
    </div>
  );
}