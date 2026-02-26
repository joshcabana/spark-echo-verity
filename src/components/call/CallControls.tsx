import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface CallControlsProps {
  micOn: boolean;
  cameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
}

const CallControls = ({ micOn, cameraOn, onToggleMic, onToggleCamera }: CallControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-3"
    >
      <button
        onClick={onToggleMic}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
          micOn
            ? "bg-secondary/60 text-primary hover:bg-secondary"
            : "bg-destructive/20 text-destructive hover:bg-destructive/30"
        }`}
        aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
      >
        {micOn ? <Mic className="w-4.5 h-4.5" /> : <MicOff className="w-4.5 h-4.5" />}
      </button>
      <button
        onClick={onToggleCamera}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
          cameraOn
            ? "bg-secondary/60 text-primary hover:bg-secondary"
            : "bg-destructive/20 text-destructive hover:bg-destructive/30"
        }`}
        aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
      >
        {cameraOn ? <Video className="w-4.5 h-4.5" /> : <VideoOff className="w-4.5 h-4.5" />}
      </button>
    </motion.div>
  );
};

export default CallControls;
