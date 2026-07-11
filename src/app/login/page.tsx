import LoginForm from "@/components/auth/LoginForm";
import { LogoMark } from "@/components/shared/Logo";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: "var(--background)" }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <LogoMark size={32} />
        <span
          className="font-semibold text-base"
          style={{ color: "var(--foreground)" }}
        >
          LifeOS
        </span>
      </div>

      <div className="relative z-10 w-full px-4 flex justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
