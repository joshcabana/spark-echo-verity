import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import VerityLogo from "@/components/VerityLogo";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RESEND_COOLDOWN_MS = 30_000;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [signupEmailSentTo, setSignupEmailSentTo] = useState<string | null>(null);
  const [lastSignupEmailAt, setLastSignupEmailAt] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const clearSignupAssist = () => {
    setSignupEmailSentTo(null);
    setLastSignupEmailAt(null);
  };

  const handleResendVerification = async () => {
    if (!signupEmailSentTo) return;

    const now = Date.now();
    if (lastSignupEmailAt && now - lastSignupEmailAt < RESEND_COOLDOWN_MS) {
      const seconds = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSignupEmailAt)) / 1000);
      toast({
        title: "Please wait",
        description: `You can resend in ${seconds}s.`,
      });
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: signupEmailSentTo,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;

      setLastSignupEmailAt(now);
      toast({
        title: "Verification email sent",
        description: "Check your inbox, spam, and promotions folders.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Could not resend email",
        description: message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password.trim()) return;
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: { display_name: displayName || normalizedEmail.split("@")[0] },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setSignupEmailSentTo(normalizedEmail);
        setLastSignupEmailAt(Date.now());
        toast({
          title: "Check your inbox",
          description: "We sent a verification link. If it does not arrive, use resend below.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({
        title: "Something went wrong",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => {
      if (prev === "signup") clearSignupAssist();
      return prev === "login" ? "signup" : "login";
    });
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
            <button onClick={toggleMode}
              className="text-sm text-primary hover:text-primary/80 transition-colors">
              {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>

          {mode === "signup" && signupEmailSentTo && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4"
            >
              <p className="text-sm text-foreground mb-1">
                Verification email sent to <span className="font-medium">{signupEmailSentTo}</span>.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Check spam and promotions. If it still does not arrive, resend and then try signing in after confirmation.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending ? "Resending..." : "Resend verification email"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearSignupAssist();
                    setEmail("");
                    setDisplayName("");
                  }}
                >
                  Use a different email
                </Button>
              </div>
            </motion.div>
          )}
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
