"use client";

import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface WeekPodiumProps {
  entries: LeaderboardEntry[];
}

export default function WeekPodium({ entries }: WeekPodiumProps) {
  const top3 = entries.slice(0, 3);

  if (top3.length === 0 || top3.every((e) => e.total === 0)) {
    return (
      <section className="bg-white text-slate-900 rounded-xl shadow-sm border border-slate-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-3">
          {/* Strak icoon met kleine hoeken (rounded-lg) */}
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
            <Trophy size={18} />
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Week-podium zondaars</h2>
        </div>
        <p className="text-xs text-slate-500 text-center py-4">
          Nog geen boetes deze week. Iedereen houdt zich in of is gewoon te laf. 🍻
        </p>
      </section>
    );
  }

  const podiumStyles = [
    {
      badge: "🥇 Goud",
      border: "border-amber-300 bg-amber-50",
      avatarRing: "ring-2 ring-amber-500",
      bgBadge: "bg-amber-500 text-white",
    },
    {
      badge: "🥈 Zilver",
      border: "border-amber-200 bg-amber-50/60",
      avatarRing: "ring-2 ring-amber-400",
      bgBadge: "bg-amber-100 text-amber-800",
    },
    {
      badge: "🥉 Brons",
      border: "border-orange-200 bg-orange-50/50",
      avatarRing: "ring-2 ring-orange-400",
      bgBadge: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <section className="bg-white text-slate-900 rounded-xl shadow-sm border border-slate-200 p-5 mb-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Strak icoon met kleine hoeken (rounded-lg) */}
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
            <Trophy size={18} />
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Week-podium zondaars</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">Deze week</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {top3.map((entry, index) => {
          const style = podiumStyles[index];
          const name = entry.player.nickname
            ? `${entry.player.full_name} (${entry.player.nickname})`
            : entry.player.full_name;

          return (
            <div
              key={entry.player.id}
              className={`flex items-center justify-between p-3.5 rounded-lg border ${style.border} transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {entry.player.avatar_url ? (
                    <img
                      src={entry.player.avatar_url}
                      alt={name}
                      className={`w-10 h-10 rounded-lg object-cover ${style.avatarRing}`}
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs ${style.avatarRing}`}
                    >
                      {name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-white text-slate-900 shadow-sm border border-slate-200">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${style.bgBadge}`}>
                      {style.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {entry.count} {entry.count === 1 ? "boete" : "boetes"} deze week. Lekker bezig kneus.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-slate-900">
                  {formatCurrency(entry.total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}