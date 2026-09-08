"use client";

import { Radio, Check } from "lucide-react";
import type { Fine } from "@/lib/types";
import { formatCurrency, timeAgo, firstName } from "@/lib/utils";
import Avatar from "@/components/Avatar";

export default function LiveFeed({
  fines,
  isAdmin,
  onMarkPaid,
}: {
  fines: Fine[];
  isAdmin: boolean;
  onMarkPaid: (fineId: string) => void;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Radio size={16} className="text-emos" />
        <h2 className="text-sm font-bold text-slate-900">Live feed</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
        {fines.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">
            Nog geen boetes uitgedeeld. Rustig aan, dat komt wel.
          </p>
        ) : (
          fines.map((fine) => (
            <div
              key={fine.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar profile={fine.profiles} size="md" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-800 truncate">
                    <span className="font-semibold">
                      {firstName(fine.profiles?.full_name || "Onbekend")}
                    </span>{" "}
                    {fine.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatCurrency(fine.amount)} · {timeAgo(fine.created_at)}
                  </p>
                </div>
              </div>

              {fine.paid ? (
                <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1">
                  <Check size={12} />
                  Betaald
                </span>
              ) : isAdmin ? (
                <button
                  onClick={() => onMarkPaid(fine.id)}
                  className="shrink-0 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  Markeer betaald
                </button>
              ) : (
                <span className="shrink-0 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
                  Open
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
