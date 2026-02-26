import { motion } from "framer-motion";
import { Brain, TrendingUp, MessageCircle, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SparkReflectionProps {
  wasMutual: boolean;
  onContinue: () => void;
}

const insights = [
  {
    icon: TrendingUp,
    label: "Energy peak",
    value: "You both showed highest energy discussing travel and food",
  },
  {
    icon: MessageCircle,
    label: "Conversation flow",
    value: "Natural turn-taking with balanced speaking time — 52% / 48%",
  },
  {
    icon: Smile,
    label: "Tone match",
    value: "Warm and curious — your tones were closely aligned throughout",
  },
];

const SparkReflection = ({ wasMutual, onContinue }: SparkReflectionProps) => {
  return (
    <motion.div
      key="reflection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-2">Spark Reflection</h2>
          <p className="text-sm text-muted-foreground">
            Private AI insight for your personal growth only. No transcription — just patterns.
          </p>
        </div>

        {/* Insights */}
        <div className="space-y-4 mb-10">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-start gap-4 bg-card border border-border rounded-lg p-4"
            >
              <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <insight.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-luxury mb-1">
                  {insight.label}
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {insight.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground/40 text-center mb-8">
          This reflection is never shared with your match or anyone else.
        </p>

        <Button variant="gold" size="lg" className="w-full" onClick={onContinue}>
          {wasMutual ? "Continue to Voice Intro" : "Return to lobby"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SparkReflection;
