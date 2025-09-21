import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Hash,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageInput } from "./ui/MessageInput";
import { useAuth } from "../hooks/useAuth";
import { Client } from "@stomp/stompjs";

import { useTheme } from "./ThemeProvider";
import { toast } from 'sonner';
import '../styles/bot.css';
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

// ✅ Correct single function declaration
export function DirectoryView({ 
  directory, 
  onBack, 
  availableDirectories = [], 
  onSelectDirectory 
}: DirectoryViewProps) {
  const { theme } = useTheme();
  
  // ✅ All your state declarations can stay
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Load channel members
  useEffect(() => {
    if (!directory?.id) return;

    fetch(`/api/channels/${directory.id}/members`)
      .then((res) => res.json())
      .then((members) => {
        const map: Record<string, any> = {};
        members.forEach((m: any) => {
          map[m.user.id] = m.user;
        });
        setUserMap(map);
      })
      .catch(() => setUserMap({}));
  }, [directory.id]);

  // Load initial channel messages
  useEffect(() => {
    if (!directory?.id) return;

    fetch(`/api/channels/${directory.id}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, [directory.id]);

  // WebSocket subscription
  useEffect(() => {
    if (!directory?.id) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws", // <— no SockJS
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/channels/${directory.id}`, (frame) => {
        const payload = JSON.parse(frame.body);
        if (payload.type === "created") {
          setMessages((prev) => [...prev, payload.message]);
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
    return () => {
      client.deactivate();
    };
  }, [directory.id]);

  // Fallback fetch for unknown senders
  const fetchUserIfMissing = async (userId: string) => {
    if (!userId || userMap[userId]) return;
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const fetchedUser = await res.json();
        setUserMap((prev) => ({ ...prev, [fetchedUser.id]: fetchedUser }));
      }
    } catch (e) {
      console.error("Failed to fetch user", e);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: any = {
      id: Date.now().toString(),
      content: inputMessage,
      senderUserId: currentUser?.id,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    fetch(`/api/channels/${directory.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: inputMessage,
        senderUserId: currentUser?.id,
      }),
    }).then(() => {
      setMessage("");
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
      toast.error("Failed to send message");
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 sm:p-4 border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm sm:text-base truncate">
                  {directory.name}
                </h3>
                {directory.isPrivate && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Private
                  </Badge>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{directory.memberCount} members</span>
                <span>•</span>
                <span className="truncate">{directory.description}</span>
              </div>
            </div>
          </div>
          {availableDirectories.length > 0 && (
            <div className="hidden sm:block w-48">
              <Select
                value={directory.id}
                onValueChange={value => onSelectDirectory?.(value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {availableDirectories.map(dir => (
                    <SelectItem key={dir.id} value={dir.id}>
                      {dir.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {availableDirectories.length > 0 && (
        <div className="sm:hidden px-3 py-2 border-b border-border">
          <Select
            value={directory.id}
            onValueChange={value => onSelectDirectory?.(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {availableDirectories.map(dir => (
                <SelectItem key={dir.id} value={dir.id}>
                  {dir.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const sender = userMap[msg.senderUserId];
              if (!sender) fetchUserIfMissing(msg.senderUserId);
              const isOwn = msg.senderUserId === currentUser?.id;

              return (
                <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                    {/* Show sender name for other people's messages */}
                    {!isOwn && (
                      <p className="text-sm font-medium text-muted-foreground mb-1 px-1">
                        {sender ? sender.displayName || sender.username : msg.senderUserId}
                      </p>
                    )}

                    <div
                      className={`p-4 rounded-lg relative transition-all duration-200 hover:shadow-md ${
                        isOwn
                          ? // ✅ Own messages: Black background in light mode, white background in dark mode
                            theme === 'dark' 
                              ? "bg-white text-black shadow-md border border-gray-200/80" 
                              : "bg-black text-white shadow-md border border-gray-800/80"
                          : // ✅ Other messages: Styled differently
                            theme === 'dark'
                              ? "bg-gray-800 text-gray-100 shadow-md border border-gray-700/50"
                              : "bg-gray-50 text-gray-900 shadow-md border border-gray-200/80 hover:bg-gray-100"
                      }`}
                      style={{
                        boxShadow: isOwn 
                          ? // ✅ Simple shadows for own messages
                            theme === 'dark' 
                              ? '0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
                              : '0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
                          : // ✅ Shadows for other messages
                            theme === 'dark'
                              ? '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
                              : '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <p 
                        className="text-base leading-relaxed"
                        style={{
                          color: isOwn 
                            ? theme === 'dark' ? '#000000' : '#ffffff'  // ✅ Force proper contrast
                            : theme === 'dark' ? '#f3f4f6' : '#111827'
                        }}
                      >
                        {msg.content}
                      </p>
                      
                      {/* ✅ Status indicator for own messages */}
                      {isOwn && (
                        <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full opacity-60 ${
                          theme === 'dark' ? 'bg-black/30' : 'bg-white/30'
                        }`}></div>
                      )}
                    </div>
                    
                    <p className={`text-sm mt-2 px-1 transition-colors ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        message={inputMessage}
        onMessageChange={setInputMessage}
        onSendMessage={sendMessage}
        placeholder={`Message #${directory.name}...`}
        disabled={isLoading}
        className=""
      />
    </div>
  );
}
