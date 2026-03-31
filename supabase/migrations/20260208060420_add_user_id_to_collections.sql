/*
  # Add user authentication to collections

  1. Changes
    - Add user_id to collections table (links to auth.users)
    - Update RLS policies to restrict access by user
    - Make collections private by default
  
  2. Security
    - Collections can only be viewed/edited by their owner
    - Only authenticated users can create collections
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE collections ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
DROP POLICY IF EXISTS "Collections can be created by anyone" ON collections;

DROP POLICY IF EXISTS "References are viewable by everyone" ON saved_references;
DROP POLICY IF EXISTS "References can be created by anyone" ON saved_references;
DROP POLICY IF EXISTS "References can be updated by creator" ON saved_references;
DROP POLICY IF EXISTS "References can be deleted by creator" ON saved_references;

CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view references in own collections"
  ON saved_references FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = saved_references.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add references to own collections"
  ON saved_references FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update references in own collections"
  ON saved_references FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = saved_references.collection_id
      AND collections.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete references in own collections"
  ON saved_references FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = saved_references.collection_id
      AND collections.user_id = auth.uid()
    )
  );
