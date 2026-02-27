import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, ArrowRight } from "lucide-react";

interface SafetyPledgeStepProps {
  onNext: () => void;
}

const SafetyPledgeStep = ({ onNext }: SafetyPledgeStepProps) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6 max-w-sm mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-primary" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-6">
        One promise before you enter.
      </h2>

      <div className="space-y-4 text-left w-full mb-8">
        {[
          "No harassment. No pressure. No sexual content.",
          "If someone asks to leave, you let them leave.",
          "Report what matters — we act fast.",
        ].map((bullet, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">{bullet}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-8 w-full">
        <Checkbox
          id="pledge"
          checked={accepted}
          onCheckedChange={(v) => setAccepted(v === true)}
        />
        <label htmlFor="pledge" className="text-sm text-foreground cursor-pointer">
          I agree to the Verity Safety Pledge.
        </label>
      </div>

      <Button
        variant="gold"
        size="lg"
        onClick={onNext}
        disabled={!accepted}
        className="w-full group"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default SafetyPledgeStep;
