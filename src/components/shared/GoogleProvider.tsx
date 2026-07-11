"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Wraps the app in Google Identity Services so the "Continue with Google"
// buttons can mint an ID token. If NEXT_PUBLIC_GOOGLE_CLIENT_ID isn't set
// (e.g. before the env var is configured), we render children untouched so the
// rest of the app keeps working and the Google button simply hides itself.
export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <>{children}</>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
