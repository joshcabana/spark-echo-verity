import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import { rooms, getSuggestedRoom, type Room } from "@/data/rooms";
import LobbyRoomCard from "@/components/lobby/LobbyRoomCard";
import LobbyHeader from "@/components/lobby/LobbyHeader";
import MatchmakingOverlay from "@/components/lobby/MatchmakingOverlay";
import BottomNav from "@/components/BottomNav";

const Lobby = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [matchmaking, setMatchmaking] = useState<{ active: boolean; roomName: string }>({
    active: false,
    roomName: "",
  });
  const suggested = getSuggestedRoom();
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleSelect = useCallback((roomId: string) => {
    setSelectedRoom((prev) => (prev === roomId ? null : roomId));
  }, []);

  const handleSuggestionClick = useCallback(() => {
    setSelectedRoom(suggested.id);
    // Scroll the suggested card into view
    const el = cardRefs.current.get(suggested.id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [suggested.id]);

  const handleEnterRoom = useCallback((room: Room) => {
    setMatchmaking({ active: true, roomName: room.name });
  }, []);

  const handleCancelMatchmaking = useCallback(() => {
    setMatchmaking({ active: false, roomName: "" });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-foreground">Verity</span>
            <div className="flex items-center gap-1 ml-3 text-[10px] text-muted-foreground/60">
              <Shield className="w-3 h-3 text-primary/50" />
              <span>AI safety on</span>
            </div>
          </div>
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-5 pt-8">
        <LobbyHeader
          suggestedRoomName={suggested.name}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Room cards */}
        <div className="space-y-5">
          {rooms.map((room, i) => (
            <div
              key={room.id}
              ref={(el) => {
                if (el) cardRefs.current.set(room.id, el);
              }}
            >
              <LobbyRoomCard
                room={room}
                index={i}
                isSelected={selectedRoom === room.id}
                isSuggested={suggested.id === room.id}
                onSelect={handleSelect}
                onEnter={handleEnterRoom}
              />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 mb-6 text-center text-[11px] text-muted-foreground/40 leading-relaxed"
        >
          All calls are anonymous · AI-moderated in real time · Nothing is stored
        </motion.p>
      </main>

      <BottomNav activeTab="go-live" />

      {/* Matchmaking overlay */}
      <MatchmakingOverlay
        open={matchmaking.active}
        roomName={matchmaking.roomName}
        onCancel={handleCancelMatchmaking}
      />
    </div>
  );
};

export default Lobby;
