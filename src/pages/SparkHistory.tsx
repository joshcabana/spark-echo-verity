import { useState } from "react";
import { motion } from "framer-motion";
import { mockSparks } from "@/data/sparks";
import SparkCard from "@/components/sparks/SparkCard";
import SparkEmptyState from "@/components/sparks/SparkEmptyState";
import BottomNav from "@/components/BottomNav";

const filters = ["All", "This Week", "Archived"] as const;
type Filter = (typeof filters)[number];

const SparkHistory = () => {
  const [active, setActive] = useState<Filter>("All");

  const filtered =
    active === "This Week"
      ? mockSparks.filter(
          (s) => Date.now() - new Date(s.sparkedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
        )
      : active === "Archived"
        ? []
        : mockSparks;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-2xl mx-auto px-5 pt-5 pb-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-2xl text-foreground mb-4"
          >
            Your Sparks
          </motion.h1>

          {/* Filter pills */}
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  active === f
                    ? "bg-primary/10 text-primary border border-primary/25"
                    : "bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-5 pt-5">
        {filtered.length === 0 ? (
          <SparkEmptyState />
        ) : (
          <div className="space-y-3">
            {filtered.map((spark, i) => (
              <SparkCard key={spark.id} spark={spark} index={i} />
            ))}
          </div>
        )}
      </main>

      <BottomNav activeTab="sparks" />
    </div>
  );
};

export default SparkHistory;
