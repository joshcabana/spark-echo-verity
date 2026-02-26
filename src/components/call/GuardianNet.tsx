import { motion } from "framer-motion";
import { Shield, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GuardianNetProps {
  open: boolean;
  onClose: () => void;
}

const GuardianNet = ({ open, onClose }: GuardianNetProps) => {
  const [shared, setShared] = useState(false);

  if (!open) return null;

  const endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + 5);
  const timeStr = endTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-lg text-foreground">Guardian Net</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!shared ? (
          <>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Share a safe-call signal with a trusted contact. They'll only see:
            </p>
            <div className="bg-secondary rounded-md p-4 mb-6 text-sm text-foreground/80">
              "In Verity call until {timeStr}"
            </div>
            <p className="text-xs text-muted-foreground/50 mb-6">
              No other details are shared — not who, not what room, not anything else.
            </p>
            <Button variant="gold" size="lg" className="w-full" onClick={() => setShared(true)}>
              Share with trusted contact
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-foreground mb-2">Guardian notified</p>
            <p className="text-xs text-muted-foreground">They'll be alerted if you don't check in by {timeStr}.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GuardianNet;
