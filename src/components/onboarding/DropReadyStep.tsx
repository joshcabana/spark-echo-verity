import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";

interface DropReadyStepProps {
  onComplete: (rsvpdDropId?: string) => void;
}

interface Drop {
  id: string;
  title: string;
  scheduled_at: string;
  rooms: { name: string } | null;
}

const DropReadyStep = ({ onComplete }: DropReadyStepProps) => {
  const { user } = useAuth();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [selectedDrop, setSelectedDrop] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("drops")
      .select("id, title, scheduled_at, rooms(name)")
      .eq("status", "upcoming")
      .order("scheduled_at", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setDrops(data as unknown as Drop[]);
      });
  }, []);

  const handleRsvpAndGo = async () => {
    if (!user || !selectedDrop) {
      onComplete();
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("drop_rsvps")
        .insert({ drop_id: selectedDrop, user_id: user.id });
      if (error && !error.message.includes("duplicate")) throw error;
      toast.success("RSVP confirmed!");
      onComplete(selectedDrop);
    } catch {
      toast.error("Failed to RSVP. You can do it from the lobby.");
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6 max-w-sm mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
        You're verified.
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Pick your first Drop and get matched when it goes live.
      </p>

      {drops.length > 0 ? (
        <div className="space-y-3 w-full mb-8">
          {drops.map((drop) => (
            <button
              key={drop.id}
              onClick={() => setSelectedDrop(drop.id === selectedDrop ? null : drop.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedDrop === drop.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {drop.rooms?.name && (
                <span className="text-[10px] uppercase tracking-luxury text-primary/80 block mb-1">
                  {drop.rooms.name}
                </span>
              )}
              <p className="text-sm font-medium text-foreground">{drop.title}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(drop.scheduled_at), "EEE d MMM · h:mm a")}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-8">
          No Drops scheduled yet — check the lobby soon.
        </p>
      )}

      <div className="w-full space-y-3">
        <Button
          variant="gold"
          size="lg"
          onClick={handleRsvpAndGo}
          disabled={loading}
          className="w-full group"
        >
          {selectedDrop ? "RSVP & go to lobby" : "Go to lobby"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {selectedDrop && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => onComplete()}
            className="w-full text-muted-foreground"
          >
            Skip — I'll browse Drops
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DropReadyStep;
