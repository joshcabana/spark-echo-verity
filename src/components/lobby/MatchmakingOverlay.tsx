import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MatchmakingOverlayProps {
  open: boolean;
  roomName: string;
  dropTitle: string;
  dropId: string;
  onCancel: () => void;
}

const MatchmakingOverlay = ({ open, roomName, dropTitle, dropId, onCancel }: MatchmakingOverlayProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [open]);

  // Poll for match every 2 seconds
  useEffect(() => {
    if (!open || !user || !dropId) return;

    const poll = setInterval(async () => {
      const { data: queueEntry } = await supabase
        .from("matchmaking_queue")
        .select("call_id, status")
        .eq("user_id", user.id)
        .eq("drop_id", dropId)
        .maybeSingle();

      if (queueEntry?.call_id && queueEntry.status === "matched") {
        const { data: call } = await supabase
          .from("calls")
          .select("id, agora_channel")
          .eq("id", queueEntry.call_id)
          .single();

        if (call) {
          clearInterval(poll);
          onCancel(); // close overlay
          navigate(`/call/${call.id}?channel=${encodeURIComponent(call.agora_channel || "")}`);
        }
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [open, user, dropId, navigate, onCancel]);

  const handleLeaveQueue = async () => {
    if (user && dropId) {
      await supabase
        .from("matchmaking_queue")
        .delete()
        .eq("user_id", user.id)
        .eq("drop_id", dropId);
    }
    onCancel();
  };

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
              animate={{ scale: [1, 1.5 + ring * 0.3], opacity: [0.15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: ring * 0.5, ease: "easeOut" }}
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
            Your Drop is live…
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Matching you with someone who's here for the same reason.
          </p>
          <p className="text-xs text-muted-foreground/50 mb-1">
            {dropTitle} · {roomName}
          </p>
          <p className="text-xs text-muted-foreground/40 tabular-nums mb-3">
            {elapsed}s · Estimated wait ~45 seconds
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-primary/60">
            <Shield className="w-3 h-3" />
            <span>Anonymous until mutual spark · Safety on</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleLeaveQueue}
          className="mt-12 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          Leave queue
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchmakingOverlay;
