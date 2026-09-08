"use client";

import { useRef, useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { X, Camera, Loader2, Check } from "lucide-react";
import { useAuth } from "@/app/providers";
import { supabase } from "@/lib/supabase";
import { uploadAvatar } from "@/lib/avatar";
import Avatar from "@/components/Avatar";

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { profile, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [role, setRole] = useState(profile?.role || "Speler");
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notifications_enabled ?? true);
  
  const [stats, setStats] = useState({
    totalCount: 0,
    amountOwed: 0,
    amountPaid: 0,
  });

  useEffect(() => {
    async function loadStats() {
      if (!profile?.id) return;
      const { data: fines } = await supabase
        .from("fines")
        .select("*")
        .eq("player_id", profile.id);

      if (fines) {
        let count = fines.length;
        let owed = 0;
        let paid = 0;

        fines.forEach((fine) => {
          const amt = Number(fine.amount) || 0;
          if (fine.is_paid) {
            paid += amt;
          } else {
            owed += amt;
          }
        });

        setStats({
          totalCount: count,
          amountOwed: owed,
          amountPaid: paid,
        });
      }
    }

    loadStats();
  }, [profile?.id]);

  if (!profile) return null;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      if (file) {
        await uploadAvatar(profile.id, file);
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          nickname: nickname.trim() || null,
          role: role,
          notifications_enabled: notificationsEnabled,
        })
        .eq("id", profile.id);

      if (updateError) updateError; // behoudt nette error handling

      await refreshProfile();
      setFile(null);
      setPreview(null);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full sm:max-w-md rounded-xl shadow-xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto z-10"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Instellingen en profiel</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Persoonlijke Statistieken */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
          <div>
            <p className="text-[11px] text-slate-500 font-bold">Boetes</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">{stats.totalCount}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold">Openstaand</p>
            <p className="text-sm font-black text-red-600 mt-0.5">€{stats.amountOwed}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold">Betaald</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">€{stats.amountPaid}</p>
          </div>
        </div>

        {/* Avatar Upload met duidelijke actie-indicatie */}
        <div className="flex flex-col items-center py-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative group cursor-pointer"
          >
            {preview ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emos shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Voorbeeld"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative">
                <Avatar profile={profile} size="lg" />
              </div>
            )}
            <div className="absolute inset-0 rounded-xl bg-slate-900/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="mb-0.5" />
              <span className="text-[10px] font-bold">Wijzig</span>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs font-bold text-emos hover:underline flex items-center gap-1.5"
          >
            <Camera size={14} />
            <span>Klik hier om je profielfoto te wijzigen</span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Naam */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Naam
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
          />
        </div>

        {/* Bijnaam (Optioneel) */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Bijnaam <span className="text-slate-400 font-normal lowercase">(optioneel)</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Bijv. De Tank"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
          />
        </div>

        {/* Rol van team */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Rol in het team
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3.5 py-3 text-xs focus:outline-none focus:border-emos transition"
          >
            <option value="Speler">Speler</option>
            <option value="Aanvoerder">Aanvoerder</option>
            <option value="Penningmeester">Penningmeester</option>
            <option value="Trainer / Coach">Trainer / Coach</option>
          </select>
        </div>

        {/* Custom Huisstijl Ronde Checkbox */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="checkbox"
            aria-checked={notificationsEnabled}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
              notificationsEnabled 
                ? "bg-emos border-emos text-white shadow-sm" 
                : "bg-slate-50 border-slate-300 hover:border-slate-400"
            }`}
          >
            {notificationsEnabled && <Check size={12} strokeWidth={3} />}
          </button>
          
          <label 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="text-xs font-bold text-slate-700 cursor-pointer select-none"
          >
            Notificaties en herinneringen ontvangen
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg font-bold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emos hover:bg-emos-dark text-white font-black py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-60"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Even geduld...
            </span>
          ) : saved ? (
            <span className="flex items-center gap-2">
              <Check size={16} />
              Opgeslagen
            </span>
          ) : (
            <span>Opslaan</span>
          )}
        </button>
      </form>
    </div>
  );
}