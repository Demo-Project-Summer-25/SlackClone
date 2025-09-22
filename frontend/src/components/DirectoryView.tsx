import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Hash,
  Users,
  ArrowDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageInput } from "./ui/MessageInput";
import { useAuth } from "../hooks/useAuth";
import { Client } from "@stomp/stompjs";
import { useTheme } from "./ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DirectoryViewProps {
  directory: {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  };
  onBack: () => void;
  availableDirectories?: {
    id: string;
    name: string;
  }[];
  onSelectDirectory?: (id: string) => void;
}

export function DirectoryView({
  directory,
  onBack,
  availableDirectories = [],
  onSelectDirectory,
}: DirectoryViewProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNewMessageBtn, setShowNewMessageBtn] = useState(false);

  // track whether user is scrolled to bottom
  const isAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    return container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
  };

  // Load members
  useEffect(() => {
    if (!directory?.id) return;
    fetch(`/api/channels/${directory.id}/members`)
      .then((res) => res.json())
      .then((members) => {
        const map: Record<string, any> = {};
        members.forEach((m: any) => (map[m.user.id] = m.user));
        setUserMap(map);
      });
  }, [directory.id]);

  // Load initial messages
  useEffect(() => {
    if (!directory?.id) return;
    fetch(`/api/channels/${directory.id}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []));
  }, [directory.id]);

  // Subscribe to WebSocket
  useEffect(() => {
    if (!directory?.id) return;
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/channels/${directory.id}`, (frame) => {
        const payload = JSON.parse(frame.body);
        if (payload.type === "created") {
          setMessages((prev) => {
            // If user at bottom → auto scroll, else show button
            if (isAtBottom()) {
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
              return [...prev, payload.message];
            } else {
              setShowNewMessageBtn(true);
              return [...prev, payload.message];
            }
          });
        } else if (payload.type === "updated") {
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.message.id ? payload.message : m))
          );
        } else if (payload.type === "deleted") {
          setMessages((prev) => prev.filter((m) => m.id !== payload.message.id));
        }
      });
    };

    client.activate();
    return () => client.deactivate();
  }, [directory.id]);

  // Scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (isAtBottom()) setShowNewMessageBtn(false);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    setInputMessage("");
    setIsLoading(true);

    fetch(`/api/channels/${directory.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: inputMessage, senderUserId: currentUser?.id }),
    }).finally(() => setIsLoading(false));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 sm:p-4 border-b border-border flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-medium">{directory.name}</h3>
        <div className="ml-auto flex gap-2">
          {availableDirectories.length > 0 && (
            <Select value={directory.id} onValueChange={(v) => onSelectDirectory?.(v)}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                {availableDirectories.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto px-6 py-4 space-y-4">
        {messages.map((msg) => {
          const sender = userMap[msg.senderUserId];
          const isOwn = msg.senderUserId === currentUser?.id;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[70%]">
                {!isOwn && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {sender ? sender.displayName || sender.username : msg.senderUserId}
                  </p>
                )}
                <div className={`p-3 rounded-lg ${isOwn ? "bg-black text-white" : "bg-gray-200"}`}>
                  {msg.content}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {msg.createdAt &&
                    new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* New Message Button */}
      {showNewMessageBtn && (
        <div className="px-4 pb-2">
          <Button
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              setShowNewMessageBtn(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground"
          >
            <ArrowDown className="w-4 h-4" />
            New Message
          </Button>
        </div>
      )}

      {/* Input */}
      <MessageInput
        message={inputMessage}
        onMessageChange={setInputMessage}
        onSendMessage={sendMessage}
        placeholder={`Message #${directory.name}...`}
        disabled={isLoading}
      />
    </div>
  );
}
