-- ============================================================
-- ONLYMAN Database Schema for Supabase
-- ============================================================
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- after creating a new project.
-- ============================================================

-- Enable PostGIS for geolocation queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── Profiles ──
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  photos TEXT[] DEFAULT '{}',
  tribe TEXT DEFAULT '',
  body_type TEXT DEFAULT '',
  height TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  position TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  looking_for TEXT[] DEFAULT '{}',
  
  -- Location (PostGIS point)
  location GEOGRAPHY(POINT, 4326),
  
  -- Status
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away')),
  ghost_mode BOOLEAN DEFAULT FALSE,
  right_now_until TIMESTAMPTZ DEFAULT NULL,
  
  -- Premium
  user_number INTEGER UNIQUE,
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  verified BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Conversations ──
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant1, participant2)
);

-- ── Messages ──
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Blocks ──
CREATE TABLE IF NOT EXISTS blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- ── Spark Likes ──
CREATE TABLE IF NOT EXISTS spark_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  liker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  liked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_mutual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- ── Events ──
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Social',
  image TEXT DEFAULT '',
  date TIMESTAMPTZ NOT NULL,
  location TEXT DEFAULT '',
  location_point GEOGRAPHY(POINT, 4326),
  attendees INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Event Attendees ──
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ── Albums ──
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  cover_url TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT FALSE,
  shared_with UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Album Photos ──
CREATE TABLE IF NOT EXISTS album_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Push Subscriptions ──
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- ============================================================
-- Functions
-- ============================================================

-- Get nearby profiles using PostGIS
CREATE OR REPLACE FUNCTION get_nearby_profiles(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  age INTEGER,
  bio TEXT,
  avatar_url TEXT,
  tribe TEXT,
  body_type TEXT,
  status TEXT,
  verified BOOLEAN,
  distance_km DOUBLE PRECISION,
  interests TEXT[],
  looking_for TEXT[],
  right_now_until TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.age,
    p.bio,
    p.avatar_url,
    p.tribe,
    p.body_type,
    p.status,
    p.verified,
    ROUND((ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000)::numeric, 1)::double precision AS distance_km,
    p.interests,
    p.looking_for,
    p.right_now_until
  FROM profiles p
  WHERE p.ghost_mode = FALSE
    AND p.location IS NOT NULL
    AND ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC;
END;
$$;

-- Increment event attendees count
CREATE OR REPLACE FUNCTION increment_event_attendees(event_id_input UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE events SET attendees = attendees + 1 WHERE id = event_id_input;
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(user_number), 0) + 1 INTO next_number FROM profiles;
  
  INSERT INTO profiles (id, name, age, user_number, is_premium)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 18),
    next_number,
    next_number <= 1000
  );
  RETURN NEW;
END;
$$;

-- Trigger: auto-create profile on auth signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE spark_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all non-ghost profiles, update own
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (ghost_mode = FALSE OR id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- Conversations: only participants can read
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (participant1 = auth.uid() OR participant2 = auth.uid());
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (participant1 = auth.uid() OR participant2 = auth.uid());

-- Messages: participants of the conversation can read/write
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM conversations WHERE participant1 = auth.uid() OR participant2 = auth.uid())
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Blocks: users can manage own blocks
CREATE POLICY "Users can view own blocks" ON blocks FOR SELECT USING (blocker_id = auth.uid());
CREATE POLICY "Users can create blocks" ON blocks FOR INSERT WITH CHECK (blocker_id = auth.uid());
CREATE POLICY "Users can delete own blocks" ON blocks FOR DELETE USING (blocker_id = auth.uid());

-- Spark likes: users can manage own likes
CREATE POLICY "Users can view own likes" ON spark_likes FOR SELECT USING (liker_id = auth.uid() OR liked_id = auth.uid());
CREATE POLICY "Users can create likes" ON spark_likes FOR INSERT WITH CHECK (liker_id = auth.uid());

-- Events: public read, authenticated create
CREATE POLICY "Events are viewable by all" ON events FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated can create events" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Event attendees
CREATE POLICY "Event attendees viewable" ON event_attendees FOR SELECT USING (TRUE);
CREATE POLICY "Users can join events" ON event_attendees FOR INSERT WITH CHECK (user_id = auth.uid());

-- Albums: owner + shared users can view
CREATE POLICY "Album owner can manage" ON albums FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Shared albums are viewable" ON albums FOR SELECT USING (
  is_private = FALSE OR owner_id = auth.uid() OR auth.uid() = ANY(shared_with)
);

-- Album photos
CREATE POLICY "Album photo access follows album" ON album_photos FOR SELECT USING (
  album_id IN (SELECT id FROM albums WHERE is_private = FALSE OR owner_id = auth.uid() OR auth.uid() = ANY(shared_with))
);
CREATE POLICY "Album owner can manage photos" ON album_photos FOR ALL USING (
  album_id IN (SELECT id FROM albums WHERE owner_id = auth.uid())
);

-- Push subscriptions: own only
CREATE POLICY "Users manage own push subs" ON push_subscriptions FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles (status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations (participant1, participant2);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks (blocker_id);
CREATE INDEX IF NOT EXISTS idx_spark_likes_liker ON spark_likes (liker_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (date);

-- ============================================================
-- Storage Buckets (run in Supabase Dashboard > Storage)
-- ============================================================
-- Create a bucket called "photos" with public access
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
