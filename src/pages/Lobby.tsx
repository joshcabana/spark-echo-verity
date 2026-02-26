import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { rooms, getSuggestedRoom } from "@/data/rooms";
import RoomCard from "@/components/lobby/RoomCard";
import SuggestionPill from "@/components/lobby/SuggestionPill";

const Lobby = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const suggested = getSuggestedRoom();

  const handleSelect = (roomId: string) => {
    setSelectedRoom((prev) => (prev === roomId ? null : roomId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-serif text-lg text-foreground">Verity</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-primary/60" />
            <span>AI safety active</span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-6 py-10 md:py-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            Choose your room.
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Each room curates the energy. Enter one that fits your mood — you'll be matched with someone who chose the same.
          </p>
        </motion.div>

        {/* Suggestion pill */}
        <div className="mb-8">
          <SuggestionPill room={suggested} onSelect={handleSelect} />
        </div>

        {/* Room grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              index={i}
              isSelected={selectedRoom === room.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 text-center text-xs text-muted-foreground/50 tracking-wide"
        >
          All calls are anonymous · AI-moderated in real time · Nothing is stored
        </motion.p>
      </main>
    </div>
  );
};

export default Lobby;
