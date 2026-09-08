"use client";

import { Wallet, Landmark, Send } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const TIKKIE_URL = process.env.NEXT_PUBLIC_TIKKIE_URL;

export default function StatsCards({
  totalPot,
  myBalance,
}: {
  totalPot: number;
  myBalance: number;
}) {
  function handleTikkie() {
    if (TIKKIE_URL) {
      window.open(TIKKIE_URL, "_blank", "noopener,noreferrer");
    } else {
      alert("Vraag de penningmeester om de Tikkie-link in te stellen.");
    }
  }

  return (
    <section className="grid grid-cols-2 gap-3 mb-5">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mb-2.5">
          <Landmark size={15} className="text-slate-500" />
        </div>
        <p className="text-xs text-slate-400 mb-0.5">Totaal in de pot</p>
        <p className="text-lg font-extrabold text-slate-900">
          {formatCurrency(totalPot)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="w-8 h-8 rounded-xl bg-emos-light flex items-center justify-center mb-2.5">
          <Wallet size={15} className="text-emos" />
        </div>
        <p className="text-xs text-slate-400 mb-0.5">Jouw openstaand saldo</p>
        <p className="text-lg font-extrabold text-slate-900 mb-2.5">
          {formatCurrency(myBalance)}
        </p>
        {myBalance > 0 && (
          <button
            onClick={handleTikkie}
            className="w-full flex items-center justify-center gap-1.5 bg-emos hover:bg-emos-dark text-white text-xs font-semibold rounded-lg py-2 transition-colors"
          >
            <Send size={12} />
            Betaal via Tikkie
          </button>
        )}
      </div>
    </section>
  );
}
