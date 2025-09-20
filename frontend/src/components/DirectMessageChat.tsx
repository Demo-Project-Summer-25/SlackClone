import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { dmService } from "../services/dmService";
import { MessageService } from "../services/messageService";
import { userService } from "../services/userService";
import { DmResponse, MessageResponse, MessageCreateRequest } from "../types/api";
import { User } from "../types/user";

interface DirectMessageChatProps {
  dmId: string;
  currentUserId: string;
  onBack: () => void;
}

type PickerPos = { top: number; left: number; arrowX: number };

// ✅ Emoji picker rendered to a portal and positioned ABOVE the anchor button
const SimpleEmojiPicker = ({
  anchorRef,
  onEmojiSelect,
  onClose,
  forceAbove = true,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  forceAbove?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<PickerPos>({ top: 0, left: 0, arrowX: 12 });

  const emojis = [
    "😀","😃","😄","😁","😅","😂","🤣","😊","😇","🙂",
    "🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋",
    "😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩","🥳",
    "👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👈","👉",
    "👆","👇","☝️","👋","🤚","🖐️","✋","🖖","👏","🙌",
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💖","💔",
    "💻","🖥️","⌨️","🖱️",,"🧠","🔌","🔗","⚙️","💿","💾",
    "💯","⭐","🌟","💫","✨","🎉","🎁","🔥","👩‍💻","👨‍💻"
  ];

  // Size hints for positioning; actual DOM may differ a bit, we clamp anyway
  const PICKER_W = 360; // fits 10 cols of 32px + gaps + padding
  const PICKER_H = 360; // ~8 rows + header + padding
  const GAP = 8;

  const computePosition = () => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const bodyW = window.innerWidth;
    const bodyH = window.innerHeight;

    // Default: ABOVE the button, right-aligned
    // Center the popup horizontally over the button
let left = rect.left + rect.width / 2 - PICKER_W / 2;
let top = rect.top - PICKER_H - GAP;

// Clamp horizontally to viewport
afterClamp: {
  const minL = 8;
  const maxL = bodyW - PICKER_W - 8;
  if (left < minL) left = minL;
  if (left > maxL) left = maxL;
}

// Compute arrow x-position (in popup local coords)
let arrowX = rect.left + rect.width / 2 - left;
// keep arrow within the popup bounds (avoid clipping)
arrowX = Math.min(Math.max(arrowX, 12), PICKER_W - 12);

    if (!forceAbove) {
      // Optional behavior: pick the side with more space
      const spaceBelow = bodyH - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow > spaceAbove && spaceBelow > PICKER_H + GAP) {
        top = rect.bottom + GAP; // place below
      }
    }

    // Clamp to viewport
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Click outside (across portal)
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
      className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-[360px] select-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Pick an emoji</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100"
          aria-label="Close emoji picker"
        >
          ✕
        </button>
      </div>

      <div className="relative">
  {/* Arrow pointing to the button (positioned under popup) */}
  <div
    className="absolute -bottom-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200"
    style={{ left: pos.arrowX }}
  />
</div>

      <div className="mt-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
        {emojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="inline-flex items-center justify-center w-8 h-8 text-xl hover:bg-gray-100 rounded transition-colors"
            aria-label={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  return createPortal(popup, document.body);
};

export function DirectMessageChat({ dmId, currentUserId, onBack }: DirectMessageChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [dmData, setDmData] = useState<DmResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const smileyAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDmChat = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dm, dmMessages, usersData] = await Promise.all([
          dmService.getDm(dmId),
          MessageService.getDmMessages(dmId, { limit: 50 }),
          userService.getAllUsers(),
        ]);
        setDmData(dm);
        setMessages(dmMessages);
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
        console.error("Error loading DM chat:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDmChat();
  }, [dmId]);

  // Keep your close-on-outside-click behavior (portal also guards itself)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker) {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-emoji-picker]")) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const request: MessageCreateRequest = {
        senderUserId: currentUserId,
        content: message.trim(),
        contentType: "TEXT",
      };
      const newMessage = await MessageService.sendDmMessage(dmId, request);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserById = (userId: string) => users.find((user) => user.id === userId);

  const getOtherUser = () => {
    if (!dmData) return null;
    return dmData.participants.find((p) => p.userId !== currentUserId);
  };

  const getDisplayName = () => {
    if (!dmData) return "Loading...";
    if (dmData.group) {
      return dmData.title || `Group Chat (${dmData.participants.length} members)`;
    }
    const otherUser = getOtherUser();
    if (otherUser) {
      const user = getUserById(otherUser.userId);
      return user?.displayName || user?.username || "Unknown User";
    }
    return "Direct Message";
  };

  const getSenderName = (senderUserId: string): string => {
    if (senderUserId === currentUserId) return "You";
    const user = getUserById(senderUserId);
    return user?.displayName || user?.username || "Unknown User";
  };

  const getStatus = () => "online";

  const formatMessageTime = (createdAt: string): string =>
    new Date(createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-3">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dmData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="relative">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-base font-semibold">
              {getDisplayName()
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
              getStatus() === "online"
                ? "bg-green-500"
                : getStatus() === "away"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{getDisplayName()}</h3>
          <p className="text-base text-muted-foreground capitalize">{getStatus()}</p>
        </div>

        <Button variant="ghost" size="sm">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderUserId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                  {dmData.group && !isOwn && (
                    <p className="text-sm font-medium text-muted-foreground mb-1 px-1">
                      {getSenderName(msg.senderUserId)}
                    </p>
                  )}

                  <div
                    className={`p-4 rounded-lg ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-base leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 px-1">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="px-6 py-6 border-t border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${getDisplayName()}...`}
              className="pr-12 text-base py-3"
            />

            {/* Smiley anchor (used for portal positioning) */}
            <div
              ref={smileyAnchorRef}
              data-emoji-picker
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <div
                onClick={() => setShowEmojiPicker((s) => !s)}
                className={`p-1.5 cursor-pointer rounded hover:bg-gray-100 transition-colors ${
                  showEmojiPicker ? "bg-gray-100" : ""
                }`}
                aria-label="Open emoji picker"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <Button onClick={handleSendMessage} disabled={!message.trim()} size="sm" className="px-4 py-3">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* ✅ Portal-based picker rendered ABOVE the button and never clipped */}
      {showEmojiPicker && (
        <SimpleEmojiPicker
          anchorRef={smileyAnchorRef}
          onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)}
          onClose={() => setShowEmojiPicker(false)}
          forceAbove
        />
      )}
    </div>
  );
}
