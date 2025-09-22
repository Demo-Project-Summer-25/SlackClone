import React, { useEffect, useState } from "react";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, Hash, Users, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface DirectoryViewProps {
  directory: {
    name: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
  };
  onBack: () => void;
}

export function DirectoryView({ directory, onBack }: DirectoryViewProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/channels/${directory.name}/messages`)
      .then(res => res.json())
      .then(setMessages)
      .catch(() => {});
  }, [directory.name]);

  const handleSendMessage = () => {
    if (message.trim()) {
      fetch(`/api/channels/${directory.name}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      })
        .then(() => {
          setMessage("");
          // Optionally re-fetch messages or optimistically update
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 sm:p-2 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm sm:text-base truncate">{directory.name}</h3>
                {directory.isPrivate && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Private
                  </Badge>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{directory.memberCount} members</span>
                </div>
                <span>•</span>
                <span className="truncate">{directory.description}</span>
              </div>
              <div className="flex sm:hidden items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{directory.memberCount}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex gap-1">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex sm:hidden">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shrink-0">
              <span className="text-secondary-foreground text-sm">
                {msg.sender.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium">{msg.sender}</span>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <div className={`p-3 rounded-lg ${
                msg.isOwn
                  ? "bg-primary text-primary-foreground ml-8"
                  : "bg-muted text-muted-foreground"
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-2 sm:p-4 border-t border-border">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${directory.name}...`}
              className="pr-10 sm:pr-12 text-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 hidden sm:flex"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
            className="shrink-0"
          >
            <Send className="w-4 h-4" /> 
          </Button> 
        </div>
      </div>
    </div>
  );
}