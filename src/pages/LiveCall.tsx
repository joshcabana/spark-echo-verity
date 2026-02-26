import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, LogOut, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CallCountdown from "@/components/call/CallCountdown";
import SparkPassButtons from "@/components/call/SparkPassButtons";
import GuardianNet from "@/components/call/GuardianNet";
import SparkReflection from "@/components/call/SparkReflection";
import VoiceIntro from "@/components/call/VoiceIntro";
import MutualSparkReveal from "@/components/call/MutualSparkReveal";

type CallPhase =
  | "connecting"
  | "live"
  | "deciding"
  | "waiting"
  | "mutual-spark"
  | "no-spark"
  | "reflection"
  | "voice-intro"
  | "complete";

const LiveCall = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<CallPhase>("connecting");
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [guardianOpen, setGuardianOpen] = useState(false);
  const [myChoice, setMyChoice] = useState<"spark" | "pass" | null>(null);

  // Simulate connection
  useEffect(() => {
    const t = setTimeout(() => setPhase("live"), 2500);
    return () => clearTimeout(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== "live") return;
    if (secondsLeft <= 0) {
      setPhase("deciding");
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, secondsLeft]);

  const handleChoice = useCallback((choice: "spark" | "pass") => {
    setMyChoice(choice);
    setPhase("waiting");
    // Simulate partner's response after 2s
    setTimeout(() => {
      // 60% chance of mutual spark for demo
      const partnerSparked = choice === "spark" && Math.random() > 0.4;
      setPhase(partnerSparked ? "mutual-spark" : "no-spark");
    }, 2000);
  }, []);

  const handleSafeExit = () => {
    navigate("/lobby");
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <AnimatePresence mode="wait">
        {/* ─── CONNECTING ─── */}
        {phase === "connecting" && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6"
          >
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary animate-pulse-gold" />
            </div>
            <div className="text-center">
              <p className="font-serif text-xl text-foreground mb-2">Finding your match…</p>
              <p className="text-sm text-muted-foreground">Anonymous connection loading</p>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── LIVE CALL ─── */}
        {(phase === "live" || phase === "deciding") && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-primary/60" />
                <span>AI safety active</span>
              </div>
              <CallCountdown seconds={secondsLeft} total={45} />
              <button
                onClick={() => setGuardianOpen(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guardian</span>
              </button>
            </div>

            {/* Video area (simulated) */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Simulated anonymous silhouette */}
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-secondary/50 border border-border flex items-center justify-center">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-secondary border border-border/50" />
              </div>
              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/20"
              />
            </div>

            {/* Bottom controls */}
            <div className="px-6 pb-8 pt-4">
              {phase === "deciding" ? (
                <SparkPassButtons onChoice={handleChoice} />
              ) : (
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSafeExit}
                    className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                  >
                    <LogOut className="w-4 h-4" />
                    Safe Exit
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── WAITING ─── */}
        {phase === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6"
          >
            <p className="font-serif text-xl text-foreground">
              {myChoice === "spark" ? "Spark sent." : "Choice recorded."}
            </p>
            <p className="text-sm text-muted-foreground">Waiting for their decision…</p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── MUTUAL SPARK ─── */}
        {phase === "mutual-spark" && (
          <MutualSparkReveal onContinue={() => setPhase("reflection")} />
        )}

        {/* ─── NO SPARK ─── */}
        {phase === "no-spark" && (
          <motion.div
            key="no-spark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
          >
            <p className="font-serif text-2xl text-foreground text-center">
              No spark this time.
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Neither party knows who chose what. That's the Verity promise — dignity always.
            </p>
            <Button variant="gold-outline" size="lg" onClick={() => setPhase("reflection")}>
              View Spark Reflection
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/lobby")} className="text-muted-foreground">
              Return to lobby
            </Button>
          </motion.div>
        )}

        {/* ─── SPARK REFLECTION ─── */}
        {phase === "reflection" && (
          <SparkReflection
            wasMutual={myChoice === "spark"}
            onContinue={() => {
              if (myChoice === "spark") {
                setPhase("voice-intro");
              } else {
                setPhase("complete");
              }
            }}
          />
        )}

        {/* ─── VOICE INTRO ─── */}
        {phase === "voice-intro" && (
          <VoiceIntro onComplete={() => setPhase("complete")} />
        )}

        {/* ─── COMPLETE ─── */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
          >
            <p className="font-serif text-2xl text-foreground text-center">
              {myChoice === "spark" ? "Connection made." : "Until next time."}
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {myChoice === "spark"
                ? "Chat is now unlocked. You'll find them in your Sparks."
                : "Every call is a chance to learn something about yourself."}
            </p>
            <div className="flex gap-3">
              <Button variant="gold" size="lg" onClick={() => navigate("/lobby")}>
                Back to lobby
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guardian Net modal */}
      <GuardianNet open={guardianOpen} onClose={() => setGuardianOpen(false)} />
    </div>
  );
};

export default LiveCall;
