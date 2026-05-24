"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Settings,
  User,
  Lock,
  Loader2,
  Moon,
  Sun,
  CheckCircle2,
} from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import useUserStore from "@/store/useUserStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, "Minimum 2 characters")
    .required("Name is required"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

type ProfileForm = yup.InferType<typeof profileSchema>;
type PasswordForm = yup.InferType<typeof passwordSchema>;

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  description,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <GlassCard padding="md" className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <Icon size={16} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {title}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              {description}
            </p>
          </div>
        </div>
        <Separator style={{ background: "var(--glass-border)" }} />
        {children}
      </GlassCard>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileForm>({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<PasswordForm>({ resolver: yupResolver(passwordSchema) });

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      const res = await api.patch("/auth/update-profile", { name: data.name });
      setUser(res.data.user);
      setProfileSuccess(true);
      toast.success("Profile updated");
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await api.patch("/auth/change-password", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordSuccess(true);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <Settings size={18} style={{ color: "var(--primary)" }} />
          <h1
            className="text-xl md:text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Settings
          </h1>
        </div>
        <p
          className="text-xs md:text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile */}
      <Section
        title="Profile"
        description="Update your display name"
        icon={User}
        delay={0.1}
      >
        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted-foreground)" }}
            >
              Full Name
            </Label>
            <Input
              {...registerProfile("name")}
              placeholder="Your name"
              style={{
                background: "var(--muted)",
                border: `1px solid ${profileErrors.name ? "#f43f5e" : "var(--glass-border)"}`,
                color: "var(--foreground)",
              }}
            />
            {profileErrors.name && (
              <span className="text-xs text-rose-400">
                {profileErrors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted-foreground)" }}
            >
              Email
            </Label>
            <Input
              value={user?.email ?? ""}
              disabled
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
                color: "var(--muted-foreground)",
                opacity: 0.6,
              }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Email cannot be changed
            </span>
          </div>

          <Button
            type="submit"
            disabled={profileSubmitting}
            className="w-full sm:w-fit font-semibold flex items-center justify-center gap-2"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {profileSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : profileSuccess ? (
              <CheckCircle2 size={14} />
            ) : null}
            {profileSubmitting
              ? "Saving..."
              : profileSuccess
                ? "Saved!"
                : "Save Changes"}
          </Button>
        </form>
      </Section>

      {/* Password */}
      <Section
        title="Change Password"
        description="Update your account password"
        icon={Lock}
        delay={0.2}
      >
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="flex flex-col gap-4"
        >
          {[
            {
              id: "currentPassword" as const,
              label: "Current Password",
              error: passwordErrors.currentPassword,
            },
            {
              id: "newPassword" as const,
              label: "New Password",
              error: passwordErrors.newPassword,
            },
            {
              id: "confirmPassword" as const,
              label: "Confirm New Password",
              error: passwordErrors.confirmPassword,
            },
          ].map((field) => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <Label
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                {field.label}
              </Label>
              <Input
                {...registerPassword(field.id)}
                type="password"
                placeholder="••••••••"
                style={{
                  background: "var(--muted)",
                  border: `1px solid ${field.error ? "#f43f5e" : "var(--glass-border)"}`,
                  color: "var(--foreground)",
                }}
              />
              {field.error && (
                <span className="text-xs text-rose-400">
                  {field.error.message}
                </span>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={passwordSubmitting}
            className="w-full sm:w-fit font-semibold flex items-center justify-center gap-2"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {passwordSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : passwordSuccess ? (
              <CheckCircle2 size={14} />
            ) : null}
            {passwordSubmitting
              ? "Changing..."
              : passwordSuccess
                ? "Changed!"
                : "Change Password"}
          </Button>
        </form>
      </Section>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <GlassCard padding="md">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <Sun size={16} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Appearance
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Customize your visual experience
              </p>
            </div>
          </div>
          <Separator style={{ background: "var(--glass-border)" }} />
          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Theme
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {theme === "dark" ? "Dark mode is on" : "Light mode is on"}
              </span>
            </div>
            <div
              className="flex gap-1 p-1 rounded-xl"
              style={{ background: "var(--muted)" }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme("light")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={
                  theme === "light"
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                <Sun size={13} /> Light
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme("dark")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={
                  theme === "dark"
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                <Moon size={13} /> Dark
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <GlassCard padding="md">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                Account
              </span>
              <span
                className="text-sm font-medium truncate"
                style={{ color: "var(--foreground)" }}
              >
                {user?.name}
              </span>
              <span
                className="text-xs truncate"
                style={{ color: "var(--muted-foreground)" }}
              >
                {user?.email}
              </span>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
