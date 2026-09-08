"use client";

import { Activity, CheckCircle2, Clock } from "lucide-react";
import type { Fine } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LiveFeedProps {
  fines: Fine[];
  isAdmin: boolean;
  onMarkPaid: (fineId: string) => void;
}

export default function LiveFeed({ fines, isAdmin, onMarkPaid }: LiveFeedProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-emos shadow-sm">
            <Activity size={18} />
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Live Doofpot / Boetes</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">Realtime gezeik</span>
      </div>

      <div className="space-y-2.5">
        {fines.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="text-xs font-semibold text-slate-700">Rustig op het veld, niemand heeft nog schijt aan de regels.</p>
            <p className="text-[11px] text-slate-400">Of iedereen houdt z'n muil. Kan ook.</p>
          </div>
        ) : (
          fines.map((fine) => {
            const playerName = fine.profiles?.nickname 
              ? `${fine.profiles.full_name} (${fine.profiles.nickname})` 
              : fine.profiles?.full_name || "Onbekende kneus";

            return (
              <div
                key={fine.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{playerName}</span>
                    <span className="text-[10px] font-bold text-emos bg-emos/10 border border-emos/20 px-2 py-0.5 rounded-md">
                      {formatCurrency(fine.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {fine.fine_types?.name || fine.reason || "Overtreding van de buit categorie"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {fine.paid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 size={12} />
                      Getikt
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Clock size={12} />
                        Nog open
                      </span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onMarkPaid(fine.id)}
                          className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg transition shadow-sm"
                        >
                          Ontvangen 💸
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}