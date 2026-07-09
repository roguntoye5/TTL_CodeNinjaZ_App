/*
# Skill Otter - Initial Schema

## Summary
Creates the core tables for the Skill Otter community platform where users can share skills,
join programs, and connect with others in their community.

## New Tables

### profiles
Stores public user profile data linked to Supabase auth users.
- id: UUID primary key (matches auth.users.id)
- username: unique display name
- bio: short self-description
- avatar_url: optional profile photo URL
- instagram: optional Instagram handle
- email_public: optional public contact email
- gofundme_url: optional GoFundMe link
- created_at: timestamp

### programs
A catalog of skill-share programs/categories available on the platform.
- id: UUID primary key
- name: program name (e.g. "Art", "Language Exchange")
- description: optional description
- created_at: timestamp

### user_programs
Junction table linking users to programs they belong to.
- id: UUID primary key
- user_id: references profiles.id
- program_id: references programs.id
- role: 'learner' or 'teacher'
- created_at: timestamp

### interests
Free-form interest tags users can add to their profile.
- id: UUID primary key
- user_id: references profiles.id
- name: interest label
- created_at: timestamp

## Security
- RLS enabled on all tables
- profiles: users can read all profiles (public community), only edit their own
- programs: public read-only
- user_programs: users can read all, only manage their own memberships
- interests: users can read all, only manage their own
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  instagram text DEFAULT '',
  email_public text DEFAULT '',
  gofundme_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- PROGRAMS
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "programs_select" ON programs;
CREATE POLICY "programs_select" ON programs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "programs_insert" ON programs;
CREATE POLICY "programs_insert" ON programs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "programs_update" ON programs;
CREATE POLICY "programs_update" ON programs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "programs_delete" ON programs;
CREATE POLICY "programs_delete" ON programs FOR DELETE
  TO authenticated USING (true);

-- USER_PROGRAMS
CREATE TABLE IF NOT EXISTS user_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'teacher')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, program_id)
);

ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_programs_select" ON user_programs;
CREATE POLICY "user_programs_select" ON user_programs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "user_programs_insert" ON user_programs;
CREATE POLICY "user_programs_insert" ON user_programs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_programs_update" ON user_programs;
CREATE POLICY "user_programs_update" ON user_programs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_programs_delete" ON user_programs;
CREATE POLICY "user_programs_delete" ON user_programs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- INTERESTS
CREATE TABLE IF NOT EXISTS interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "interests_select" ON interests;
CREATE POLICY "interests_select" ON interests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "interests_insert" ON interests;
CREATE POLICY "interests_insert" ON interests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "interests_update" ON interests;
CREATE POLICY "interests_update" ON interests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "interests_delete" ON interests;
CREATE POLICY "interests_delete" ON interests FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Seed default programs
INSERT INTO programs (name, description) VALUES
  ('Art & Creativity', 'Painting, drawing, sculpture, digital art, and other creative pursuits'),
  ('Music', 'Instruments, singing, music theory, and production'),
  ('Language Exchange', 'Learn and teach languages with native speakers'),
  ('Coding & Tech', 'Programming, web development, and technology skills'),
  ('Fitness & Wellness', 'Exercise, yoga, meditation, and healthy living'),
  ('Cooking & Baking', 'Recipes, techniques, and culinary traditions'),
  ('Photography', 'Camera skills, composition, and editing'),
  ('Writing & Storytelling', 'Creative writing, journaling, and storytelling'),
  ('Gardening & Nature', 'Plants, sustainability, and outdoor skills'),
  ('Math & Science', 'Tutoring, experiments, and STEM exploration')
ON CONFLICT DO NOTHING;
