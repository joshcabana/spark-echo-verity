import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Mail, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-foreground mb-2">Verity</h1>
            <p className="text-sm text-muted-foreground">
              Join a community that values real connection.
            </p>
          </div>

          {!submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                    required
                  />
                </div>
                <Button type="submit" variant="gold" size="lg" className="w-full group">
                  Continue with email
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground/50 leading-relaxed">
                  We'll send a secure link to verify your email.
                  <br />
                  No password needed — ever.
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground/40 uppercase tracking-luxury">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Phone option */}
              <Button variant="outline" size="lg" className="w-full text-muted-foreground">
                Continue with phone number
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-3">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mb-2">
                We've sent a secure link to
              </p>
              <p className="text-sm text-foreground font-medium mb-8">{email}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Use a different email
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground/40">
          By continuing, you agree to Verity's terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
