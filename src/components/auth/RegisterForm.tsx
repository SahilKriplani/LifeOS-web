"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import api from "@/lib/api";
import useUserStore from "@/store/useUserStore";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  name: yup
    .string()
    .min(2, "Minimum 2 characters")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

type FormData = yup.InferType<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUser(res.data.user);
      toast.success("Account created! Welcome to LifeOS 🎉");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(
        error.response?.data?.detail || "Something went wrong. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-8 w-full max-w-md"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 mb-8">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Create your account
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Start tracking your goals with LifeOS
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Full Name
          </Label>
          <Input
            {...register("name")}
            type="text"
            placeholder="Sahil Kriplani"
            style={{
              background: "var(--muted)",
              border: `1px solid ${errors.name ? "#f43f5e" : "var(--glass-border)"}`,
              color: "var(--foreground)",
            }}
          />
          {errors.name && (
            <span className="text-xs text-rose-400">{errors.name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Email
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder="sahil@example.com"
            style={{
              background: "var(--muted)",
              border: `1px solid ${errors.email ? "#f43f5e" : "var(--glass-border)"}`,
              color: "var(--foreground)",
            }}
          />
          {errors.email && (
            <span className="text-xs text-rose-400">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Password
          </Label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              style={{
                background: "var(--muted)",
                border: `1px solid ${errors.password ? "#f43f5e" : "var(--glass-border)"}`,
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-rose-400">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <Label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              style={{
                background: "var(--muted)",
                border: `1px solid ${errors.confirmPassword ? "#f43f5e" : "var(--glass-border)"}`,
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-rose-400">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-semibold"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p
        className="text-sm text-center mt-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--primary)" }}
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
