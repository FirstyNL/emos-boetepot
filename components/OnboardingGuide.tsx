"use client";

import { useState } from "react";
import { Sparkles, Trophy, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers";

const steps = [
  {
    title: "Welkom bij de ultieme boetepot! 🍻",
    description: "Geen gelul meer met onduidelijke afspraken of 'ik ben het vergeten'. Dit is het centrale digitale hoofdkwartier voor al jullie te laat kom-acties, vergeten ballen en andere wanprestaties. De pot liegt nooit.",
    icon: Sparkles,
  },
  {
    title: "Jouw profiel en schande 📊",
    description: "Zet je eigen bijnaam er neer en laat zien welke rol je hebt in het elftal. Houd live je openstaande schulden en afgedragen boetes in de gaten voordat de deurwaarder komt.",
    icon: Trophy,
  },
  {
    title: "Afrekenen zonder gezeik 💶",
    description: "Geen gezeur met losse Tikkies achteraf: de beheerder beheert de centrale pot. Zodra je betaald hebt springt je status op groen en spek je direct het teamuitje.",
    icon: CreditCard,
  },
  {
    title: "Klaar om te vlammen! 🚀",
    description: "Bekijk wie er deze week bovenaan het podium bungelt en zorg dat je zelf uit de vuurlinie blijft. Veel plezier en zuipen op kosten van de club!",
    icon: ShieldCheck,
  },
];

export default function OnboardingGuide({ onComplete }: { onComplete: () => void }) {
  const { profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const isLastStep = currentStep === steps.length - 1;

  function handleBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  async function handleNext() {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (saving) return;
    setSaving(true);
    try {
      if (profile) {
        await supabase
          .from("profiles")
          .update({ has_seen_guide: true })
          .eq("id", profile.id);
        // Ververst het profiel in de auth-context, anders blijft
        // has_seen_guide lokaal op false staan en sluit de modal nooit.
        await refreshProfile();
      }
      onComplete();
    } finally {
      setSaving(false);
    }
  }

  const step = steps[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-xl text-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-wide">
            Stap {currentStep + 1} van {steps.length}
          </span>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep ? "w-6 bg-emos" : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-emos rounded-lg flex items-center justify-center shadow-sm">
          <IconComponent size={24} />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-black tracking-tight text-slate-900">{step.title}</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="shrink-0 flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 font-bold text-xs px-4 py-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <ArrowLeft size={14} />
              Vorige
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="flex-1 bg-emos hover:bg-emos-dark text-white font-black py-3.5 px-4 rounded-lg transition shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{isLastStep ? "Kappen met lezen, aan de slag! 🚀" : "Volgende kneiter"}</span>
                {!isLastStep && <ArrowRight size={16} />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
