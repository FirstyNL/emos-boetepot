"use client";

import { useState } from "react";
import { PartyPopper, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { TEAM_OUTING_GOAL as GOAL, type Fine, type Profile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface TeamOutingProgressProps {
  raised: number;
  fines?: Fine[];
  players?: Profile[];
}

export default function TeamOutingProgress({
  raised,
  fines = [],
  players = [],
}: TeamOutingProgressProps) {
  const [showContributors, setShowContributors] = useState(false);
  const percentage = Math.min(100, Math.round((raised / GOAL) * 100));
  const remaining = Math.max(0, GOAL - raised);

  const contributorMap = new Map<string, number>();
  if (fines && fines.length > 0) {
    fines.forEach((fine) => {
      if (fine.paid) {
        const current = contributorMap.get(fine.player_id) || 0;
        contributorMap.set(fine.player_id, current + fine.amount);
      }
    });
  }

  const topContributors = players
    .map((player) => ({
      player,
      totalPaid: contributorMap.get(player.id) || 0,
    }))
    .filter((item) => item.totalPaid > 0)
    .sort((a, b) => b.totalPaid - a.totalPaid);

  function getMilestoneText() {
    if (percentage >= 100) return "Doel gehaald! De bierboot kan uitvaren, zuipen op kosten van de overtreders! 🍻🔥";
    if (percentage >= 75) return "Bijna binnen! Nog ff doorbijten en we gaan de kroeg afbreken. 🍟";
    if (percentage >= 50) return "Al over de helft! De eerste kratten zijn binnen dank jullie wel, mafketels. 💪";
    if (percentage >= 25) return "Lekker bezig, de kas begint te spoken. Doorstampen nu! 🧱";
    return "De pot is pas net open. Tijd om die koekenbakkers op de bon te slingeren. 📉";
  }

  return (
    <section className="bg-white text-slate-900 rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <PartyPopper size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Doel teamuitje</h2>
            <p className="text-xs text-slate-500">Doel: {formatCurrency(GOAL)}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-black text-emerald-600">{percentage}%</span>
        </div>
      </div>

      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-700">
          <span className="font-black text-slate-900">
            {formatCurrency(raised)}
          </span>{" "}
          <span className="text-slate-400 font-normal">van {formatCurrency(GOAL)}</span>
        </p>
        <p className="text-xs font-semibold text-slate-500">
          {remaining > 0 ? `Nog ${formatCurrency(remaining)} te gaan` : "Vol getikt! 🏆"}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed flex items-center gap-2.5">
        <span className="text-base">🎯</span>
        <p className="font-medium">{getMilestoneText()}</p>
      </div>

      {players.length > 0 && fines.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowContributors(!showContributors)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-900 transition py-1"
          >
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" />
              <span>Wie spekte de pot het hardst? ({topContributors.length} betalers)</span>
            </div>
            {showContributors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showContributors && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
              {topContributors.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">
                  Nog niks betaald, lekkere gierige bende bij elkaar.
                </p>
              ) : (
                topContributors.map(({ player, totalPaid }, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 w-4 text-right">
                        #{index + 1}
                      </span>
                      <span className="font-bold text-slate-800">
                        {player.nickname ? `${player.full_name} (${player.nickname})` : player.full_name}
                      </span>
                    </div>
                    <span className="font-black text-emerald-600">
                      +{formatCurrency(totalPaid)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}