/**
 * Almacenamiento en memoria para tareas.
 * Simula una base de datos con un array en memoria.
 */

let tasks = [];

/**
 * Obtiene todas las tareas.
 * @returns {Array} Copia del array de tareas.
 */
function getAll() {
  return [...tasks];
}

/**
 * Obtiene una tarea por ID.
 * @param {string} id - ID de la tarea.
 * @returns {Object|undefined} La tarea o undefined.
 */
function getById(id) {
  return tasks.find(task => task.id === id);
}

/**
 * Agrega una nueva tarea.
 * @param {Object} task - Tarea a agregar.
 */
function add(task) {
  tasks.push(task);
}

/**
 * Actualiza una tarea existente.
 * @param {string} id - ID de la tarea.
 * @param {Object} updatedTask - Tarea actualizada.
 * @returns {boolean} true si se actualizó, false si no se encontró.
 */
function update(id, updatedTask) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return false;
  tasks[index] = updatedTask;
  return true;
}

/**
 * Elimina una tarea por ID.
 * @param {string} id - ID de la tarea.
 * @returns {boolean} true si se eliminó, false si no se encontró.
 */
function deleteById(id) {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return tasks.length < initialLength;
}

/**
 * Limpia todas las tareas.
 */
function clear() {
  tasks = [];
}

/**
 * Obtiene el total de tareas.
 * @returns {number} Cantidad de tareas.
 */
function count() {
  return tasks.length;
}

module.exports = {
  getAll,
  getById,
  add,
  update,
  delete: deleteById,
  clear,
  count
};
