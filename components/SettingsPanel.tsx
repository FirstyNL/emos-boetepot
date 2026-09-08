"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
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
      if (fullName.trim() && fullName !== profile.full_name) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ full_name: fullName.trim() })
          .eq("id", profile.id);
        if (updateError) throw updateError;
      }
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
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-card p-5 space-y-4 animate-pop-in"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Instellingen</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center py-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative group"
          >
            {preview ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Voorbeeld"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Avatar profile={profile} size="lg" />
            )}
            <div className="absolute inset-0 rounded-xl bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-colors">
              <Camera
                size={18}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Naam
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : null}
          {saved ? "Opgeslagen" : "Opslaan"}
        </button>
      </form>
    </div>
  );
}
