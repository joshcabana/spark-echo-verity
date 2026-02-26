import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LobbyHeaderProps {
  suggestedRoomName: string | null;
  onSuggestionClick: () => void;
}

const LobbyHeader = ({ suggestedRoomName, onSuggestionClick }: LobbyHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-8"
    >
      <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
        Find Your Room
      </h1>
      <p className="text-muted-foreground max-w-lg leading-relaxed">
        Each room curates the energy. Step into one that fits your mood —
        you'll be matched with someone who chose the same.
      </p>

      {/* Intelligent suggestion pill */}
      {suggestedRoomName && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={onSuggestionClick}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/35 transition-all duration-500 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-gold" />
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Best match for you
          </span>
          <span className="text-xs font-medium text-primary">
            {suggestedRoomName}
          </span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default LobbyHeader;
