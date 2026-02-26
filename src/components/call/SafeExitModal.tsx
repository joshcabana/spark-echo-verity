import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SafeExitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SafeExitModal = ({ open, onClose, onConfirm }: SafeExitModalProps) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-background/85 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-destructive/70" />
              <h3 className="font-serif text-lg text-foreground">Leave this call?</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            You'll be returned to the lobby. Neither party will know who the other was — your anonymity is preserved completely.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
              Stay
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              onClick={onConfirm}
            >
              Leave call
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SafeExitModal;
