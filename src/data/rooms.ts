import { Moon, Cpu, Palette, Heart, Clock } from "lucide-react";

export interface Room {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  occupancy: number;
  maxOccupancy: number;
  premium: boolean;
  tags: string[];
  activeNow: boolean;
  peakHours: string;
}

export const rooms: Room[] = [
  {
    id: "night-owls",
    name: "Night Owls",
    description: "For those who come alive after dark. Late-night conversations with fellow insomniacs and stargazers.",
    icon: Moon,
    occupancy: 42,
    maxOccupancy: 80,
    premium: false,
    tags: ["evening", "relaxed", "deep talks"],
    activeNow: true,
    peakHours: "10 PM – 2 AM",
  },
  {
    id: "tech-professionals",
    name: "Tech Professionals",
    description: "Engineers, designers, and builders who appreciate intellect and ambition in equal measure.",
    icon: Cpu,
    occupancy: 67,
    maxOccupancy: 100,
    premium: false,
    tags: ["career-driven", "intellectual", "innovation"],
    activeNow: true,
    peakHours: "7 PM – 11 PM",
  },
  {
    id: "creatives-makers",
    name: "Creatives & Makers",
    description: "Artists, writers, musicians, and anyone who creates. Where imagination meets connection.",
    icon: Palette,
    occupancy: 31,
    maxOccupancy: 60,
    premium: false,
    tags: ["artistic", "expressive", "curious"],
    activeNow: true,
    peakHours: "6 PM – 12 AM",
  },
  {
    id: "over-35",
    name: "Over 35",
    description: "A space for those past the noise. Refined taste, established lives, genuine intent.",
    icon: Heart,
    occupancy: 54,
    maxOccupancy: 80,
    premium: true,
    tags: ["mature", "intentional", "established"],
    activeNow: true,
    peakHours: "8 PM – 11 PM",
  },
  {
    id: "introvert-hours",
    name: "Introvert Hours",
    description: "Lower energy, longer pauses welcome. For those who connect deeply, not loudly.",
    icon: Clock,
    occupancy: 18,
    maxOccupancy: 40,
    premium: true,
    tags: ["quiet", "thoughtful", "gentle"],
    activeNow: false,
    peakHours: "9 PM – 1 AM",
  },
];

export function getSuggestedRoom(): Room {
  // Simulate intelligent suggestion based on time of day
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 3) return rooms[0]; // Night Owls
  if (hour >= 9 && hour < 18) return rooms[1]; // Tech Professionals
  return rooms[2]; // Creatives
}
