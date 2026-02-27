import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PreferencesStepProps {
  onComplete: (prefs: Record<string, any>) => void;
}

const AU_STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

const PreferencesStep = ({ onComplete }: PreferencesStepProps) => {
  const [pledge, setPledge] = useState(false);
  const [interestedIn, setInterestedIn] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [state, setState] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    supabase
      .from("rooms")
      .select("id, name")
      .then(({ data }) => {
        if (data) setRooms(data);
      });
  }, []);

  const toggleRoom = (id: string) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const canSubmit = pledge && interestedIn && state;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onComplete({
      interested_in: interestedIn,
      age_range: ageRange,
      state,
      rooms: selectedRooms,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col px-6 w-full max-w-sm mx-auto"
    >
      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-6 text-center">
        Almost there
      </h2>

      {/* Safety pledge */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border mb-6">
        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-foreground font-medium mb-1">Safety Pledge</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            I commit to treating every person on Verity with dignity and respect.
            I understand harmful behaviour results in permanent removal.
          </p>
          <div className="flex items-center gap-2">
            <Switch checked={pledge} onCheckedChange={setPledge} />
            <span className="text-xs text-muted-foreground">I agree</span>
          </div>
        </div>
      </div>

      {/* Interested in */}
      <label className="text-xs text-muted-foreground uppercase tracking-luxury mb-2">Interested in</label>
      <div className="flex gap-2 mb-6">
        {["Women", "Men", "Everyone"].map((opt) => (
          <button
            key={opt}
            onClick={() => setInterestedIn(opt.toLowerCase())}
            className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${
              interestedIn === opt.toLowerCase()
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Age range */}
      <label className="text-xs text-muted-foreground uppercase tracking-luxury mb-2">
        Age range: {ageRange[0]}–{ageRange[1]}
      </label>
      <Slider
        min={18}
        max={65}
        step={1}
        value={ageRange}
        onValueChange={setAgeRange}
        className="mb-6"
      />

      {/* State */}
      <label className="text-xs text-muted-foreground uppercase tracking-luxury mb-2">State</label>
      <Select value={state} onValueChange={setState}>
        <SelectTrigger className="bg-card border-border mb-6">
          <SelectValue placeholder="Select your state" />
        </SelectTrigger>
        <SelectContent>
          {AU_STATES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Room preferences */}
      <label className="text-xs text-muted-foreground uppercase tracking-luxury mb-2">
        Favourite rooms (up to 3)
      </label>
      <div className="flex flex-wrap gap-2 mb-8">
        {rooms.map((r) => (
          <Badge
            key={r.id}
            variant={selectedRooms.includes(r.id) ? "default" : "outline"}
            className={`cursor-pointer transition-all ${
              selectedRooms.includes(r.id)
                ? "bg-primary text-primary-foreground"
                : "hover:border-primary/40"
            }`}
            onClick={() => toggleRoom(r.id)}
          >
            {r.name}
          </Badge>
        ))}
      </div>

      <Button
        variant="gold"
        size="lg"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="group w-full"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Find your first Drop
      </Button>
    </motion.div>
  );
};

export default PreferencesStep;
