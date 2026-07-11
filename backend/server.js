const express = require('express');
const path = require('path');
const taskService = require('./taskService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ============================================
// RUTAS API REST
// ============================================

/**
 * GET /api/tasks
 * Obtiene todas las tareas.
 */
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = taskService.getAllTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/tasks/:id
 * Obtiene una tarea por ID.
 */
app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/tasks
 * Crea una nueva tarea.
 * Body: { title: string, description?: string }
 */
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description } = req.body;
    const task = taskService.createTask({ title, description });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/tasks/:id
 * Actualiza una tarea existente.
 * Body: { title?: string, description?: string, completed?: boolean }
 */
app.put('/api/tasks/:id', (req, res) => {
  try {
    const updated = taskService.updateTask(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/tasks/:id
 * Elimina una tarea.
 */
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const deleted = taskService.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/tasks/:id/toggle
 * Alterna el estado de completado de una tarea.
 */
app.patch('/api/tasks/:id/toggle', (req, res) => {
  try {
    const toggled = taskService.toggleTaskCompletion(req.params.id);
    if (!toggled) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, data: toggled });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/tasks/stats/summary
 * Obtiene estadísticas resumidas de las tareas.
 */
app.get('/api/tasks/stats/summary', (req, res) => {
  try {
    const all = taskService.getAllTasks();
    const completed = taskService.getCompletedTasks();
    const pending = taskService.getPendingTasks();

    res.json({
      success: true,
      data: {
        total: all.length,
        completed: completed.length,
        pending: pending.length,
        completionRate: all.length > 0 ? ((completed.length / all.length) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Servir index.html para cualquier ruta no-API (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Task Manager corriendo en http://localhost:${PORT}`);
  console.log(`✓ API disponible en http://localhost:${PORT}/api/tasks`);
});

module.exports = app;
