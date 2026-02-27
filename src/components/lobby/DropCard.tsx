import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Zap } from "lucide-react";
import DropCountdown from "./DropCountdown";
import { format } from "date-fns";

interface DropCardProps {
  drop: {
    id: string;
    title: string;
    description: string | null;
    scheduled_at: string;
    duration_minutes: number;
    max_capacity: number;
    is_friendfluence: boolean;
    status: string;
    rooms?: { name: string } | null;
  };
  rsvpCount: number;
  isRsvpd: boolean;
  onRsvp: (dropId: string) => void;
  onCancel: (dropId: string) => void;
  index: number;
}

const DropCard = ({ drop, rsvpCount, isRsvpd, onRsvp, onCancel, index }: DropCardProps) => {
  const isLive = drop.status === "live";
  const capacityPercent = Math.min((rsvpCount / drop.max_capacity) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          {drop.rooms?.name && (
            <span className="text-[10px] uppercase tracking-luxury text-primary/80 mb-1 block">
              {drop.rooms.name}
            </span>
          )}
          <h3 className="font-serif text-lg text-foreground leading-snug">{drop.title}</h3>
        </div>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-xs text-primary">
            <Zap className="w-3 h-3 fill-primary" />
            Live
          </span>
        ) : (
          <DropCountdown scheduledAt={drop.scheduled_at} />
        )}
      </div>

      {/* Description */}
      {drop.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {drop.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span>{format(new Date(drop.scheduled_at), "EEE d MMM · h:mm a")}</span>
        <span>{drop.duration_minutes} min</span>
      </div>

      {/* Capacity bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {rsvpCount} / {drop.max_capacity}
          </span>
          {drop.is_friendfluence && (
            <span className="flex items-center gap-1 text-primary/80">
              <UserPlus className="w-3 h-3" />
              Bring a friend
            </span>
          )}
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${capacityPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Actions */}
      {isRsvpd ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-muted-foreground"
            onClick={() => onCancel(drop.id)}
          >
            Cancel RSVP
          </Button>
          {drop.is_friendfluence && (
            <Button variant="outline" size="sm" className="text-primary border-primary/20">
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              Invite
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="gold"
          size="sm"
          className="w-full group"
          onClick={() => onRsvp(drop.id)}
        >
          RSVP
        </Button>
      )}
    </motion.div>
  );
};

export default DropCard;
