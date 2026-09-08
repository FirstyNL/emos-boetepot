"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

const errorInsults = [
  "Inloggen mislukt. Heb je soms teveel bier op of typ je met je ellebogen?",
  "Verkeerde gegevens, droeftoeter. Probeer het nog eens.",
  "Niet te geloven, zelfs je eigen wachtwoord vergeten. Zoek hulp.",
  "Fout! Dit leidt nergens toe, behalve naar een extra boete voor wanprestatie.",
  "Verkeerd wachtwoord. Typ je inloggegevens in alsof je leven ervan afhangt.",
];

const loginSlogans = [
  "geen smoesjes.",
  "weer te laat op de training, of hoe zit dat?",
  "handen uit de mouwen en cashen.",
  "tijd om je boetes af te tikken.",
  "opgeruimd staat netjes.",
];

const ROLE_OPTIONS = ["Speler", "Aanvoerder", "Penningmeester", "Trainer / Coach"];

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("Speler");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function resetRegistrationFields() {
    setFullName("");
    setNickname("");
    setRole("Speler");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Kies direct een willekeurige slogan voor deze sessie
    const randomSlogan = loginSlogans[Math.floor(Math.random() * loginSlogans.length)];
    sessionStorage.setItem("emos_user_slogan", randomSlogan);

    if (isRegistering) {
      const trimmedName = fullName.trim();
      if (!trimmedName) {
        setError("Vul je volledige naam in, we willen weten wie we naaien.");
        setLoading(false);
        return;
      }

      // Registreren
      const { data, error: regError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: trimmedName,
            nickname: nickname.trim() || null,
            role,
          },
        },
      });

      if (regError) {
        setError(regError.message || "Registreren mislukt. Lekker handig weer.");
        setLoading(false);
      } else {
        setLoading(false);
        if (data.session) {
          sessionStorage.setItem("emos_just_logged_in", "true");
          router.push("/");
        } else {
          setSuccessMsg("Account aangemaakt! Check je mail om te bevestigen, en log daarna in.");
          setIsRegistering(false);
          setPassword("");
          resetRegistrationFields();
        }
      }
    } else {
      // Inloggen
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        const randomInsult = errorInsults[Math.floor(Math.random() * errorInsults.length)];
        setError(randomInsult);
        setLoading(false);
      } else {
        sessionStorage.setItem("emos_just_logged_in", "true");
        router.push("/");
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">

        {/* Logo & Titel */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">EMOS Boetepot</h1>
            <p className="text-xs text-slate-500 mt-1">
              {isRegistering
                ? "Maak een account aan en sluit je aan bij het slachtofferhok."
                : "Geen smoesjes, geen gezeik. Log in en meld je aan."}
            </p>
          </div>
        </div>

        {/* Meldingen */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-lg text-center font-bold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-lg text-center font-bold leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Formulier */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Volledige naam
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Bijv. Jan de Jong"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bijnaam <span className="text-slate-400 font-normal">(optioneel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Bijv. Sjaak (staat altijd buitenspel)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rol in het team
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              E-mailadres
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="laatste.bij.de.training@emos.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Wachtwoord
            </label>
            <input
              type="password"
              required
              minLength={isRegistering ? 6 : undefined}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              placeholder="Minimaal 6 tekens (sterker dan onze verdediging)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emos hover:bg-emos-dark text-white font-black py-3.5 px-4 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-white" size={16} />
                Even geduld...
              </span>
            ) : (
              <span>
                {isRegistering ? "Account aanmaken 🔨" : "Inloggen en cashen 🚀"}
              </span>
            )}
          </button>
        </form>

        {/* Wissel tussen login en register */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
              setSuccessMsg(null);
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            {isRegistering
              ? "Al een account? Log hier direct in."
              : "Nog geen account? Klik hier om te registreren."}
          </button>
        </div>

      </div>
    </main>
  );
}
