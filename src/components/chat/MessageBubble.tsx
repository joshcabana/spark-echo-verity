import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

interface MessageData {
  id: string;
  sender_id: string;
  content: string | null;
  created_at: string;
  is_read: boolean | null;
}

interface MessageBubbleProps {
  message: MessageData;
  currentUserId: string;
  index: number;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const MessageBubble = ({ message, currentUserId, index }: MessageBubbleProps) => {
  const isMe = message.sender_id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
          isMe
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-secondary text-foreground rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
          <span className={`text-[10px] ${isMe ? "text-primary-foreground/50" : "text-muted-foreground/50"}`}>
            {formatTime(message.created_at)}
          </span>
          {isMe && (
            <CheckCheck className={`w-3 h-3 ${message.is_read ? "text-primary-foreground/70" : "text-primary-foreground/30"}`} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
