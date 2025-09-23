// import React, { useEffect, useState, useRef } from "react";
// import { ArrowLeft, MoreVertical } from "lucide-react";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { MessageInput } from "./ui/MessageInput";
// import { dmService } from "../services/dmService";
// import { MessageService } from "../services/messageService";
// import { userService } from "../services/userService";
// import { DmResponse, MessageResponse, MessageCreateRequest } from "../types/api";
// import { User } from "../types/user";
// import { useTheme } from "./ThemeProvider";

// import { Client } from "@stomp/stompjs";


// interface DirectMessageChatProps {
//   dmId: string;
//   currentUserId: string;
//   onBack: () => void;
// }

// export function DirectMessageChat({ dmId, currentUserId, onBack }: DirectMessageChatProps) {
//   const { theme } = useTheme();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<MessageResponse[]>([]);
//   const [dmData, setDmData] = useState<DmResponse | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const isDarkMode = 
//     theme === 'dark' || 
//     (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

//   useEffect(() => {
//     const loadDmChat = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [dm, dmMessages, usersData] = await Promise.all([
//           dmService.getDm(dmId),
//           MessageService.getDmMessages(dmId, { limit: 50 }),
//           userService.getAllUsers(),
//         ]);
//         setDmData(dm);

//         const sortedMessages = dmMessages.sort(
//           (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//         );
//         setMessages(sortedMessages);
//         setUsers(usersData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load chat");
//         console.error("Error loading DM chat:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadDmChat();
//   }, [dmId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;
//     try {
//       const request: MessageCreateRequest = {
//         senderUserId: currentUserId,
//         content: message.trim(),
//         contentType: "TEXT",
//       };
//       const newMessage = await MessageService.sendDmMessage(dmId, request);
//       setMessages((prev) => [...prev, newMessage]);
//       setMessage("");
//     } catch (err) {
//       console.error("Failed to send message:", err);
//       setError("Failed to send message");
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const getUserById = (userId: string) => users.find((user) => user.id === userId);

//   const getOtherUser = () => {
//     if (!dmData) return null;
//     return dmData.participants.find((p) => p.userId !== currentUserId);
//   };

//   const getDisplayName = () => {
//     if (!dmData) return "Loading...";
//     if (dmData.group) {
//       return dmData.title || `Group Chat (${dmData.participants.length} members)`;
//     }
//     const otherUser = getOtherUser();
//     if (otherUser) {
//       const user = getUserById(otherUser.userId);
//       return user?.displayName || user?.username || "Unknown User";
//     }
//     return "Direct Message";
//   };

//   const getSenderName = (senderUserId: string): string => {
//     if (senderUserId === currentUserId) return "You";
//     const user = getUserById(senderUserId);
//     return user?.displayName || user?.username || "Unknown User";
//   };

//   const formatMessageTime = (createdAt: string): string =>
//     new Date(createdAt).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <p className="text-lg">Loading conversation...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 text-lg">Error: {error}</p>
//           <Button onClick={() => window.location.reload()} className="mt-3">
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (!dmData) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <p className="text-lg">Conversation not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b border-border flex items-center gap-4">
//         <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
//           <ArrowLeft className="w-5 h-5" />
//         </Button>

//         <div className="relative">
//           <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
//             <span className="text-primary-foreground text-base font-semibold">
//               {getDisplayName()
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")
//                 .toUpperCase()}
//             </span>
//           </div>
//           <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background bg-green-500" />
//         </div>

//         <div className="flex-1">
//           <h3 className="font-semibold text-lg">{getDisplayName()}</h3>
//           <p className="text-base text-muted-foreground">Online</p>
//         </div>

//         <Button variant="ghost" size="sm">
//           <MoreVertical className="w-5 h-5" />
//         </Button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-auto px-6 py-8 space-y-6">
//         {messages.length === 0 ? (
//           <div className="text-center text-muted-foreground py-12">
//             <p className="text-lg">No messages yet. Start the conversation!</p>
//           </div>
//         ) : (
//           <>
//             {messages.map((msg) => {
//               const isOwn = msg.senderUserId === currentUserId;
              
//               return (
//                 <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
//                   <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
//                     {dmData.group && !isOwn && (
//                       <p className="text-sm font-medium text-muted-foreground mb-1 px-1">
//                         {getSenderName(msg.senderUserId)}
//                       </p>
//                     )}

//                     <div
//                       className={`p-4 rounded-lg relative transition-all duration-200 hover:shadow-md ${
//                         isOwn
//                           ? // ✅ Own messages: Black background in light mode, white background in dark mode
//                             isDarkMode 
//                               ? "bg-white text-black shadow-md border border-gray-200/80" 
//                               : "bg-black text-white shadow-md border border-gray-800/80"
//                           : // ✅ Other messages: Keep existing styling
//                             isDarkMode
//                               ? "bg-gray-800 text-gray-100 shadow-md border border-gray-700/50"
//                               : "bg-gray-50 text-gray-900 shadow-md border border-gray-200/80 hover:bg-gray-100"
//                       }`}
//                       style={{
//                         // ✅ Removed gradient glow, using simple shadows
//                         boxShadow: isOwn 
//                           ? // ✅ Simple shadows for own messages (no blue glow)
//                             isDarkMode 
//                               ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
//                               : '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
//                           : // ✅ Keep existing shadows for other messages
//                             isDarkMode
//                               ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
//                               : '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
//                       }}
//                     >
//                       {/* ✅ Ensure text color is explicitly set based on background */}
//                       <p 
//                         className="text-base leading-relaxed"
//                         style={{
//                           color: isOwn 
//                             ? isDarkMode ? '#000000' : '#ffffff'  // ✅ Force black text in dark mode, white text in light mode
//                             : isDarkMode ? '#f3f4f6' : '#111827'   // ✅ Other messages keep their colors
//                         }}
//                       >
//                         {msg.content}
//                       </p>
                      
//                       {/* ✅ Updated status indicator color for better contrast */}
//                       {isOwn && (
//                         <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full opacity-60 ${
//                           isDarkMode ? 'bg-black/30' : 'bg-white/30'
//                         }`}></div>
//                       )}
//                     </div>
                    
//                     <p className={`text-sm mt-2 px-1 transition-colors ${
//                       isDarkMode ? 'text-gray-400' : 'text-gray-500'
//                     }`}>
//                       {formatMessageTime(msg.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </div>

//       <MessageInput
//         message={message}
//         onMessageChange={setMessage}
//         onSendMessage={handleSendMessage}
//         placeholder={`Message ${getDisplayName()}...`}
//         disabled={loading}
//       />
//     </div>
//   );
// }




import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MessageInput } from "./ui/MessageInput";
import { dmService } from "../services/dmService";
import { MessageService } from "../services/messageService";
import { userService } from "../services/userService";
import { DmResponse, MessageResponse, MessageCreateRequest } from "../types/api";
import { User } from "../types/user";
import { useTheme } from "./ThemeProvider";

import { Client } from "@stomp/stompjs";

interface DirectMessageChatProps {
  dmId: string;
  currentUserId: string;
  onBack: () => void;
}

export function DirectMessageChat({ dmId, currentUserId, onBack }: DirectMessageChatProps) {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [dmData, setDmData] = useState<DmResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 🔹 Load DM data + initial messages
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

        const sortedMessages = dmMessages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
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

  // 🔹 Auto scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 WebSocket subscription (like DirectoryView)
  useEffect(() => {
    if (!dmId) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/dms/${dmId}`, (frame) => {
        const payload = JSON.parse(frame.body);

        if (payload.type === "created") {
          setMessages((prev) => [...prev, payload.message]);
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  }, [dmId]);

  // 🔹 NEW sendMessage (REST only, let WebSocket update state)
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const request: MessageCreateRequest = {
        senderUserId: currentUserId,
        content: message.trim(),
        contentType: "TEXT",
      };

      await MessageService.sendDmMessage(dmId, request); // backend broadcasts
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    }
  };

  // 🔸 OLD version (kept for reference)
  /*
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
  */

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
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background bg-green-500" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{getDisplayName()}</h3>
          <p className="text-base text-muted-foreground">Online</p>
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
          <>
            {messages.map((msg) => {
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
                      className={`p-4 rounded-lg relative transition-all duration-200 hover:shadow-md ${
                        isOwn
                          ? isDarkMode
                            ? "bg-white text-black shadow-md border border-gray-200/80"
                            : "bg-black text-white shadow-md border border-gray-800/80"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-100 shadow-md border border-gray-700/50"
                          : "bg-gray-50 text-gray-900 shadow-md border border-gray-200/80 hover:bg-gray-100"
                      }`}
                      style={{
                        boxShadow: isOwn
                          ? isDarkMode
                            ? "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)"
                            : "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)"
                          : isDarkMode
                          ? "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)"
                          : "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <p
                        className="text-base leading-relaxed"
                        style={{
                          color: isOwn
                            ? isDarkMode
                              ? "#000000"
                              : "#ffffff"
                            : isDarkMode
                            ? "#f3f4f6"
                            : "#111827",
                        }}
                      >
                        {msg.content}
                      </p>

                      {isOwn && (
                        <div
                          className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full opacity-60 ${
                            isDarkMode ? "bg-black/30" : "bg-white/30"
                          }`}
                        ></div>
                      )}
                    </div>

                    <p
                      className={`text-sm mt-2 px-1 transition-colors ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        placeholder={`Message ${getDisplayName()}...`}
        disabled={loading}
      />
    </div>
  );
}
