"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/app/providers";
import { uploadAvatar } from "@/lib/avatar";
import Logo from "@/components/Logo";

export default function AvatarUploadGate() {
  const { profile, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleSave() {
    if (!file || !profile) return;
    setSaving(true);
    setError(null);
    try {
      await uploadAvatar(profile.id, file);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uploaden mislukt.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-card border border-slate-100 p-6 text-center animate-pop-in">
        <div className="flex justify-center mb-3">
          <Logo size={44} />
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">
          Bijna klaar, {profile?.full_name.split(" ")[0]}!
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-5">
          Upload een profielfoto zodat je teamgenoten weten wie ze beboeten.
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          className="mx-auto flex flex-col items-center justify-center gap-1 w-28 h-28 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emos hover:bg-emos-light/40 transition-colors overflow-hidden mb-5"
        >
          {preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview}
              alt="Voorbeeld"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <Camera size={22} className="text-slate-400" />
              <span className="text-xs text-slate-400 font-medium">
                Kies foto
              </span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {error && (
          <p className="text-sm text-emos bg-emos-light rounded-xl px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={!file || saving}
          className="w-full flex items-center justify-center gap-2 bg-emos hover:bg-emos-dark text-white font-semibold rounded-xl py-2.5 text-sm transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Foto opslaan
        </button>
      </div>
    </div>
  );
}
