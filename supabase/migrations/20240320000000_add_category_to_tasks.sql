-- Añadir la columna category_id a la tabla tasks
ALTER TABLE tasks
ADD COLUMN category_id bigint REFERENCES categories(id);

-- Actualizar las tareas existentes para asignarles una categoría por defecto
UPDATE tasks
SET category_id = (SELECT id FROM categories WHERE name = 'Hábitos Diarios' LIMIT 1)
WHERE category_id IS NULL;

-- Hacer que la columna category_id sea NOT NULL después de la actualización
ALTER TABLE tasks
ALTER COLUMN category_id SET NOT NULL; 