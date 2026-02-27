import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Video, Heart } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const bullets = [
  { icon: Video, text: "45-second anonymous video call — no bios, no swiping" },
  { icon: Heart, text: "Mutual Spark reveals identity and unlocks chat" },
  { icon: Shield, text: "AI-moderated in real time — your safety is non-negotiable" },
];

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6"
    >
      <span className="inline-block text-xs tracking-luxury uppercase text-primary/80 border border-primary/20 px-4 py-2 rounded-full mb-8">
        Welcome to Verity
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4 leading-tight">
        Meet someone real{" "}
        <span className="text-gold-gradient italic">in 45 seconds.</span>
      </h1>

      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
        No filters. No facades. Just a real conversation with someone who chose
        the same room as you.
      </p>

      <div className="space-y-4 w-full max-w-sm mb-12">
        {bullets.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
            className="flex items-start gap-3 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <b.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{b.text}</p>
          </motion.div>
        ))}
      </div>

      <Button variant="gold" size="lg" onClick={onNext} className="group w-full max-w-sm">
        Get started
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default WelcomeStep;
