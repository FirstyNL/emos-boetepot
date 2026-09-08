"use client";

import { useState, type FormEvent } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers";
import type { Profile, FineType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function AddFineModal({
  players,
  fineTypes,
  onCreated,
}: {
  players: Profile[];
  fineTypes: FineType[];
  onCreated: () => void;
}) {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [fineTypeId, setFineTypeId] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setPlayerId("");
    setFineTypeId("");
    setCustomDescription("");
    setAmount("");
    setError(null);
  }

  function handleFineTypeChange(id: string) {
    setFineTypeId(id);
    const ft = fineTypes.find((f) => f.id === id);
    if (ft) {
      setCustomDescription(ft.label);
      setAmount(String(ft.default_amount));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError(null);

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!playerId || !customDescription || !parsedAmount || parsedAmount <= 0) {
      setError("Vul een speler, omschrijving en geldig bedrag in.");
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("fines").insert({
      player_id: playerId,
      fine_type_id: fineTypeId || null,
      description: customDescription,
      amount: parsedAmount,
      created_by: profile.id,
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    resetForm();
    setOpen(false);
    onCreated();
  }

  if (!profile?.is_admin) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-emos hover:bg-emos-dark text-white font-semibold rounded-2xl shadow-lg shadow-emos/25 pl-4 pr-5 py-3.5 transition-transform active:scale-95"
      >
        <Plus size={18} />
        Boete uitdelen
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-card p-5 space-y-4 animate-pop-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Boete uitdelen
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Speler
              </label>
              <select
                required
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
              >
                <option value="">Kies een speler...</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Soort boete
              </label>
              <select
                value={fineTypeId}
                onChange={(e) => handleFineTypeChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
              >
                <option value="">Aangepast...</option>
                {fineTypes.map((ft) => (
                  <option key={ft.id} value={ft.id}>
                    {ft.emoji} {ft.label} ({formatCurrency(ft.default_amount)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Omschrijving
              </label>
              <input
                type="text"
                required
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Te laat op training"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Bedrag
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2,50"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emos/30 focus:border-emos"
              />
            </div>

            {error && (
              <p className="text-sm text-emos bg-emos-light rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-emos hover:bg-emos-dark text-white font-semibold rounded-xl py-2.5 text-sm transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Boete toevoegen
            </button>
          </form>
        </div>
      )}
    </>
  );
}
