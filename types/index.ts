export type UserRole = 'DJ' | 'FAN' | 'STAFF';

export interface Profile {
  id: string;
  wallet_address: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  created_at?: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  image_url?: string;
  perks: string[];
  onchain_token_id: number;
  creator_wallet: string;
  is_active: boolean;
}

export interface Track {
  id: string;
  artist_wallet: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  audio_file_path: string;
  duration_seconds: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
