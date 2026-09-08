"use client";

import { useAuth } from "@/app/providers";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import SettingsPanel from "./SettingsPanel";

export default function Header() {
  const { profile, signOut } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [slogan, setSlogan] = useState("geen smoesjes.");

  useEffect(() => {
    // Haal de willekeurige slogan op die bij het inloggen in de sessie is gezet
    const savedSlogan = sessionStorage.getItem("emos_user_slogan");
    if (savedSlogan) {
      setSlogan(savedSlogan);
    }
  }, []);

  if (!profile) return null;

  const displayName = profile.nickname || profile.full_name;

  return (
    <>
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {displayName}, {slogan}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welkom in het digitale slachtofferhok.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 bg-white text-slate-900 p-1.5 sm:pr-3.5 rounded-xl hover:bg-slate-50 transition shadow-sm border border-slate-200"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-9 h-9 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-emos flex items-center justify-center font-bold text-white text-xs shadow-sm">
                {displayName.charAt(0)}
              </div>
            )}
            <User size={16} className="text-slate-500 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-black text-slate-900 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 capitalize font-medium">{profile.role || "Teamslachtoffer"}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  setShowSettings(true);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-left"
              >
                <Settings size={14} className="text-slate-400" />
                Profiel & Instellingen
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut size={14} className="text-red-500" />
                Oprotten (Uitloggen)
              </button>
            </div>
          )}
        </div>
      </header>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}