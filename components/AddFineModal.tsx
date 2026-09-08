"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { FineType, Profile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface AddFineModalProps {
  players: Profile[];
  fineTypes: FineType[];
  onCreated: () => void;
}

export default function AddFineModal({ players, fineTypes, onCreated }: AddFineModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const activeFineType = fineTypes.find((t) => t.id === selectedType);
  const amountToCharge = activeFineType ? activeFineType.amount : Number(customAmount) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlayer || (!selectedType && !customReason)) return;

    setLoading(true);
    const { error } = await supabase.from("fines").insert({
      player_id: selectedPlayer,
      fine_type_id: selectedType || null,
      amount: amountToCharge,
      reason: activeFineType ? activeFineType.name : customReason,
      paid: false,
    });

    setLoading(false);
    if (!error) {
      setIsOpen(false);
      setSelectedPlayer("");
      setSelectedType("");
      setCustomReason("");
      setCustomAmount("");
      onCreated();
    } else {
      alert("Fout tijdens het uitdelen, lekker handig weer.");
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-emos hover:bg-emos-dark text-white font-black p-4 rounded-2xl shadow-xl flex items-center gap-2 transition"
        >
          <Plus size={20} />
          <span className="text-xs uppercase tracking-wider hidden sm:inline">Boete uitdelen</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">Koekenbakker natellen 👮‍♂️</h2>
                <p className="text-xs text-slate-500">Naai een teamgenoot na voor een overtreding.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wie is de dader?
                </label>
                <select
                  required
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emos"
                >
                  <option value="">Kies de zondaar...</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nickname ? `${p.full_name} (${p.nickname})` : p.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wat heeft ie nu weer geflikt?
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    if (e.target.value) {
                      setCustomReason("");
                      setCustomAmount("");
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emos"
                >
                  <option value="">Kies een standaard geintje...</option>
                  {fineTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({formatCurrency(t.amount)})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedType && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Eigen reden
                    </label>
                    <input
                      type="text"
                      placeholder="Bijv. Te laat door een kater"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bedrag (€)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emos"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emos hover:bg-emos-dark text-white font-black py-3.5 rounded-2xl transition shadow-lg text-xs uppercase tracking-wider mt-2 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Boete direct opleggen 🔨"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}