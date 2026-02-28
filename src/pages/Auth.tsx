import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import VerityLogo from "@/components/VerityLogo";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userTrust } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Check your inbox",
          description: "We've sent a verification link to your email.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check onboarding status
        if (data.user) {
          const { data: trust } = await supabase
            .from("user_trust")
            .select("onboarding_complete")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (trust?.onboarding_complete) {
            navigate("/lobby");
          } else {
            navigate("/onboarding");
          }
        }
      }
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="w-full max-w-md">
          <div className="text-center mb-10">
            <VerityLogo className="h-9 w-auto mx-auto mb-2" linkTo="/" />
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Welcome back." : "Join a community that values real connection."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Input type="text" placeholder="Display name" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)} className="h-12 bg-card border-border" />
              </motion.div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Your email address" value={email}
                onChange={(e) => setEmail(e.target.value)} className="pl-11 h-12 bg-card border-border" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="pl-11 h-12 bg-card border-border" required minLength={6} />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full group" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : mode === "login" ? (
                <><LogIn className="w-4 h-4 mr-2" /> Sign in</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Create account</>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-primary hover:text-primary/80 transition-colors">
              {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground/40">
          By continuing, you agree to Verity's terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
