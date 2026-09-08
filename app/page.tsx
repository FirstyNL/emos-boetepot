"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import WeekPodium from "@/components/WeekPodium";
import TeamOutingProgress from "@/components/TeamOutingProgress";
import AddFineModal from "@/components/AddFineModal";
import OnboardingGuide from "@/components/OnboardingGuide";
import { CheckCircle2, Clock } from "lucide-react";
import type { Fine, FineType, Profile, LeaderboardEntry } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { profile } = useAuth();
  const [fines, setFines] = useState<Fine[]>([]);
  const [fineTypes, setFineTypes] = useState<FineType[]>([]);
  const [players, setPlayers] = useState<Profile[]>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "paid">("all");

  async function loadData() {
    setLoading(true);
    try {
      const [finesRes, typesRes, playersRes] = await Promise.all([
        supabase.from("fines").select("*, profiles(*), fine_types(*)").order("created_at", { ascending: false }),
        supabase.from("fine_types").select("*"),
        supabase.from("profiles").select("*"),
      ]);

      if (finesRes.data) setFines(finesRes.data as Fine[]);
      if (typesRes.data) setFineTypes(typesRes.data as FineType[]);
      if (playersRes.data) setPlayers(playersRes.data as Profile[]);
    } catch (err) {
      console.error("Fout bij laden dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!profile) return null;

  const totalPot = fines.filter((f) => f.paid).reduce((acc, f) => acc + Number(f.amount), 0);
  const myBalance = fines
    .filter((f) => f.player_id === profile.id && !f.paid)
    .reduce((acc, f) => acc + Number(f.amount), 0);

  const filteredFines = fines.filter((f) => {
    if (activeTab === "open") return !f.paid;
    if (activeTab === "paid") return f.paid;
    return true;
  });

  const playerTotals = new Map<string, { total: number; count: number; player: Profile }>();
  fines.forEach((f) => {
    if (!f.profiles) return;
    const current = playerTotals.get(f.player_id) || { total: 0, count: 0, player: f.profiles };
    playerTotals.set(f.player_id, {
      total: current.total + Number(f.amount),
      count: current.count + 1,
      player: f.profiles,
    });
  });

  const leaderboardEntries: LeaderboardEntry[] = Array.from(playerTotals.values()).sort(
    (a, b) => b.total - a.total
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {profile && profile.has_seen_guide === false && (
        <OnboardingGuide onComplete={loadData} />
      )}

      <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Header */}
        <Header />

        {/* 1. Doel teamuitje bovenaan */}
        <TeamOutingProgress raised={totalPot} fines={fines} players={players} />

        {/* 2. Week-podium direct daaronder */}
        <WeekPodium entries={leaderboardEntries} />

        {/* 3. Schatkist & Schuld naast elkaar */}
        <StatsCards totalPot={totalPot} myBalance={myBalance} />

        {/* 4. De doofpot & boetes */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">De doofpot & boetes</h2>
              <p className="text-xs text-slate-500">Overzicht van alle wandaden en betalingen.</p>
            </div>
            
            {/* Tabs filter */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                  activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Alles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("open")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                  activeTab === "open" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paid")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                  activeTab === "paid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Betaald
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Boetes aan het ophalen...</div>
          ) : filteredFines.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">Geen boetes gevonden in deze categorie.</div>
          ) : (
            <div className="space-y-2.5">
              {filteredFines.map((fine) => {
                const playerName = fine.profiles?.nickname
                  ? `${fine.profiles.full_name} (${fine.profiles.nickname})`
                  : fine.profiles?.full_name || "Onbekend";

                return (
                  <div
                    key={fine.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{playerName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                            fine.paid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {fine.paid ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {fine.paid ? "Betaald" : "Openstaand"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{fine.reason}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(fine.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {players && fineTypes && (
        <AddFineModal players={players} fineTypes={fineTypes} onCreated={loadData} />
      )}
    </main>
  );
}