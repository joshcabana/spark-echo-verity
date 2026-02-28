import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

interface SparkData {
  id: string;
  created_at: string;
  is_archived: boolean | null;
  partner_name: string;
}

interface SparkCardProps {
  spark: SparkData;
  index: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

const SparkCard = ({ spark, index }: SparkCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => navigate(`/chat/${spark.id}`)}
      className="w-full flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-400 text-left"
    >
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border border-border">
          <User className="w-6 h-6 text-muted-foreground/60" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-sm font-medium text-foreground truncate">
            {spark.partner_name}
          </h3>
          <span className="text-[10px] text-muted-foreground/50 flex-shrink-0 ml-2">
            {timeAgo(spark.created_at)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          Say hello…
        </p>
      </div>
    </motion.button>
  );
};

export default SparkCard;
