"use client";

import { useMemo, useState } from "react";
import { LogOut, ShieldCheck, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "@/app/providers";
import { pickGreeting } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import SettingsPanel from "@/components/SettingsPanel";

export default function Header() {
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const greeting = useMemo(
    () => (profile ? pickGreeting(profile.full_name) : ""),
    [profile]
  );

  if (!profile) return null;

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          {greeting}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Welkom bij de boetepot van RKSV EMOS.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 bg-white border border-slate-100 shadow-sm rounded-2xl pl-2 pr-3 py-2 hover:shadow transition-shadow"
        >
          <Avatar profile={profile} size="sm" />
          {profile.is_admin && (
            <ShieldCheck size={16} className="text-emos hidden sm:block" />
          )}
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-slate-100 py-1.5 z-20 animate-pop-in">
              <div className="px-3.5 py-2 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {profile.full_name}
                </p>
                {profile.is_admin && (
                  <p className="text-xs text-emos font-medium">Beheerder</p>
                )}
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSettingsOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Settings size={15} />
                Instellingen
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <LogOut size={15} />
                Uitloggen
              </button>
            </div>
          </>
        )}
      </div>

      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}
    </header>
  );
}
