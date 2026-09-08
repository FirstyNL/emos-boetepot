"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./providers";
import type { Fine, FineType, LeaderboardEntry, Profile } from "@/lib/types";
import { startOfWeek } from "@/lib/utils";
import { fireWelcomeConfetti } from "@/lib/confetti";
import Header from "@/components/Header";
import TeamOutingProgress from "@/components/TeamOutingProgress";
import WeekPodium from "@/components/WeekPodium";
import StatsCards from "@/components/StatsCards";
import LiveFeed from "@/components/LiveFeed";
import AddFineModal from "@/components/AddFineModal";
import AvatarUploadGate from "@/components/AvatarUploadGate";

export default function DashboardPage() {
  const router = useRouter();
  const { session, profile, loading: authLoading } = useAuth();

  const [players, setPlayers] = useState<Profile[]>([]);
  const [fineTypes, setFineTypes] = useState<FineType[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [{ data: playersData }, { data: fineTypesData }, { data: finesData }] =
      await Promise.all([
        supabase.from("profiles").select("*").order("full_name"),
        supabase.from("fine_types").select("*").order("sort_order"),
        supabase
          .from("fines")
          .select("*, profiles:player_id(*), fine_types(*)")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

    setPlayers((playersData as Profile[]) || []);
    setFineTypes((fineTypesData as FineType[]) || []);
    setFines((finesData as unknown as Fine[]) || []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
    }
  }, [authLoading, session, router]);

  useEffect(() => {
    if (!session) return;
    if (sessionStorage.getItem("emos_just_logged_in")) {
      sessionStorage.removeItem("emos_just_logged_in");
      fireWelcomeConfetti();
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    loadData();

    const channel = supabase
      .channel("fines-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fines" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, loadData]);

  const weekLeaderboard = useMemo<LeaderboardEntry[]>(() => {
    const weekStart = startOfWeek();
    const totals = new Map<string, { total: number; count: number }>();

    for (const fine of fines) {
      if (new Date(fine.created_at) < weekStart) continue;
      const current = totals.get(fine.player_id) || { total: 0, count: 0 };
      current.total += fine.amount;
      current.count += 1;
      totals.set(fine.player_id, current);
    }

    return players
      .map((player) => ({
        player,
        total: totals.get(player.id)?.total || 0,
        count: totals.get(player.id)?.count || 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [fines, players]);

  const totalPot = useMemo(
    () => fines.reduce((sum, f) => sum + f.amount, 0),
    [fines]
  );
  const raisedForOuting = useMemo(
    () => fines.filter((f) => f.paid).reduce((sum, f) => sum + f.amount, 0),
    [fines]
  );
  const myBalance = useMemo(
    () =>
      fines
        .filter((f) => f.player_id === profile?.id && !f.paid)
        .reduce((sum, f) => sum + f.amount, 0),
    [fines, profile]
  );

  async function markPaid(fineId: string) {
    await supabase
      .from("fines")
      .update({ paid: true, paid_at: new Date().toISOString() })
      .eq("id", fineId);
    loadData();
  }

  if (authLoading || !session || !profile || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emos" size={28} />
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 pb-28">
      {!profile.avatar_url && <AvatarUploadGate />}
      <Header />
      <TeamOutingProgress raised={raisedForOuting} />
      <WeekPodium entries={weekLeaderboard} />
      <StatsCards totalPot={totalPot} myBalance={myBalance} />
      <LiveFeed
        fines={fines}
        isAdmin={!!profile.is_admin}
        onMarkPaid={markPaid}
      />
      <AddFineModal
        players={players}
        fineTypes={fineTypes}
        onCreated={loadData}
      />
    </main>
  );
}
