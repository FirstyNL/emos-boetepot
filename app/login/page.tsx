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

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Kies direct een willekeurige slogan voor deze sessie
    const randomSlogan = loginSlogans[Math.floor(Math.random() * loginSlogans.length)];
    sessionStorage.setItem("emos_user_slogan", randomSlogan);

    if (isRegistering) {
      // Registreren
      const { data, error: regError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (regError) {
        setError(regError.message || "Registreren mislukt. Lekker handig weer.");
        setLoading(false);
      } else {
        setSuccessMsg("Account aangemaakt! Je kunt nu inloggen (of je bent direct binnen).");
        setLoading(false);
        if (data.session) {
          sessionStorage.setItem("emos_just_logged_in", "true");
          router.push("/");
        } else {
          setIsRegistering(false);
        }
      }
    } else {
      // Inloggen
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
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
    <main className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Logo & Titel */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-sm">
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
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-xl text-center font-bold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-xl text-center font-bold leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Formulier */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Volledige naam
              </label>
              <input
                type="text"
                required
                placeholder="Jan de Rooy"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              E-mailadres
            </label>
            <input
              type="email"
              required
              placeholder="jouwmail@rksvemos.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Wachtwoord
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emos hover:bg-emos-dark text-white font-black py-3.5 px-4 rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2"
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