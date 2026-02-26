import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Video, Sparkles, Coins, User } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "go-live", label: "Go Live", icon: Video, path: "/lobby" },
  { id: "sparks", label: "Sparks", icon: Sparkles, path: "/sparks" },
  { id: "tokens", label: "Tokens", icon: Coins, path: "/tokens" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
] as const;

interface BottomNavProps {
  activeTab?: string;
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab
            ? activeTab === tab.id
            : location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -inset-2 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide transition-colors duration-300 ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
