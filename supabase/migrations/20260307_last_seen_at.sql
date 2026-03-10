-- Add last_seen_at to profiles for accurate "last active" tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;

-- Allow users to update their own last_seen_at (already covered by existing update policy)
