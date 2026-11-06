import { useState } from "react";
import { api } from "./api";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await api("/login", { method: "POST", body: { email, password } });
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-surface p-8">
        <h1 className="font-display text-5xl">Admin</h1>

        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-night px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-night px-3 py-2"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full cursor-pointer rounded-md bg-white py-2 font-semibold text-night transition-colors hover:bg-white/80 disabled:opacity-50"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </main>
  );
}