export interface Profile {
  id: string;
  full_name: string;
  nickname?: string | null;
  role?: string | null;
  avatar_emoji: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  notifications_enabled?: boolean;
  has_seen_guide?: boolean;
  created_at: string;
}

export interface FineType {
  id: string;
  label?: string;
  name?: string;
  amount?: number;
  default_amount: number;
  emoji: string | null;
  sort_order?: number;
}

export interface Fine {
  id: string;
  player_id: string;
  fine_type_id: string | null;
  description?: string;
  reason?: string;
  amount: number;
  paid: boolean;
  is_paid?: boolean;
  paid_at: string | null;
  created_by: string;
  created_at: string;
  profiles?: Profile;
  fine_types?: FineType | null;
}

export interface LeaderboardEntry {
  player: Profile;
  total: number;
  count: number;
}

export const TEAM_OUTING_GOAL = 250;