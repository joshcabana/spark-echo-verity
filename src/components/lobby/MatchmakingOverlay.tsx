import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface MatchmakingOverlayProps {
  open: boolean;
  roomName: string;
  onCancel: () => void;
}

const MatchmakingOverlay = ({ open, roomName, onCancel }: MatchmakingOverlayProps) => {
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [open]);

  // Simulate finding a match after 4–7 seconds
  useEffect(() => {
    if (!open) return;
    const delay = 4000 + Math.random() * 3000;
    const t = setTimeout(() => navigate("/call"), delay);
    return () => clearTimeout(t);
  }, [open, navigate]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6"
      >
        {/* Animated rings */}
        <div className="relative mb-12">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              animate={{
                scale: [1, 1.5 + ring * 0.3],
                opacity: [0.15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: ring * 0.5,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border border-primary/20"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-sm"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
            Finding your match…
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Connecting you to someone who's here for the same reason.
          </p>
          <p className="text-xs text-muted-foreground/50 mb-1">
            Room: {roomName}
          </p>
          <p className="text-xs text-muted-foreground/40 tabular-nums">
            {elapsed}s · Estimated wait ~45 seconds
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onCancel}
          className="mt-12 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Leave queue
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchmakingOverlay;
