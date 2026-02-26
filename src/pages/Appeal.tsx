import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, AlertTriangle, Send, Mic, MicOff, Clock,
  Check, X, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const pastAppeals = [
  { id: "a-1", reason: "Language flagged during discussion about film dialogue", status: "upheld" as const, date: "12 Feb 2026", response: "Our review confirmed a false positive. Your account has been fully restored." },
  { id: "a-2", reason: "Camera obstruction detected", status: "denied" as const, date: "28 Jan 2026", response: "The footage confirmed the camera was intentionally obscured during the call." },
];

const Appeal = () => {
  const [explanation, setExplanation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hasPendingFlag = true;

  const handleSubmit = () => {
    if (!explanation.trim()) return;
    setSubmitted(true);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasVoiceNote(true);
    } else {
      setIsRecording(true);
      setHasVoiceNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <span className="font-serif text-lg text-foreground">Appeals</span>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          {/* ═══ ACTIVE FLAG — SUBMIT FORM ═══ */}
          {hasPendingFlag && !submitted && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Flag notice */}
              <div className="rounded-lg border border-destructive/20 bg-destructive/[0.04] p-5 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-serif text-lg text-foreground mb-1">You were flagged</h2>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">
                      Our AI moderation detected potentially inappropriate content during your recent call.
                      This is a preliminary flag — your account remains active while we review.
                    </p>
                    <p className="text-xs text-muted-foreground/40 mt-3">
                      Reason: Language pattern flagged as potentially aggressive (AI confidence: 64%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Appeal form */}
              <div className="mb-8">
                <h3 className="font-serif text-xl text-foreground mb-2">Share your side</h3>
                <p className="text-sm text-muted-foreground/60 mb-5 leading-relaxed">
                  We value fairness above all else. Please describe what happened in your own words.
                  Every appeal is reviewed carefully by a real person.
                </p>

                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Please explain what happened during the call…"
                  rows={5}
                  className="mb-4 resize-none"
                />

                {/* Voice note */}
                <div className="flex items-center gap-3 mb-6">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleRecording}
                    className="gap-2"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        Stop recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        Add voice note
                      </>
                    )}
                  </Button>

                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                      <span className="text-xs text-muted-foreground">Recording…</span>
                    </motion.div>
                  )}

                  {hasVoiceNote && !isRecording && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Voice note attached</span>
                    </motion.div>
                  )}
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!explanation.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit appeal
                </Button>

                <p className="text-[11px] text-muted-foreground/35 text-center mt-3">
                  Appeals are typically reviewed within 24 hours.
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══ SUBMISSION CONFIRMATION ═══ */}
          {submitted && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-2">Appeal received</h2>
              <p className="text-sm text-muted-foreground/60 max-w-sm mx-auto leading-relaxed mb-6">
                Thank you for sharing your perspective. A member of our team will review your appeal
                carefully and respond within 24 hours.
              </p>
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                <Clock className="w-3 h-3 mr-1" />
                Under review
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ PAST APPEALS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="font-serif text-lg text-foreground mb-1">Appeal history</h3>
          <p className="text-xs text-muted-foreground/50 mb-5">Your previous appeals and their outcomes</p>

          {pastAppeals.length === 0 ? (
            <p className="text-sm text-muted-foreground/40 text-center py-8">
              No previous appeals on your account.
            </p>
          ) : (
            <div className="space-y-3">
              {pastAppeals.map((appeal, i) => (
                <motion.div
                  key={appeal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm text-foreground/80">{appeal.reason}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] flex-shrink-0 ${
                        appeal.status === "upheld"
                          ? "text-primary border-primary/30"
                          : "text-destructive border-destructive/30"
                      }`}
                    >
                      {appeal.status === "upheld" ? (
                        <><Check className="w-2.5 h-2.5 mr-1" /> Upheld</>
                      ) : (
                        <><X className="w-2.5 h-2.5 mr-1" /> Denied</>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground/50 mb-2">{appeal.date}</p>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed italic">
                    "{appeal.response}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Appeal;
