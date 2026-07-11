"use client";

import EmailOtpForm from "@/components/auth/EmailOtpForm";

// Passwordless sign-in: email OTP + Google SSO. The whole flow lives in
// EmailOtpForm; this wrapper just fixes the mode for the /login route.
export default function LoginForm() {
  return <EmailOtpForm mode="login" />;
}
