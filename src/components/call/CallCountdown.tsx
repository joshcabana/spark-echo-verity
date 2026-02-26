import { motion } from "framer-motion";

interface CallCountdownProps {
  seconds: number;
  total: number;
}

const CallCountdown = ({ seconds, total }: CallCountdownProps) => {
  const pct = seconds / total;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex items-center gap-2">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
      <span className={`text-sm font-medium tabular-nums ${seconds <= 10 ? "text-destructive" : "text-foreground"}`}>
        {seconds}s
      </span>
    </div>
  );
};

export default CallCountdown;
