import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

interface SparkPassButtonsProps {
  onChoice: (choice: "spark" | "pass") => void;
}

const SparkPassButtons = ({ onChoice }: SparkPassButtonsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <p className="text-center text-sm text-muted-foreground mb-4">
        Time's up. Did you feel it?
      </p>
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="outline"
          size="xl"
          onClick={() => onChoice("pass")}
          className="min-w-[140px] gap-2 border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
        >
          <X className="w-4 h-4" />
          Pass
        </Button>
        <Button
          variant="gold"
          size="xl"
          onClick={() => onChoice("spark")}
          className="min-w-[140px] gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Spark
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground/50 mt-3">
        Your choice is private. Only mutual sparks are revealed.
      </p>
    </motion.div>
  );
};

export default SparkPassButtons;
