import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: "var(--background)" }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          L
        </div>
        <span
          className="font-semibold text-base"
          style={{ color: "var(--foreground)" }}
        >
          LifeOS
        </span>
      </div>

      <div className="relative z-10 w-full px-4 flex justify-center">
        <RegisterForm />
      </div>
    </main>
  );
}
