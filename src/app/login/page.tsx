
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("testowner@example.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Unable to sign in. Check your credentials.");
      } else {
        setMessage("Successfully signed in!");
      }
    } catch {
      setMessage("Login is unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold">Test Login</h1>
      <p className="mt-2">
        Sign in using your fictional Supabase test account.
      </p>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </main>
  );
}
