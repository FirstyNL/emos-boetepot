export interface Profile {
  id: string;
  full_name: string;
  avatar_emoji: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface FineType {
  id: string;
  label: string;
  default_amount: number;
  emoji: string | null;
  sort_order: number;
}

export interface Fine {
  id: string;
  player_id: string;
  fine_type_id: string | null;
  description: string;
  amount: number;
  paid: boolean;
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
