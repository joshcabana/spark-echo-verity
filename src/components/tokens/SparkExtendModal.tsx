import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SparkExtendModalProps {
  open: boolean;
  onClose: () => void;
}

const durations = [
  { days: 1, tokens: 1, label: "1 day" },
  { days: 3, tokens: 2, label: "3 days" },
  { days: 7, tokens: 4, label: "7 days" },
] as const;

const SparkExtendModal = ({ open, onClose }: SparkExtendModalProps) => {
  const [selected, setSelected] = useState(1);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Spark Extension</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Keep the conversation window open beyond the standard period. Choose how long you'd like.
          </p>

          <div className="space-y-3 mb-6">
            {durations.map((d) => (
              <button
                key={d.days}
                onClick={() => setSelected(d.days)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-300 ${
                  selected === d.days
                    ? "border-primary/30 bg-primary/[0.04]"
                    : "border-border bg-transparent hover:border-primary/15"
                }`}
              >
                <span className="text-sm text-foreground">{d.label}</span>
                <span className="text-xs text-muted-foreground">
                  {d.tokens} {d.tokens === 1 ? "token" : "tokens"}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground/40 text-center mb-4">
            Free daily extension included with Verity Pass
          </p>

          <Button variant="gold" size="lg" className="w-full" onClick={onClose}>
            Extend spark
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SparkExtendModal;
