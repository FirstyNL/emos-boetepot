"use client";

import { PartyPopper } from "lucide-react";
import { TEAM_OUTING_GOAL as GOAL } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function TeamOutingProgress({ raised }: { raised: number }) {
  const percentage = Math.min(100, Math.round((raised / GOAL) * 100));
  const remaining = Math.max(0, GOAL - raised);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emos-light flex items-center justify-center">
            <PartyPopper size={16} className="text-emos" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Teamuitje</h2>
        </div>
        <span className="text-sm font-bold text-emos">{percentage}%</span>
      </div>

      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emos rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            {formatCurrency(raised)}
          </span>{" "}
          van {formatCurrency(GOAL)} opgehaald
        </p>
      </div>

      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
        {remaining > 0
          ? `Nog ${formatCurrency(
              remaining
            )} aan boetes en het eerste kratje op het teamuitje is gratis! 🍻`
          : "Doel gehaald! Het kratje staat klaar. 🎉"}
      </p>
    </section>
  );
}
