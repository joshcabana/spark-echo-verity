import { motion } from "framer-motion";

export type FilterOption = "all" | "today" | "week" | "my-rsvps";

interface DropsFilterProps {
  active: FilterOption;
  onChange: (f: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "my-rsvps", label: "My RSVPs" },
];

const DropsFilter = ({ active, onChange }: DropsFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`relative px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
            active === f.value
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          {active === f.value && (
            <motion.div
              layoutId="filter-pill"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{f.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DropsFilter;
