import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

interface DropCountdownProps {
  scheduledAt: string;
  className?: string;
}

const DropCountdown = ({ scheduledAt, className = "" }: DropCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(scheduledAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(scheduledAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduledAt]);

  if (timeLeft.total <= 0) {
    return <span className={`text-primary font-medium ${className}`}>Live now</span>;
  }

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {timeLeft.days > 0 && <Unit value={timeLeft.days} label="d" />}
      <Unit value={timeLeft.hours} label="h" />
      <Unit value={timeLeft.minutes} label="m" />
      <Unit value={timeLeft.seconds} label="s" />
    </div>
  );
};

const Unit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex items-baseline gap-0.5">
    <span className="font-mono text-sm text-foreground">{String(value).padStart(2, "0")}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

function calcTimeLeft(scheduledAt: string) {
  const total = differenceInSeconds(new Date(scheduledAt), new Date());
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { total, days, hours, minutes, seconds };
}

export default DropCountdown;
