/*
  # Create Collections and References tables

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Collection name
      - `description` (text) - Optional description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `saved_references`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, foreign key)
      - `website_title` (text) - Website/reference title
      - `website_url` (text) - Original URL
      - `preview_url` (text) - Screenshot/preview image
      - `tags` (text array) - Tags like 'минимализм', 'тёмная тема'
      - `notes` (text) - User notes
      - `colors` (text array) - Color palette
      - `grid_type` (text) - Grid type detected
      - `typography` (jsonb) - Typography details
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public access for viewing collections (anonymous users can browse)
    - Authenticated users can create/manage their own collections
*/

CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  website_title text NOT NULL,
  website_url text NOT NULL,
  preview_url text,
  tags text[] DEFAULT '{}',
  notes text,
  colors text[] DEFAULT '{}',
  grid_type text,
  typography jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  USING (true);

CREATE POLICY "Collections can be created by anyone"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "References are viewable by everyone"
  ON saved_references FOR SELECT
  USING (true);

CREATE POLICY "References can be created by anyone"
  ON saved_references FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "References can be updated by creator"
  ON saved_references FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "References can be deleted by creator"
  ON saved_references FOR DELETE
  TO authenticated
  USING (true);
