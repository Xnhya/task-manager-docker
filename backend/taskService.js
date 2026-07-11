const taskStore = require('./taskStore');

/**
 * Servicio de gestión de tareas.
 * Contiene la lógica de negocio para crear, actualizar, eliminar y consultar tareas.
 */

/**
 * Obtiene todas las tareas almacenadas.
 * @returns {Array} Lista de todas las tareas.
 */
function getAllTasks() {
  return taskStore.getAll();
}

/**
 * Obtiene una tarea por su ID.
 * @param {string} id - Identificador único de la tarea.
 * @returns {Object|null} La tarea encontrada o null si no existe.
 */
function getTaskById(id) {
  return taskStore.getById(id);
}

/**
 * Crea una nueva tarea.
 * @param {Object} taskData - Datos de la tarea a crear.
 * @param {string} taskData.title - Título de la tarea (obligatorio).
 * @param {string} [taskData.description] - Descripción opcional de la tarea.
 * @returns {Object} La tarea creada con su ID asignado.
 * @throws {Error} Si el título está vacío o no se proporciona.
 */
function createTask(taskData) {
  if (!taskData.title || taskData.title.trim() === '') {
    const error = new Error('El título de la tarea es obligatorio');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const task = {
    id: generateId(),
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  taskStore.add(task);
  return task;
}

/**
 * Actualiza una tarea existente.
 * @param {string} id - Identificador de la tarea a actualizar.
 * @param {Object} updates - Campos a actualizar.
 * @returns {Object|null} La tarea actualizada o null si no se encontró.
 * @throws {Error} Si el ID no existe.
 */
function updateTask(id, updates) {
  const existing = taskStore.getById(id);
  if (!existing) {
    return null;
  }

  const updatedTask = {
    ...existing,
    title: updates.title !== undefined ? updates.title.trim() : existing.title,
    description: updates.description !== undefined ? updates.description.trim() : existing.description,
    completed: updates.completed !== undefined ? Boolean(updates.completed) : existing.completed,
    updatedAt: new Date().toISOString()
  };

  if (updatedTask.title === '') {
    const error = new Error('El título no puede estar vacío');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  taskStore.update(id, updatedTask);
  return updatedTask;
}

/**
 * Elimina una tarea por su ID.
 * @param {string} id - Identificador de la tarea a eliminar.
 * @returns {boolean} true si se eliminó, false si no se encontró.
 */
function deleteTask(id) {
  return taskStore.delete(id);
}

/**
 * Obtiene solo las tareas completadas.
 * @returns {Array} Lista de tareas completadas.
 */
function getCompletedTasks() {
  return taskStore.getAll().filter(task => task.completed);
}

/**
 * Obtiene solo las tareas pendientes.
 * @returns {Array} Lista de tareas pendientes.
 */
function getPendingTasks() {
  return taskStore.getAll().filter(task => !task.completed);
}

/**
 * Alterna el estado de completado de una tarea.
 * @param {string} id - Identificador de la tarea.
 * @returns {Object|null} La tarea actualizada o null si no se encontró.
 */
function toggleTaskCompletion(id) {
  const task = taskStore.getById(id);
  if (!task) {
    return null;
  }
  return updateTask(id, { completed: !task.completed });
}

/**
 * Genera un ID único simple basado en timestamp y random.
 * @returns {string} ID único.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Limpia todas las tareas (útil para pruebas).
 */
function clearAllTasks() {
  taskStore.clear();
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getCompletedTasks,
  getPendingTasks,
  toggleTaskCompletion,
  clearAllTasks
};
