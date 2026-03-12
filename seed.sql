-- =============================================================================
-- SEED DATA: Profiles, Activity, and Contacts
-- Run this after schema.sql to populate the app with sample data.
-- =============================================================================

-- 1. SEED PROFILES
-- A fan user and several DJ profiles for the activity feed.
INSERT INTO "public"."profiles" ("wallet_address", "username", "bio", "avatar_url", "role")
VALUES
  ('0xFAN0000000000000000000000000000000000001', 'FanUser', 'Music lover and event collector.', '/avatars/user.jpg', 'FAN'),
  ('0xDJ00000000000000000000000000000000000001', 'iamjuampi', 'Techno producer from Buenos Aires.', '/avatars/juampi.jpg', 'DJ'),
  ('0xDJ00000000000000000000000000000000000002', 'Banger', 'Underground house DJ.', '/avatars/banger.jpg', 'DJ'),
  ('0xDJ00000000000000000000000000000000000003', 'Nicola Marti', 'Progressive house artist.', '/avatars/nicola.jpg', 'DJ'),
  ('0xDJ00000000000000000000000000000000000004', 'AXS', 'Techno & sound design.', '/avatars/axs.jpg', 'DJ'),
  ('0xDJ00000000000000000000000000000000000005', 'FLUSH', 'Dark techno vibes.', '/avatars/flush.jpg', 'DJ'),
  ('0xDJ00000000000000000000000000000000000006', 'DaniløDR', 'Melodic techno from CDMX.', '/avatars/danilo.jpg', 'DJ'),
  ('0xDJ00000000000000000000000000000000000007', 'Kr4D', 'Experimental bass music.', '/avatars/kr4d.jpg', 'DJ'),
  ('0xORG0000000000000000000000000000000000001', 'Drops', 'Official Dropsland account.', '/avatars/dropsland-logo-square.png', 'STAFF')
ON CONFLICT ("wallet_address") DO NOTHING;

-- 2. SEED ACTIVITY (for artist: juampi receives notifications)
INSERT INTO "public"."activity" ("type", "actor_wallet", "target_wallet", "action", "message", "amount", "token_name", "related_to", "created_at")
VALUES
  ('purchase', '0xDJ00000000000000000000000000000000000002', '0xDJ00000000000000000000000000000000000001', 'bought your tokens', 'Love your latest track!', 15, 'JUAMPI', 'artist', NOW() - INTERVAL '5 minutes'),
  ('mention',  '0xDJ00000000000000000000000000000000000003', '0xDJ00000000000000000000000000000000000001', 'mentioned you in a comment', '@iamjuampi could have ideas for this remix.', NULL, 'NICOLA', 'artist', NOW() - INTERVAL '15 minutes'),
  ('purchase', '0xDJ00000000000000000000000000000000000004', '0xDJ00000000000000000000000000000000000001', 'bought your tokens', NULL, 25, 'JUAMPI', 'artist', NOW() - INTERVAL '30 minutes'),
  ('reward',   '0xORG0000000000000000000000000000000000001', '0xDJ00000000000000000000000000000000000001', 'gave you a reward for your activity', '100 followers! Here''s 5 $DROPS.', 5, 'DROPS', 'artist', NOW() - INTERVAL '2 hours'),
  ('mention',  '0xDJ00000000000000000000000000000000000005', '0xDJ00000000000000000000000000000000000001', 'mentioned you in a post', 'Learning from @iamjuampi''s tutorials.', NULL, 'FLUSH', 'artist', NOW() - INTERVAL '3 hours'),
  ('purchase', '0xDJ00000000000000000000000000000000000007', '0xDJ00000000000000000000000000000000000001', 'bought your tokens', 'For your next release!', 10, 'JUAMPI', 'artist', NOW() - INTERVAL '5 hours');

-- 3. SEED ACTIVITY (for fan: FanUser receives notifications)
INSERT INTO "public"."activity" ("type", "actor_wallet", "target_wallet", "action", "message", "amount", "token_name", "related_to", "created_at")
VALUES
  ('reward',  '0xDJ00000000000000000000000000000000000002', '0xFAN0000000000000000000000000000000000001', 'released a new reward for followers', 'Exclusive track for token holders!', NULL, 'BANGER', 'fan', NOW() - INTERVAL '1 hour'),
  ('mention', '0xDJ00000000000000000000000000000000000001', '0xFAN0000000000000000000000000000000000001', 'posted a new track', 'New EP ''Techno Dimensions'' out now!', NULL, 'JUAMPI', 'fan', NOW() - INTERVAL '3 hours'),
  ('follow',  '0xDJ00000000000000000000000000000000000003', '0xFAN0000000000000000000000000000000000001', 'announced an upcoming event', 'Playing at Club Underground this weekend!', NULL, 'NICOLA', 'fan', NOW() - INTERVAL '1 day'),
  ('reward',  '0xDJ00000000000000000000000000000000000004', '0xFAN0000000000000000000000000000000000001', 'released a new production tutorial', 'Exclusive sound design tutorial available.', NULL, 'AXS', 'fan', NOW() - INTERVAL '2 days');

-- 4. SEED CONTACTS (juampi's recent send recipients)
INSERT INTO "public"."contacts" ("owner_wallet", "contact_wallet", "last_used_at")
VALUES
  ('0xDJ00000000000000000000000000000000000001', '0xDJ00000000000000000000000000000000000002', NOW() - INTERVAL '1 day'),
  ('0xDJ00000000000000000000000000000000000001', '0xDJ00000000000000000000000000000000000006', NOW() - INTERVAL '3 days'),
  ('0xDJ00000000000000000000000000000000000001', '0xDJ00000000000000000000000000000000000003', NOW() - INTERVAL '5 days'),
  ('0xDJ00000000000000000000000000000000000001', '0xDJ00000000000000000000000000000000000004', NOW() - INTERVAL '7 days')
ON CONFLICT ON CONSTRAINT "contacts_owner_contact_unique" DO NOTHING;
