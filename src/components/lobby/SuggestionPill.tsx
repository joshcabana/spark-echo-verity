import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Room } from "@/data/rooms";

interface SuggestionPillProps {
  room: Room;
  onSelect: (roomId: string) => void;
}

const SuggestionPill = ({ room, onSelect }: SuggestionPillProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onClick={() => onSelect(room.id)}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-500 group"
    >
      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-gold" />
      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
        Suggested for you:
      </span>
      <span className="text-sm font-medium text-primary">
        {room.name}
      </span>
    </motion.button>
  );
};

export default SuggestionPill;
