import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, MoreHorizontal, Flag, Ban, Archive } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockSparks, mockMessages, type ChatMessage } from "@/data/sparks";
import VoiceIntroBanner from "@/components/chat/VoiceIntroBanner";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatComposer from "@/components/chat/ChatComposer";

const Chat = () => {
  const { sparkId } = useParams<{ sparkId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [showTyping, setShowTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const spark = mockSparks.find((s) => s.id === sparkId) ?? mockSparks[0];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  const handleSend = useCallback(
    (text: string) => {
      const newMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        senderId: "me",
        text,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, newMsg]);

      // Simulate typing + reply
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        const reply: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          senderId: "them",
          text: "That sounds wonderful! I'd love to hear more about it.",
          timestamp: new Date().toISOString(),
          read: false,
        };
        setMessages((prev) => [...prev, reply]);
      }, 2500 + Math.random() * 1500);
    },
    [],
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate("/sparks")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border">
              <User className="w-4 h-4 text-muted-foreground/60" />
            </div>
            {spark.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary/70 border-2 border-background" />
            )}
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-foreground truncate">
              {spark.matchName}
            </h2>
            <p className="text-[10px] text-muted-foreground/60">
              {spark.online ? "Online" : `Last active ${spark.lastActive}`}
            </p>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-10 w-44 bg-card border border-border rounded-lg shadow-lg py-1 z-10"
              >
                {[
                  { icon: Flag, label: "Report", action: () => setMenuOpen(false) },
                  { icon: Ban, label: "Block", action: () => setMenuOpen(false) },
                  { icon: Archive, label: "Archive Spark", action: () => setMenuOpen(false) },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Voice intro banner */}
      {spark.voiceIntroAvailable && (
        <VoiceIntroBanner matchName={spark.matchName} />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} index={i} />
        ))}
        {showTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <ChatComposer onSend={handleSend} />
    </div>
  );
};

export default Chat;
