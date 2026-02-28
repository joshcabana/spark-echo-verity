import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignInStepProps {
  onNext: () => void;
}

const SignInStep = ({ onNext }: SignInStepProps) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/onboarding" },
      });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "Code sent", description: "Check your inbox for a 6-digit code." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;
      onNext();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Invalid code", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6"
    >
      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
        {otpSent ? "Enter your code" : "Sign in to continue"}
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        {otpSent
          ? `We sent a 6-digit code to ${email}`
          : "We'll send you a one-time code — no password needed."}
      </p>

      {!otpSent ? (
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 bg-card border-border"
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            />
          </div>
          <Button
            variant="gold"
            size="lg"
            onClick={handleSendOtp}
            className="group w-full"
            disabled={loading || !email.trim()}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Send code
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-12 bg-card border-border text-center text-lg tracking-[0.5em] font-mono"
            onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
          />
          <Button
            variant="gold"
            size="lg"
            onClick={handleVerifyOtp}
            className="group w-full"
            disabled={loading || otp.length < 6}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Verify
              </>
            )}
          </Button>
          <button
            onClick={() => { setOtpSent(false); setOtp(""); }}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Use a different email
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SignInStep;
