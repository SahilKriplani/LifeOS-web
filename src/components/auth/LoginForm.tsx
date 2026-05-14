"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import api from "@/lib/api";
import useUserStore from "@/store/useUserStore";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", data);

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data?.token || res.data.token === "undefined") {
        throw new Error("Token missing from backend response");
      }

      Cookies.set("access_token", res.data.token, {
        expires: 7,
        path: "/",
        secure: true,
        sameSite: "lax",
      });

      setUser(res.data.user);

      toast.success("Welcome back!");

      router.replace("/dashboard");
    } catch (err: unknown) {
      Cookies.remove("access_token");

      const error = err as {
        response?: {
          data?: {
            detail?: string;
          };
        };
        message?: string;
      };

      toast.error(
        error.response?.data?.detail ||
          error.message ||
          "Invalid email or password",
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
      <div className="flex flex-col gap-1 mb-8">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Welcome back
        </h1>

        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Sign in to your LifeOS account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            className="bg-transparent"
            style={{
              background: "var(--muted)",
              border: `1px solid ${
                errors.email ? "#f43f5e" : "var(--glass-border)"
              }`,
              color: "var(--foreground)",
            }}
          />

          {errors.email && (
            <span className="text-xs text-rose-400">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Password
          </Label>

          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            style={{
              background: "var(--muted)",
              border: `1px solid ${
                errors.password ? "#f43f5e" : "var(--glass-border)"
              }`,
              color: "var(--foreground)",
            }}
          />

          {errors.password && (
            <span className="text-xs text-rose-400">
              {errors.password.message}
            </span>
          )}
        </div>

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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p
        className="text-sm text-center mt-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--primary)" }}
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
