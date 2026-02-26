import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseSuccessProps {
  item: string;
  onDismiss: () => void;
}

const PurchaseSuccess = ({ item, onDismiss }: PurchaseSuccessProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-background flex flex-col items-center justify-center px-6"
    >
      {/* Animated sparkle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1 + ring * 0.35, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: ring * 0.25 }}
            className="absolute inset-0 rounded-full border border-primary/15"
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="font-serif text-2xl text-foreground mb-2">You're all set.</h2>
        <p className="text-sm text-muted-foreground mb-1">
          {item} successfully added.
        </p>
        <p className="text-xs text-muted-foreground/50 mb-8">
          Enjoy your time on Verity.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="gold" size="lg" onClick={onDismiss}>
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseSuccess;
