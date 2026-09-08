"use client";

import { Trophy, CheckCircle2 } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";
import { formatCurrency, firstName } from "@/lib/utils";
import Avatar from "@/components/Avatar";

const RANK_STYLE = [
  {
    ring: "ring-2 ring-emos",
    badgeBg: "bg-emos",
    badgeText: "text-white",
    labels: [
      "Grootste Loser van de Week 👑",
      "Sponsor van de Club 💸",
      "Koop gewoon een wekker...",
    ],
  },
  {
    ring: "ring-1 ring-slate-200",
    badgeBg: "bg-slate-800",
    badgeText: "text-white",
    labels: ["Rookie van de week", "Verdiende zilver 🥈"],
  },
  {
    ring: "ring-1 ring-slate-200",
    badgeBg: "bg-amber-600",
    badgeText: "text-white",
    labels: ["Bijna op het schavot", "Net ontsnapt"],
  },
];

function pickLabel(labels: string[], seed: number) {
  return labels[seed % labels.length];
}

export default function WeekPodium({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  const top3 = entries.slice(0, 3);

  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={16} className="text-emos" />
        <h2 className="text-sm font-bold text-slate-900">
          Week-podium — Top boetepakkers
        </h2>
      </div>

      {top3.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center text-sm text-slate-400">
          Deze week nog geen boetes. Verdacht rustig eigenlijk. 🤨
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {top3.map((entry, i) => {
            const style = RANK_STYLE[i];
            const label =
              entry.total === 0
                ? null
                : pickLabel(style.labels, entry.player.id.length + i);
            return (
              <div
                key={entry.player.id}
                className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 ${style.ring}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar profile={entry.player} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {firstName(entry.player.full_name)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {entry.count} boete{entry.count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(entry.total)}
                  </span>
                </div>

                {entry.total === 0 ? (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg px-2.5 py-1.5 w-fit">
                    <CheckCircle2 size={13} />
                    Liefste jongetje van de klas 😇
                  </div>
                ) : (
                  <div
                    className={`${style.badgeBg} ${style.badgeText} text-xs font-semibold rounded-lg px-2.5 py-1.5 w-fit`}
                  >
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
