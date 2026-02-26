import { motion } from "framer-motion";
import { Wifi } from "lucide-react";

interface ConnectionIndicatorProps {
  quality: "excellent" | "good" | "poor";
}

const ConnectionIndicator = ({ quality }: ConnectionIndicatorProps) => {
  const bars =
    quality === "excellent" ? 3 : quality === "good" ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex items-center gap-1.5"
    >
      <Wifi className="w-3 h-3 text-muted-foreground/50" />
      <div className="flex items-end gap-[2px]">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`w-[3px] rounded-full transition-colors duration-500 ${
              bar <= bars ? "bg-primary/60" : "bg-border"
            }`}
            style={{ height: `${bar * 4 + 2}px` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ConnectionIndicator;
