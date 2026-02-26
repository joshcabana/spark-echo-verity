import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, UserPlus, LogOut, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CallCountdown from "@/components/call/CallCountdown";
import CallControls from "@/components/call/CallControls";
import ConnectionIndicator from "@/components/call/ConnectionIndicator";
import VideoArea from "@/components/call/VideoArea";
import SparkPassButtons from "@/components/call/SparkPassButtons";
import GuardianNet from "@/components/call/GuardianNet";
import SafeExitModal from "@/components/call/SafeExitModal";
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

const CALL_DURATION = 45;

const LiveCall = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<CallPhase>("connecting");
  const [secondsLeft, setSecondsLeft] = useState(CALL_DURATION);
  const [elapsed, setElapsed] = useState(0);
  const [guardianOpen, setGuardianOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [myChoice, setMyChoice] = useState<"spark" | "pass" | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  // Simulate connection
  useEffect(() => {
    const t = setTimeout(() => setPhase("live"), 2800);
    return () => clearTimeout(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== "live") return;
    if (secondsLeft <= 0) {
      setPhase("deciding");
      return;
    }
    const t = setInterval(() => {
      setSecondsLeft((s) => s - 1);
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [phase, secondsLeft]);

  const handleChoice = useCallback((choice: "spark" | "pass") => {
    setMyChoice(choice);
    setPhase("waiting");
    // Simulate partner response
    setTimeout(() => {
      const partnerSparked = choice === "spark" && Math.random() > 0.35;
      setPhase(partnerSparked ? "mutual-spark" : "no-spark");
    }, 2200);
  }, []);

  const handleSafeExit = useCallback(() => {
    setExitOpen(false);
    navigate("/lobby");
  }, [navigate]);

  const isMutual = myChoice === "spark" && phase !== "no-spark";

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <AnimatePresence mode="wait">
        {/* ═══ CONNECTING ═══ */}
        {phase === "connecting" && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-7 px-6"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full border-2 border-primary/25 flex items-center justify-center"
            >
              <Phone className="w-7 h-7 text-primary" />
            </motion.div>
            <div className="text-center">
              <p className="font-serif text-2xl text-foreground mb-2">
                Connecting you now…
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Your call is fully anonymous. Relax — just be yourself.
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ LIVE CALL / DECIDING ═══ */}
        {(phase === "live" || phase === "deciding") && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* ── Top bar ── */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2">
              {/* Left: safety + connection */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                  <Shield className="w-3 h-3 text-primary/50" />
                  <span>Safety on</span>
                </div>
                <ConnectionIndicator quality="excellent" />
              </div>

              {/* Centre: countdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2">
                <CallCountdown seconds={secondsLeft} total={CALL_DURATION} />
              </div>

              {/* Right: Guardian + Safe Exit */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuardianOpen(true)}
                  className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  aria-label="Guardian Net"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExitOpen(true)}
                  className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center text-destructive/70 hover:text-destructive hover:bg-destructive/20 transition-all"
                  aria-label="Safe Exit"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Video area ── */}
            <VideoArea />

            {/* ── Bottom controls ── */}
            <div className="relative z-10 px-6 pb-8 pt-4">
              {phase === "deciding" ? (
                <SparkPassButtons onChoice={handleChoice} elapsed={elapsed} />
              ) : (
                <div className="flex items-center justify-center">
                  <CallControls
                    micOn={micOn}
                    cameraOn={cameraOn}
                    onToggleMic={() => setMicOn((v) => !v)}
                    onToggleCamera={() => setCameraOn((v) => !v)}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ WAITING ═══ */}
        {phase === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-5 px-6"
          >
            <p className="font-serif text-2xl text-foreground">
              {myChoice === "spark" ? "Spark sent." : "Choice recorded."}
            </p>
            <p className="text-sm text-muted-foreground">
              Waiting for their decision…
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ MUTUAL SPARK ═══ */}
        {phase === "mutual-spark" && (
          <MutualSparkReveal onContinue={() => setPhase("reflection")} />
        )}

        {/* ═══ NO SPARK ═══ */}
        {phase === "no-spark" && (
          <motion.div
            key="no-spark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                Thank you for your honesty.
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Neither party knows who chose what. That's the Verity promise — dignity, always.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                onClick={() => setPhase("reflection")}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View your Spark Reflection
              </button>
              <button
                onClick={() => navigate("/lobby")}
                className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Return to lobby
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ═══ SPARK REFLECTION ═══ */}
        {phase === "reflection" && (
          <SparkReflection
            wasMutual={isMutual}
            onContinue={() => {
              setPhase(isMutual ? "voice-intro" : "complete");
            }}
          />
        )}

        {/* ═══ VOICE INTRO ═══ */}
        {phase === "voice-intro" && (
          <VoiceIntro onComplete={() => setPhase("complete")} />
        )}

        {/* ═══ COMPLETE ═══ */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                {isMutual ? "Connection made." : "Until next time."}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {isMutual
                  ? "Chat is now unlocked. You'll find them in your Sparks."
                  : "Every call teaches you something about what you're looking for."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => navigate("/lobby")}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Back to lobby
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <GuardianNet open={guardianOpen} onClose={() => setGuardianOpen(false)} />
      <SafeExitModal open={exitOpen} onClose={() => setExitOpen(false)} onConfirm={handleSafeExit} />
    </div>
  );
};

export default LiveCall;
