"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { setToken, clearToken } from "@/lib/auth";
import useUserStore from "@/store/useUserStore";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import OtpInput from "@/components/auth/OtpInput";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ease = [0.16, 1, 0.3, 1] as const;

type Mode = "login" | "register";
type Step = "email" | "code";

function apiError(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { detail?: string } }; message?: string };
  return e.response?.data?.detail || e.message || fallback;
}

export default function EmailOtpForm({ mode }: { mode: Mode }) {
  const setUser = useUserStore((s) => s.setUser);

  const [step, setStep] = useState<Step>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const isRegister = mode === "register";

  // Synchronous guard so a fast 6th keystroke + the auto-submit effect can't
  // both fire verify for the same code (state updates are async, a ref isn't).
  const submittingRef = useRef(false);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const requestCode = useCallback(
    async (isResend = false) => {
      setError(null);

      if (isRegister && name.trim().length < 2) {
        setError("Please enter your name.");
        return;
      }
      if (!EMAIL_RE.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }

      setIsSending(true);
      try {
        const res = await api.post("/auth/otp/request", {
          email: email.trim(),
          name: isRegister ? name.trim() : undefined,
        });
        setCooldown(res.data?.retry_after ?? 45);
        setStep("code");
        setCode("");
        if (isResend) toast.success("New code sent.");
      } catch (err) {
        setError(apiError(err, "Couldn't send the code. Try again."));
      } finally {
        setIsSending(false);
      }
    },
    [email, name, isRegister],
  );

  const verifyCode = useCallback(
    async (fullCode: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setError(null);
      setIsVerifying(true);
      try {
        const res = await api.post("/auth/otp/verify", {
          email: email.trim(),
          code: fullCode,
          name: isRegister ? name.trim() : undefined,
        });
        if (!res.data?.token) throw new Error("Token missing from response");

        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(isRegister ? "Welcome to LifeOS 🎉" : "Welcome back!");
        // Hard navigation so the edge middleware re-runs with the fresh cookie.
        window.location.assign("/dashboard");
      } catch (err) {
        clearToken();
        setCode("");
        setError(apiError(err, "Invalid code. Try again."));
      } finally {
        setIsVerifying(false);
        submittingRef.current = false;
      }
    },
    [email, name, isRegister, setUser],
  );

  // Auto-submit the moment all 6 digits are present. Detecting completion here
  // (off `code` length) rather than inside OtpInput sidesteps the stale-closure
  // race where fast typing/paste can outrun the child's per-keystroke state.
  useEffect(() => {
    if (step === "code" && code.length === 6) verifyCode(code);
  }, [step, code, verifyCode]);

  const onEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    requestCode(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="glass rounded-2xl p-8 w-full max-w-md"
    >
      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease }}
          >
            {/* Header */}
            <div className="flex flex-col gap-1 mb-8">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                {isRegister ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {isRegister
                  ? "No passwords — we'll email you a sign-in code."
                  : "Enter your email and we'll send you a code."}
              </p>
            </div>

            <form onSubmit={onEmailSubmit} className="flex flex-col gap-5">
              {isRegister && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                    Full name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Sahil Kriplani"
                    autoComplete="name"
                    style={{ background: "var(--muted)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                  Email
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="sahil@example.com"
                  autoComplete="email"
                  autoFocus={!isRegister}
                  style={{
                    background: "var(--muted)",
                    border: `1px solid ${error ? "#f43f5e" : "var(--glass-border)"}`,
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {error && <span className="text-xs text-rose-400 -mt-2">{error}</span>}

              <Button
                type="submit"
                disabled={isSending}
                className="w-full font-semibold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {isSending ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" /> Sending code...
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <GoogleSignInButton />
            </div>

            <p className="text-sm text-center mt-6" style={{ color: "var(--muted-foreground)" }}>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <Link
                href={isRegister ? "/login" : "/register"}
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: "var(--primary)" }}
              >
                {isRegister ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25, ease }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-3 mb-7">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--primary) 14%, transparent)" }}
              >
                <MailCheck size={22} style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  Check your email
                </h1>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  We sent a 6-digit code to <br />
                  <span className="font-medium" style={{ color: "var(--foreground)" }}>{email}</span>
                </p>
              </div>
            </div>

            <OtpInput
              value={code}
              onChange={setCode}
              disabled={isVerifying}
              hasError={!!error}
            />

            {error && (
              <p className="text-xs text-rose-400 text-center mt-3">{error}</p>
            )}

            <Button
              onClick={() => verifyCode(code)}
              disabled={isVerifying || code.length < 6}
              className="w-full font-semibold mt-6"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {isVerifying ? (
                <>
                  <Loader2 size={15} className="animate-spin mr-2" /> Verifying...
                </>
              ) : (
                "Verify & continue"
              )}
            </Button>

            {/* Resend */}
            <p className="text-sm text-center mt-5" style={{ color: "var(--muted-foreground)" }}>
              Didn't get it?{" "}
              {cooldown > 0 ? (
                <span style={{ color: "var(--muted-foreground)" }}>Resend in {cooldown}s</span>
              ) : (
                <button
                  onClick={() => requestCode(true)}
                  disabled={isSending}
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "var(--primary)" }}
                >
                  Resend code
                </button>
              )}
            </p>

            {/* Back */}
            <button
              onClick={() => {
                setStep("email");
                setError(null);
                setCode("");
              }}
              className="flex items-center gap-1.5 text-sm mx-auto mt-5 hover:opacity-80 transition-opacity"
              style={{ color: "var(--muted-foreground)" }}
            >
              <ArrowLeft size={14} /> Use a different email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
