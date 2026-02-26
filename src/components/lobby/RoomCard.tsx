import { motion } from "framer-motion";
import { Users, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/data/rooms";

interface RoomCardProps {
  room: Room;
  index: number;
  isSelected: boolean;
  onSelect: (roomId: string) => void;
}

const RoomCard = ({ room, index, isSelected, onSelect }: RoomCardProps) => {
  const occupancyPct = Math.round((room.occupancy / room.maxOccupancy) * 100);
  const Icon = room.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={() => onSelect(room.id)}
      className={`relative group cursor-pointer rounded-lg border p-6 transition-all duration-500 ${
        isSelected
          ? "border-primary/40 bg-primary/5 shadow-[0_0_50px_hsl(43_72%_55%/0.08)]"
          : "border-border bg-card hover:border-primary/20 hover:bg-card/80"
      }`}
    >
      {/* Premium badge */}
      {room.premium && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-primary/70">
          <Crown className="w-3 h-3" />
          <span className="tracking-luxury uppercase">Pass</span>
        </div>
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 transition-colors duration-500 ${
        isSelected ? "bg-primary/15" : "bg-primary/8 group-hover:bg-primary/12"
      }`}>
        <Icon className="w-5 h-5 text-primary" />
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg text-foreground mb-2">{room.name}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        {room.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {room.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Occupancy */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {room.occupancy} online
            </span>
          </div>
          {/* Occupancy bar */}
          <div className="w-16 h-1 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${occupancyPct}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className="h-full rounded-full bg-primary/50"
            />
          </div>
        </div>
        {/* Active indicator */}
        {room.activeNow && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
        )}
      </div>

      {/* Peak hours */}
      <p className="text-xs text-muted-foreground/50 mt-3">
        Peak: {room.peakHours}
      </p>

      {/* Expanded enter button */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-5 pt-5 border-t border-border"
        >
          <Button variant="gold" size="lg" className="w-full group/btn">
            Enter {room.name}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RoomCard;
