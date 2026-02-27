import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight, ShieldCheck } from "lucide-react";

interface SelfieStepProps {
  onNext: (verified: boolean) => void;
}

const SelfieStep = ({ onNext }: SelfieStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Camera className="w-8 h-8 text-primary" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
        Selfie verification
      </h2>
      <p className="text-muted-foreground max-w-md mb-4 text-sm leading-relaxed">
        A quick liveness check proves you're a real person. Verified members get
        access to exclusive Verified-only Drops.
      </p>

      <div className="flex items-center gap-2 text-xs text-primary/80 mb-10">
        <ShieldCheck className="w-4 h-4" />
        <span>Your selfie is processed on-device and never stored.</span>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <Button
          variant="gold"
          size="lg"
          onClick={() => onNext(true)}
          className="group w-full"
        >
          <Camera className="mr-2 h-4 w-4" />
          Take selfie now
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNext(false)}
          className="w-full text-muted-foreground"
        >
          I'll do this later
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SelfieStep;
