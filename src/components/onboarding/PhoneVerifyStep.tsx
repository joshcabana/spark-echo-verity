import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Phone, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhoneVerifyStepProps {
  onNext: () => void;
  onSkip?: () => void;
  phoneEnabled?: boolean;
  requirePhoneVerification?: boolean;
  settingsError?: string | null;
}

const providerIssueRegex = /(sms|phone|twilio|provider|disabled|not enabled|unsupported)/i;

const PhoneVerifyStep = ({
  onNext,
  onSkip,
  phoneEnabled = true,
  requirePhoneVerification = true,
  settingsError = null,
}: PhoneVerifyStepProps) => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerUnavailable, setProviderUnavailable] = useState(!phoneEnabled);
  const { toast } = useToast();

  useEffect(() => {
    setProviderUnavailable(!phoneEnabled);
  }, [phoneEnabled]);

  const formatAuPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0")) return "+61" + digits.slice(1);
    if (digits.startsWith("61")) return "+" + digits;
    if (digits.startsWith("+61")) return digits;
    return "+61" + digits;
  };

  const handleSendOtp = async () => {
    const formatted = formatAuPhone(phone);
    if (formatted.length < 12) {
      toast({ title: "Invalid number", description: "Please enter an Australian mobile number.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "Code sent", description: "Check your phone for a verification code." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      if (providerIssueRegex.test(message)) {
        setProviderUnavailable(true);
      }
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const formatted = formatAuPhone(phone);
      const { error } = await supabase.auth.verifyOtp({
        phone: formatted,
        token: otp,
        type: "sms",
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

  if (providerUnavailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center px-6"
      >
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
          Phone verification unavailable
        </h2>
        <p className="text-muted-foreground max-w-md mb-6 text-sm leading-relaxed">
          SMS verification is temporarily unavailable in this environment.
        </p>
        {settingsError && (
          <p className="text-xs text-muted-foreground/70 mb-6 max-w-md">
            {settingsError}
          </p>
        )}
        {requirePhoneVerification ? (
          <>
            <p className="text-sm text-destructive/90 max-w-md mb-8 leading-relaxed">
              Safety policy currently requires phone verification before you can continue. Please try again later.
            </p>
            <Button variant="outline" size="lg" className="w-full max-w-sm" disabled>
              Phone verification unavailable
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
              You can continue for now while phone verification is unavailable.
            </p>
            <Button
              variant="gold"
              size="lg"
              className="w-full max-w-sm"
              onClick={() => (onSkip ?? onNext)()}
            >
              Continue for now
            </Button>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6"
    >
      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
        {otpSent ? "Verify your number" : "Add your phone"}
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        {otpSent
          ? "Enter the 6-digit code we just sent."
          : "Phone verification keeps Verity safe and bot-free. We never share your number."}
      </p>

      {!otpSent ? (
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="04XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-11 h-12 bg-card border-border"
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            />
          </div>
          <Button
            variant="gold"
            size="lg"
            onClick={handleSendOtp}
            className="group w-full"
            disabled={loading || phone.length < 8}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Send verification code
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
        </div>
      )}
    </motion.div>
  );
};

export default PhoneVerifyStep;
