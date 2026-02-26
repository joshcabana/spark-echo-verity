import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Sparkles, Users, Activity, TrendingUp, Eye,
  BarChart3, Heart, ArrowLeft, ExternalLink, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const liveStats = [
  { label: "Sparks today", value: "84", icon: Sparkles },
  { label: "Active users", value: "1,247", icon: Users },
  { label: "Calls this hour", value: "38", icon: Activity },
  { label: "Moderation actions", value: "6", icon: Shield },
];

const safetyStats = [
  { label: "Calls reviewed by AI", value: "100%", detail: "Every call is monitored in real time" },
  { label: "Flagged calls (30 days)", value: "2.1%", detail: "Consistently below our 3% target" },
  { label: "Appeals upheld", value: "34%", detail: "We listen and correct when wrong" },
  { label: "AI accuracy rate", value: "96.8%", detail: "Continuously improving with human review" },
];

const genderData = [
  { gender: "Women", count: 52 },
  { gender: "Men", count: 45 },
  { gender: "Non-binary", count: 3 },
];

const principles = [
  { title: "Privacy by design", text: "No call recordings are stored. AI moderation processes clips in memory and discards them immediately." },
  { title: "Radical fairness", text: "Every moderation decision can be appealed. Every appeal is reviewed by a human, not just an algorithm." },
  { title: "Transparent metrics", text: "We publish our safety and balance statistics in real time. We believe accountability builds trust." },
  { title: "No dark patterns", text: "No infinite scrolls, no addictive loops, no hidden fees. Verity is designed to help you connect, then step away." },
];

const chartConfig = {
  count: { label: "Percentage", color: "hsl(43 72% 55%)" },
};

const Transparency = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-4xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <span className="font-serif text-lg text-foreground">Transparency</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-5 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 leading-tight">
            Verity operates with
            <br />
            <span className="text-gold-gradient">radical transparency</span>
          </h1>
          <p className="text-muted-foreground/70 max-w-lg mx-auto leading-relaxed">
            We believe trust is built through openness. Here is exactly how our platform performs,
            updated in real time.
          </p>
        </motion.div>

        {/* ═══ LIVE STATS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-xs uppercase tracking-luxury text-muted-foreground">Live right now</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {liveStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="rounded-lg border border-border bg-card p-5 text-center"
              >
                <stat.icon className="w-4 h-4 text-primary mx-auto mb-3" />
                <p className="font-serif text-2xl text-foreground mb-1">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ SAFETY REPORT ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-xl text-foreground">Safety Report</h2>
          </div>
          <p className="text-sm text-muted-foreground/60 mb-6">Last 30 days</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {safetyStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="rounded-lg border border-border bg-card p-5"
              >
                <p className="text-xs text-muted-foreground/60 mb-1">{stat.label}</p>
                <p className="font-serif text-2xl text-primary mb-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground/50 leading-relaxed">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ GENDER BALANCE ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-xl text-foreground">Gender Balance</h2>
          </div>
          <p className="text-sm text-muted-foreground/60 mb-6">Current platform composition</p>

          <div className="rounded-lg border border-border bg-card p-5">
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <BarChart data={genderData} layout="vertical">
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} domain={[0, 60]} unit="%" />
                <YAxis type="category" dataKey="gender" tickLine={false} axisLine={false} fontSize={12} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(43 72% 55%)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </div>
        </motion.section>

        {/* ═══ FOUNDING PRINCIPLES ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-xl text-foreground">Founding Principles</h2>
          </div>
          <p className="text-sm text-muted-foreground/60 mb-6">
            The values that guide every decision we make
          </p>

          <div className="space-y-4">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ CTA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-center pb-12"
        >
          <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-8">
            <Eye className="w-5 h-5 text-primary mx-auto mb-3" />
            <h3 className="font-serif text-lg text-foreground mb-2">See the code behind our safety</h3>
            <p className="text-sm text-muted-foreground/60 mb-5 max-w-md mx-auto">
              Our moderation logic, privacy architecture, and data handling are documented publicly.
            </p>
            <Button variant="gold-outline" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View safety documentation
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Transparency;
