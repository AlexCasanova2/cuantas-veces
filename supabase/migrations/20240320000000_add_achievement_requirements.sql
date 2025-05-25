-- Añadir columna achievementRequirements a la tabla missions
ALTER TABLE missions
ADD COLUMN achievement_requirements JSONB DEFAULT '[]'::jsonb;
 
-- Actualizar las misiones existentes para que tengan un array vacío como valor por defecto
UPDATE missions
SET achievement_requirements = '[]'::jsonb
WHERE achievement_requirements IS NULL; 