"use client";

import { useState } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers";

export default function AvatarUploadGate() {
  const { profile } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0 || !profile) return;
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;
      window.location.reload();
    } catch (error) {
      alert("Misgegaan met uploaden, probeer opnieuw lul.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl text-white">
        <div className="w-16 h-16 bg-emos/20 text-emos rounded-2xl mx-auto flex items-center justify-center">
          <Camera size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight">Kop d'r bij! 📸</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Geen smoesjes over privacy. Je moet eerst even een duidelijke smoelenboek-foto uploaden voordat je de app in mag. Zo weet iedereen wie er weer heeft zitten klooien.
          </p>
        </div>

        <label className="block w-full cursor-pointer bg-emos hover:bg-emos-dark text-slate-950 font-black py-3.5 px-4 rounded-2xl transition shadow-lg text-center text-sm">
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Bezig met uploaden...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload size={18} />
              Kies jouw lelijke snufferd
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}