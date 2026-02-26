import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, AlertTriangle, BarChart3, Users, Settings, Play, Ban,
  MessageSquare, Check, X, TrendingUp, Activity, Eye, Search,
  ChevronRight, Bell, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell } from "recharts";

type AdminSection = "moderation" | "appeals" | "analytics" | "users" | "settings";

const dailySparksData = [
  { day: "Mon", sparks: 42 }, { day: "Tue", sparks: 58 }, { day: "Wed", sparks: 65 },
  { day: "Thu", sparks: 53 }, { day: "Fri", sparks: 78 }, { day: "Sat", sparks: 92 },
  { day: "Sun", sparks: 84 },
];

const roomPopularity = [
  { name: "Creative Minds", value: 340 }, { name: "Tech Professionals", value: 280 },
  { name: "Adventure Seekers", value: 220 }, { name: "Bookworms", value: 160 },
];

const moderationQueue = [
  { id: "flag-1", userId: "U-4829", room: "Creative Minds", score: 0.87, reason: "Inappropriate language detected", time: "2 min ago" },
  { id: "flag-2", userId: "U-1038", room: "Tech Professionals", score: 0.62, reason: "Potential harassment", time: "8 min ago" },
  { id: "flag-3", userId: "U-7291", room: "Adventure Seekers", score: 0.45, reason: "Nudity detection triggered", time: "14 min ago" },
];

const appealsData = [
  { id: "appeal-1", userId: "U-3847", reason: "False positive — was discussing art history", status: "pending" as const, date: "Today" },
  { id: "appeal-2", userId: "U-9102", reason: "Accidental camera glitch flagged as nudity", status: "pending" as const, date: "Yesterday" },
  { id: "appeal-3", userId: "U-5534", reason: "Background noise misidentified as aggression", status: "approved" as const, date: "2 days ago" },
];

const recentAlerts = [
  { id: 1, message: "Moderation queue exceeding 10 items", time: "5 min ago", level: "warn" },
  { id: 2, message: "Spike in user reports — Creative Minds room", time: "22 min ago", level: "error" },
  { id: 3, message: "New user registrations +34% today", time: "1 hr ago", level: "info" },
];

const usersData = [
  { id: "U-4829", name: "Alex M.", email: "a***@email.com", status: "active", pass: true, sparks: 12 },
  { id: "U-1038", name: "Jordan K.", email: "j***@email.com", status: "warned", pass: false, sparks: 3 },
  { id: "U-7291", name: "Sam R.", email: "s***@email.com", status: "active", pass: true, sparks: 28 },
  { id: "U-3847", name: "Casey L.", email: "c***@email.com", status: "banned", pass: false, sparks: 0 },
];

const chartConfig = {
  sparks: { label: "Sparks", color: "hsl(43 72% 55%)" },
  value: { label: "Users", color: "hsl(43 72% 55%)" },
};

const pieColors = ["hsl(43 72% 55%)", "hsl(43 60% 70%)", "hsl(0 0% 40%)", "hsl(40 10% 60%)"];

const navItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "moderation", label: "Moderation", icon: Shield },
  { id: "appeals", label: "Appeals", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const Admin = () => {
  const [section, setSection] = useState<AdminSection>("moderation");
  const [userSearch, setUserSearch] = useState("");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card/50 p-4 gap-1">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-serif text-lg text-foreground">Admin</span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}

        {/* Alerts */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-2 px-2 mb-3">
            <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-luxury">Alerts</span>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="px-2 py-1.5 rounded-md bg-secondary/30">
                <p className="text-[11px] text-foreground/80 leading-tight">{alert.message}</p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-5 py-6 md:py-8 mt-12 md:mt-0">
          <AnimatePresence mode="wait">
            {/* ═══ MODERATION ═══ */}
            {section === "moderation" && (
              <motion.div key="mod" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="font-serif text-2xl text-foreground mb-1">Moderation Queue</h1>
                <p className="text-sm text-muted-foreground/60 mb-6">{moderationQueue.length} items require attention</p>

                <div className="space-y-3">
                  {moderationQueue.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{item.userId}</span>
                            <Badge variant="outline" className="text-[10px]">{item.room}</Badge>
                            <span className="text-[10px] text-muted-foreground/50">{item.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground/70">{item.reason}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                              <div
                                className="h-full rounded-full bg-destructive/70"
                                style={{ width: `${item.score * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground/50">
                              AI confidence: {Math.round(item.score * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Ban className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ APPEALS ═══ */}
            {section === "appeals" && (
              <motion.div key="appeals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="font-serif text-2xl text-foreground mb-1">Appeals Inbox</h1>
                <p className="text-sm text-muted-foreground/60 mb-6">Review user appeals with care and fairness</p>

                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appealsData.map((appeal) => (
                        <TableRow key={appeal.id}>
                          <TableCell className="font-medium text-foreground">{appeal.userId}</TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{appeal.reason}</TableCell>
                          <TableCell className="text-muted-foreground/60 text-sm">{appeal.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={appeal.status === "pending" ? "outline" : "secondary"}
                              className={`text-[10px] ${appeal.status === "approved" ? "text-primary border-primary/30" : ""}`}
                            >
                              {appeal.status === "pending" ? "Pending" : "Approved"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {appeal.status === "pending" && (
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary">
                                  <Check className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
                                  <X className="w-3 h-3 mr-1" />
                                  Deny
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}

            {/* ═══ ANALYTICS ═══ */}
            {section === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="font-serif text-2xl text-foreground mb-1">Analytics</h1>
                <p className="text-sm text-muted-foreground/60 mb-6">Platform health and engagement overview</p>

                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[
                    { label: "Sparks today", value: "84", icon: Activity, trend: "+12%" },
                    { label: "Active users", value: "1,247", icon: Users, trend: "+8%" },
                    { label: "Moderation rate", value: "2.3%", icon: Shield, trend: "-0.4%" },
                    { label: "Retention (7d)", value: "68%", icon: TrendingUp, trend: "+3%" },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <kpi.icon className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span className="text-[11px] text-muted-foreground/60">{kpi.label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl text-foreground">{kpi.value}</span>
                        <span className="text-[10px] text-primary">{kpi.trend}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-foreground mb-4">Daily Sparks</h3>
                    <ChartContainer config={chartConfig} className="h-48 w-full">
                      <BarChart data={dailySparksData}>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
                        <YAxis tickLine={false} axisLine={false} fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sparks" fill="hsl(43 72% 55%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-foreground mb-4">Room Popularity</h3>
                    <ChartContainer config={chartConfig} className="h-48 w-full">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={roomPopularity} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                          {roomPopularity.map((_, i) => (
                            <Cell key={i} fill={pieColors[i]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ USERS ═══ */}
            {section === "users" && (
              <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="font-serif text-2xl text-foreground mb-1">Users</h1>
                <p className="text-sm text-muted-foreground/60 mb-6">Search and manage user accounts</p>

                <div className="relative mb-5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input
                    placeholder="Search by ID, name, or email…"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pass</TableHead>
                        <TableHead>Sparks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData
                        .filter((u) => !userSearch || u.id.toLowerCase().includes(userSearch.toLowerCase()) || u.name.toLowerCase().includes(userSearch.toLowerCase()))
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                            <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  user.status === "banned" ? "text-destructive border-destructive/30" :
                                  user.status === "warned" ? "text-amber-500 border-amber-500/30" :
                                  "text-primary border-primary/30"
                                }`}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.pass ? <Check className="w-3.5 h-3.5 text-primary" /> : <span className="text-muted-foreground/30">—</span>}</TableCell>
                            <TableCell className="tabular-nums text-muted-foreground">{user.sparks}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}

            {/* ═══ SETTINGS ═══ */}
            {section === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="font-serif text-2xl text-foreground mb-1">Settings</h1>
                <p className="text-sm text-muted-foreground/60 mb-6">Platform configuration and controls</p>

                <div className="space-y-4">
                  {[
                    { title: "AI moderation sensitivity", description: "Adjust the confidence threshold for automatic flagging", value: "0.60" },
                    { title: "Call duration", description: "Default video call length in seconds", value: "45" },
                    { title: "Spark decision window", description: "Time after call ends to decide (seconds)", value: "30" },
                    { title: "Minimum engagement time", description: "Seconds before Pass button becomes active", value: "15" },
                  ].map((setting) => (
                    <div key={setting.title} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{setting.title}</p>
                        <p className="text-xs text-muted-foreground/60">{setting.description}</p>
                      </div>
                      <Input className="w-20 text-center text-sm" defaultValue={setting.value} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
