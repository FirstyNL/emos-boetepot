"use client";

import { Wallet, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  totalPot: number;
  myBalance: number;
}

export default function StatsCards({ totalPot, myBalance }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Totaal in de pot */}
      <div className="bg-white text-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <Wallet size={18} />
          </div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">De schatkist</h3>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
            {formatCurrency(totalPot)}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalPot === 0 ? "Nog lege boel, tering hé" : "Lekker cashen voor de bierboot 🍻"}
          </p>
        </div>
      </div>

      {/* Openstaand saldo */}
      <div className="bg-white text-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
            <AlertCircle size={18} />
          </div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Jouw schuld</h3>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
            {formatCurrency(myBalance)}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {myBalance > 0 ? "Betalen droeftoeter, voor ze je tanden tellen 👊" : "Netjes, je staat op 0 lul"}
          </p>
        </div>
      </div>
    </div>
  );
}
