import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SparkEmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="w-16 h-16 rounded-full bg-primary/[0.06] flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7 text-primary/40" />
      </div>
      <h3 className="font-serif text-xl text-foreground mb-2">
        Your first real spark will appear here.
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">
        When two people choose Spark after a call, this is where the connection lives. The Lobby is ready when you are.
      </p>
      <Button variant="gold-outline" size="lg" onClick={() => navigate("/lobby")}>
        Enter the Lobby
      </Button>
    </motion.div>
  );
};

export default SparkEmptyState;
