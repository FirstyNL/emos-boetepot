"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      sessionStorage.setItem("emos_just_logged_in", "1");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4">
            <Logo size={60} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            EMOS Boetepot
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === "signin"
              ? "Log in voor je schuldenoverzicht."
              : "Meld je aan, de pot wacht op je."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4"
        >
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Naam
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Pietje Puk"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jij@emos.nl"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Wachtwoord
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
            />
          </div>

          {error && (
            <p className="text-sm text-emos bg-emos-light rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emos hover:bg-emos-dark text-white font-semibold rounded-xl py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "signin" ? "Inloggen" : "Account aanmaken"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          {mode === "signin" ? "Nog geen account?" : "Al een account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-emos font-semibold hover:underline"
          >
            {mode === "signin" ? "Registreren" : "Inloggen"}
          </button>
        </p>
      </div>
    </main>
  );
}
