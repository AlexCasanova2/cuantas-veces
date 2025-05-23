-- 1. Estructura de las tablas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
    'missions',
    'task_stats_map',
    'user_missions',
    'user_task_progress',
    'tasks',
    'achievements',
    'user_achievements',
    'user_levels',
    'user_stats',
    'xp_log'
)
ORDER BY table_name, ordinal_position;

-- 2. Ejemplo de una misión con sus requisitos
SELECT 
    m.id,
    m.title,
    m.description,
    m.xp_reward,
    m.requirement
FROM missions m
LIMIT 1;

-- 3. Ejemplo de mapeo de estadísticas de tareas
SELECT 
    t.id as task_id,
    t.title as task_title,
    tsm.sabiduria,
    tsm.carisma,
    tsm.resistencia,
    tsm.fuerza,
    tsm.creatividad
FROM tasks t
LEFT JOIN task_stats_map tsm ON t.id = tsm.task_id
LIMIT 1;

-- 4. Ejemplo de progreso de misión de usuario
SELECT 
    um.id,
    um.user_id,
    m.title as mission_title,
    um.completed,
    um.progress,
    um.completed_at
FROM user_missions um
JOIN missions m ON um.mission_id = m.id
LIMIT 1;

-- 5. Ejemplo de progreso de tarea de usuario
SELECT 
    utp.id,
    utp.user_id,
    t.title as task_title,
    utp.count,
    utp.progress,
    utp.updated_at
FROM user_task_progress utp
JOIN tasks t ON utp.task_id = t.id
LIMIT 1;

-- 6. Ejemplo de logros y XP
SELECT 
    ua.id,
    ua.user_id,
    a.title as achievement_title,
    a.requirement,
    ua.achieved_at,
    xl.xp_earned,
    xl.source
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
LEFT JOIN xp_log xl ON ua.user_id = xl.user_id
LIMIT 1;

-- 7. Ejemplo de niveles y estadísticas de usuario
SELECT 
    ul.user_id,
    ul.level,
    ul.current_xp,
    ul.xp_to_next_level,
    us.wisdom,
    us.charisma,
    us.resistance,
    us.strength,
    us.creativity
FROM user_levels ul
JOIN user_stats us ON ul.user_id = us.user_id
LIMIT 1; 