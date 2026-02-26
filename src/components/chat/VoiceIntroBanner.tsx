import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

interface VoiceIntroBannerProps {
  matchName: string;
}

const VoiceIntroBanner = ({ matchName }: VoiceIntroBannerProps) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
      setProgress(0);
      // Simulate playback
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPlaying(false);
            return 0;
          }
          return p + 100 / 15 / 10; // 15 seconds, 100ms ticks
        });
      }, 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mx-4 mt-3 mb-1 p-3.5 rounded-lg bg-primary/[0.06] border border-primary/15"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors"
        >
          {playing ? (
            <Pause className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
          )}
        </button>

        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground mb-1.5">
            {matchName}'s voice intro
          </p>
          {/* Waveform */}
          <div className="flex items-center gap-[2px] h-5">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = 4 + Math.sin(i * 0.7) * 6 + Math.random() * 4;
              const filled = (i / 30) * 100 < progress;
              return (
                <div
                  key={i}
                  className={`w-[3px] rounded-full transition-colors duration-150 ${
                    filled ? "bg-primary/70" : "bg-primary/20"
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        </div>

        <span className="text-[10px] text-muted-foreground/50 tabular-nums flex-shrink-0">
          0:15
        </span>
      </div>
    </motion.div>
  );
};

export default VoiceIntroBanner;
