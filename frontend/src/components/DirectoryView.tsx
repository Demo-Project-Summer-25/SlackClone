import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Hash,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useAuth } from "../hooks/useAuth";
import { Client } from "@stomp/stompjs";
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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [userMap, setUserMap] = useState<Record<string, any>>({});
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

  const handleSendMessage = () => {
    if (message.trim() && currentUser?.id) {
      fetch(`/api/channels/${directory.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          senderUserId: currentUser.id,
        }),
      }).then(() => {
        setMessage("");
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => {
          const sender = userMap[msg.senderUserId];
          if (!sender) fetchUserIfMissing(msg.senderUserId);

          return (
            <div key={msg.id} className="flex gap-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shrink-0">
                <span className="text-secondary-foreground text-sm">
                  {sender
                    ? sender.displayName?.[0] || sender.username?.[0]
                    : "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {sender
                      ? sender.displayName || sender.username
                      : msg.senderUserId}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg ${msg.senderUserId === currentUser?.id
                      ? "bg-primary text-primary-foreground ml-8"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-2 sm:p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${directory.name}...`}
            className="pr-10 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
