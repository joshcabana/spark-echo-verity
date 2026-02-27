import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInYears } from "date-fns";

interface AgeGateStepProps {
  onNext: (dob: string) => void;
}

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => String(currentYear - 18 - i));

const AgeGateStep = ({ onNext }: AgeGateStepProps) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!day || !month || !year) {
      setError("Please enter your full date of birth.");
      return;
    }
    const monthIndex = months.indexOf(month);
    const dob = new Date(parseInt(year), monthIndex, parseInt(day));
    const age = differenceInYears(new Date(), dob);

    if (age < 18) {
      setError("You must be 18 or older to use Verity.");
      return;
    }

    const dobStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day}`;
    onNext(dobStr);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6"
    >
      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
        Verify your age
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        Verity is exclusively for adults 18 and over. This is a hard requirement — no exceptions.
      </p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6">
        <Select value={day} onValueChange={(v) => { setDay(v); setError(""); }}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={(v) => { setMonth(v); setError(""); }}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(v) => { setYear(v); setError(""); }}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-destructive text-sm mb-4"
        >
          <AlertTriangle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      <Button
        variant="gold"
        size="lg"
        onClick={handleContinue}
        className="group w-full max-w-sm"
        disabled={!day || !month || !year}
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>

      <p className="mt-6 text-[11px] text-muted-foreground/50 max-w-xs">
        Your date of birth is stored securely and never shown to other members.
      </p>
    </motion.div>
  );
};

export default AgeGateStep;
