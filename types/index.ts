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
