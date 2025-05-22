import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'tu-secreto-super-seguro'; // En producción, usar variables de entorno

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos temporal (en memoria)
const users: {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}[] = [];

const tasks: {
    id: number;
    title: string;
    description?: string;
    category: string;
    count: number;
    date: string;
    time: string;
    progress: number;
    achievements: {
        id: number;
        title: string;
        description: string;
        requirement: number;
        achieved: boolean;
        taskId: number;
        date?: string;
    }[];
    userId: number;
}[] = [];

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar si el usuario ya existe
        if (users.some(u => u.email === email)) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);

        // Generar token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

        // Enviar respuesta sin la contraseña
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        // Enviar respuesta sin la contraseña
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Middleware de autenticación
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rutas de tareas
app.get('/api/tasks', authenticateToken, (req: any, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.userId);
    res.json(userTasks);
});

app.post('/api/tasks', authenticateToken, (req: any, res) => {
    const { title, description, category, achievements } = req.body;
    
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        category,
        count: 0,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        progress: 0,
        achievements: achievements.map((achievement: any, index: number) => ({
            id: index + 1,
            ...achievement,
            achieved: false,
            taskId: tasks.length + 1
        })),
        userId: req.user.userId
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/count', authenticateToken, (req: any, res) => {
    const taskId = parseInt(req.params.id);
    const { count } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const task = tasks[taskIndex];
    task.count = count;

    // Actualizar progreso y logros
    task.achievements.forEach(achievement => {
        if (count >= achievement.requirement && !achievement.achieved) {
            achievement.achieved = true;
            achievement.date = new Date().toISOString();
        }
    });

    // Calcular progreso
    const totalAchievements = task.achievements.length;
    const achievedCount = task.achievements.filter(a => a.achieved).length;
    task.progress = Math.round((achievedCount / totalAchievements) * 100);

    res.json(task);
});

app.delete('/api/tasks/:id', authenticateToken, (req: any, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 