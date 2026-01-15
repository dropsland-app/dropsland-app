-- =============================================================================
-- 1. CONFIGURATION
-- =============================================================================
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- =============================================================================
-- 2. SCHEMA SETUP
-- =============================================================================
CREATE SCHEMA IF NOT EXISTS "public";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "extensions";

-- =============================================================================
-- 3. GENERIC FUNCTIONS
-- =============================================================================
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS "trigger"
LANGUAGE "plpgsql"
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =============================================================================
-- 4. TABLES
-- =============================================================================

-- 4.1 PROFILES (Identity)
-- Stores User, DJ, and Staff identities.
-- Key change: Removed strictly financial roles, added generic 'role' for app logic.
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "wallet_address" character varying(56) NOT NULL, -- Privy Wallet Address
    "username" text NOT NULL,
    "bio" text,
    "avatar_url" text,
    "role" character varying(20) DEFAULT 'FAN'::character varying, -- FAN, DJ, ORGANIZER, STAFF
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("wallet_address")
);

-- 4.2 EVENTS (The Core Primitive)
-- New table to manage the "Explore" and "Reels" event context.
CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "organizer_wallet" character varying(56) NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" text,
    "location" text NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone,
    "cover_image_url" text,
    "is_featured" boolean DEFAULT false, -- For top of Explore
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

-- 4.3 REWARDS (Off-Chain Metadata for NFTs)
-- Defines what an NFT represents (Drink, Merch, VIP).
-- The app matches on-chain NFT ownership to these definitions.
CREATE TABLE IF NOT EXISTS "public"."rewards" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "event_id" "uuid" NOT NULL, -- Link to the specific event
    "title" character varying(255) NOT NULL, -- e.g., "Free Beer", "VIP Area"
    "description" text,
    "image_url" text,
    "type" character varying(50) NOT NULL, -- MERCH, FNB (Food & Bev), ACCESS
    "onchain_contract_address" text, -- To match with the user's wallet content
    "onchain_token_id" text, -- If using 1155 or specific IDs
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);

-- 4.4 REDEMPTIONS (The Off-Chain Speed Layer)
-- Tracks usage of assets. When a user QR is scanned, this updates.
-- This replaces on-chain "spending" to ensure instant IRL throughput.
CREATE TABLE IF NOT EXISTS "public"."redemptions" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "reward_id" "uuid" NOT NULL,
    "user_wallet" character varying(56) NOT NULL, -- The attendee
    "staff_wallet" character varying(56) NOT NULL, -- The bouncer/bartender who scanned
    "redeemed_at" timestamp with time zone DEFAULT "now"(),
    "location_data" text -- Optional: specific bar/gate identifier
);

-- 4.5 POSTS (Reels & Updates)
-- Content feed for engagement. Linked to Events to drive discovery.
CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "author_wallet" character varying(56) NOT NULL,
    "event_id" "uuid", -- Optional: Use post to promote an event
    "type" character varying(20) DEFAULT 'video'::character varying, -- video (Reel), image, text
    "content" text, -- Caption or text body
    "media_url" text NOT NULL, -- Video or Image source
    "likes_count" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);

-- 4.6 COMMENTS (Engagement)
CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "post_id" "uuid" NOT NULL,
    "user_wallet" character varying(56) NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

-- 4.7 TRACKS (Future Music Layer)
-- Prepared for the music upload capability mentioned.
CREATE TABLE IF NOT EXISTS "public"."tracks" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "artist_wallet" character varying(56) NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" text,
    "cover_image_url" text,
    "audio_file_path" text NOT NULL,
    "duration_seconds" integer,
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

-- 4.8 LIKES (Social Graph)
CREATE TABLE IF NOT EXISTS "public"."post_likes" (
    "user_wallet" character varying(56) NOT NULL,
    "post_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    PRIMARY KEY ("user_wallet", "post_id")
);

-- =============================================================================
-- 5. FOREIGN KEYS
-- =============================================================================

-- Events
ALTER TABLE "public"."events" ADD CONSTRAINT "fk_event_organizer" FOREIGN KEY ("organizer_wallet") REFERENCES "public"."profiles"("wallet_address");

-- Rewards
ALTER TABLE "public"."rewards" ADD CONSTRAINT "fk_reward_event" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;

-- Redemptions
ALTER TABLE "public"."redemptions" ADD CONSTRAINT "fk_redemption_reward" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id");
ALTER TABLE "public"."redemptions" ADD CONSTRAINT "fk_redemption_user" FOREIGN KEY ("user_wallet") REFERENCES "public"."profiles"("wallet_address");
ALTER TABLE "public"."redemptions" ADD CONSTRAINT "fk_redemption_staff" FOREIGN KEY ("staff_wallet") REFERENCES "public"."profiles"("wallet_address");

-- Posts
ALTER TABLE "public"."posts" ADD CONSTRAINT "fk_post_author" FOREIGN KEY ("author_wallet") REFERENCES "public"."profiles"("wallet_address");
ALTER TABLE "public"."posts" ADD CONSTRAINT "fk_post_event" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE SET NULL;

-- Comments
ALTER TABLE "public"."comments" ADD CONSTRAINT "fk_comment_post" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;
ALTER TABLE "public"."comments" ADD CONSTRAINT "fk_comment_user" FOREIGN KEY ("user_wallet") REFERENCES "public"."profiles"("wallet_address");

-- Tracks
ALTER TABLE "public"."tracks" ADD CONSTRAINT "fk_track_artist" FOREIGN KEY ("artist_wallet") REFERENCES "public"."profiles"("wallet_address");

-- Likes
ALTER TABLE "public"."post_likes" ADD CONSTRAINT "fk_like_user" FOREIGN KEY ("user_wallet") REFERENCES "public"."profiles"("wallet_address") ON DELETE CASCADE;
ALTER TABLE "public"."post_likes" ADD CONSTRAINT "fk_like_post" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;

-- =============================================================================
-- 6. TRIGGERS (Auto-update timestamps)
-- =============================================================================

CREATE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_tracks_updated_at" BEFORE UPDATE ON "public"."tracks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- =============================================================================
-- 7. INDEXES
-- =============================================================================

-- Optimize Feed Fetching
CREATE INDEX IF NOT EXISTS "idx_posts_created_at" ON "public"."posts" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_posts_event" ON "public"."posts" ("event_id");

-- Optimize Event Discovery
CREATE INDEX IF NOT EXISTS "idx_events_start_time" ON "public"."events" ("start_time");
CREATE INDEX IF NOT EXISTS "idx_events_featured" ON "public"."events" ("is_featured") WHERE is_featured = true;

-- Optimize Redemption/Wallet Lookups
CREATE INDEX IF NOT EXISTS "idx_redemptions_user" ON "public"."redemptions" ("user_wallet");
CREATE INDEX IF NOT EXISTS "idx_rewards_event" ON "public"."rewards" ("event_id");

-- =============================================================================
-- 8. STORAGE BUCKETS & POLICIES (Corrected)
-- =============================================================================

-- 1. Create the buckets (Idempotent)
-- We use ON CONFLICT to make sure it doesn't fail if they already exist
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('audio_files', 'audio_files', true),
  ('cover_images', 'cover_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policies
-- We do NOT need to enable RLS on storage.objects; it is on by default.

-- Drop old policies if they exist to avoid conflicts on re-runs
DROP POLICY IF EXISTS "Public Access Audio" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload Audio" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload Images" ON storage.objects;

-- READ: Allow anyone to view/download files
CREATE POLICY "Public Access Audio"
ON storage.objects FOR SELECT
USING ( bucket_id = 'audio_files' );

CREATE POLICY "Public Access Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'cover_images' );

-- WRITE: Allow uploads (Authenticated & Anon for now per your request)
CREATE POLICY "Allow Upload Audio"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'audio_files' );

CREATE POLICY "Allow Upload Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'cover_images' );

-- New snippet added
-- 1. Create the Membership Tiers table
CREATE TABLE IF NOT EXISTS "public"."membership_tiers" (
    "id" "uuid" DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "creator_wallet" character varying(56) NOT NULL, -- The DJ's wallet
    "name" character varying(100) NOT NULL,          -- e.g. "Inner Circle"
    "description" text,
    "price" numeric NOT NULL,                        -- Display price (e.g., 0.05)
    "currency" text DEFAULT 'ETH',
    "image_url" text,                                -- IPFS or Storage URL
    "perks" text[],                                  -- e.g. ["Backstage", "Merch"]
    "onchain_token_id" numeric NOT NULL,             -- ID from Smart Contract
    "max_supply" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);

-- 2. Add Foreign Key to link with Profiles
ALTER TABLE "public"."membership_tiers"
    ADD CONSTRAINT "fk_tier_creator"
    FOREIGN KEY ("creator_wallet")
    REFERENCES "public"."profiles"("wallet_address");

-- 3. Enable RLS (Optional but recommended)
ALTER TABLE "public"."membership_tiers" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tiers
CREATE POLICY "Public Read Tiers" ON "public"."membership_tiers"
    FOR SELECT USING (true);

-- Allow authenticated users (DJs) to insert their own tiers
CREATE POLICY "DJs Can Create Tiers" ON "public"."membership_tiers"
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL); -- Simplified check

-- New snippet added
-- Add a role column to the profiles table
-- We default to 'fan' to be safe
ALTER TABLE "public"."profiles"
ADD COLUMN "role" text DEFAULT 'fan' CHECK (role IN ('fan', 'dj', 'admin'));
