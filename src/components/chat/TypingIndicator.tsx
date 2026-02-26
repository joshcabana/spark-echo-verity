import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
