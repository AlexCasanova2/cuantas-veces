-- Añadir campos bio y avatar_url a la tabla profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Crear bucket para avatares si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Avatares públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir sus propios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios avatares" ON storage.objects;

-- Crear políticas simplificadas para el bucket de avatares
CREATE POLICY "Acceso público a avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Usuarios autenticados pueden subir avatares"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios autenticados pueden actualizar sus avatares"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios autenticados pueden eliminar sus avatares"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
); 