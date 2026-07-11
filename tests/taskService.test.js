/**
 * Pruebas Unitarias - TaskService
 * Jest test suite para la lógica de negocio del gestor de tareas.
 *
 * Principios y procedimientos:
 * - Cada prueba verifica una función específica del servicio.
 * - Se usa el store en memoria para pruebas aisladas.
 * - Se limpian los datos después de cada prueba.
 * - Se cubren casos normales y casos de borde (edge cases).
 */

const taskService = require('../backend/taskService');
const taskStore = require('../backend/taskStore');

// Limpiar store antes de cada prueba
beforeEach(() => {
  taskStore.clear();
});

afterEach(() => {
  taskStore.clear();
});

// ============================================
// 8.1 EXPERIMENTACIÓN - Diseño de Experimentos
// Pruebas que verifican los objetivos, principios y procedimientos del servicio.
// ============================================

describe('8.1 Experimentación - Diseño de Pruebas', () => {

  describe('createTask - Creación de tareas', () => {
    test('crea una tarea con título válido', () => {
      const task = taskService.createTask({ title: 'Comprar útiles' });
      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Comprar útiles');
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeDefined();
    });

    test('crea una tarea con título y descripción', () => {
      const task = taskService.createTask({
        title: 'Estudiar para el examen',
        description: 'Revisar capítulos 1 al 5'
      });
      expect(task.title).toBe('Estudiar para el examen');
      expect(task.description).toBe('Revisar capítulos 1 al 5');
    });

    test('elimina espacios en blanco al inicio y fin del título', () => {
      const task = taskService.createTask({ title: '  Tarea limpia  ' });
      expect(task.title).toBe('Tarea limpia');
    });

    test('lanza error si el título está vacío', () => {
      expect(() => taskService.createTask({ title: '' }))
        .toThrow('El título de la tarea es obligatorio');
    });

    test('lanza error si el título es solo espacios', () => {
      expect(() => taskService.createTask({ title: '   ' }))
        .toThrow('El título de la tarea es obligatorio');
    });

    test('lanza error si no se proporciona título', () => {
      expect(() => taskService.createTask({}))
        .toThrow('El título de la tarea es obligatorio');
    });
  });

  describe('getAllTasks - Listado de tareas', () => {
    test('retorna array vacío cuando no hay tareas', () => {
      expect(taskService.getAllTasks()).toEqual([]);
    });

    test('retorna todas las tareas creadas', () => {
      taskService.createTask({ title: 'Tarea 1' });
      taskService.createTask({ title: 'Tarea 2' });
      taskService.createTask({ title: 'Tarea 3' });
      const tasks = taskService.getAllTasks();
      expect(tasks).toHaveLength(3);
    });
  });

  describe('getTaskById - Búsqueda por ID', () => {
    test('retorna la tarea cuando el ID existe', () => {
      const created = taskService.createTask({ title: 'Tarea buscada' });
      const found = taskService.getTaskById(created.id);
      expect(found).toBeDefined();
      expect(found.title).toBe('Tarea buscada');
    });

    test('retorna null cuando el ID no existe', () => {
      const found = taskService.getTaskById('id-inexistente-123');
      expect(found).toBeNull();
    });
  });

  describe('updateTask - Actualización de tareas', () => {
    test('actualiza el título de una tarea existente', () => {
      const task = taskService.createTask({ title: 'Título original' });
      const updated = taskService.updateTask(task.id, { title: 'Título actualizado' });
      expect(updated.title).toBe('Título actualizado');
    });

    test('actualiza la descripción', () => {
      const task = taskService.createTask({ title: 'Tarea' });
      const updated = taskService.updateTask(task.id, {
        description: 'Nueva descripción'
      });
      expect(updated.description).toBe('Nueva descripción');
    });

    test('actualiza el estado completed', () => {
      const task = taskService.createTask({ title: 'Tarea pendiente' });
      expect(task.completed).toBe(false);
      const updated = taskService.updateTask(task.id, { completed: true });
      expect(updated.completed).toBe(true);
    });

    test('retorna null si la tarea no existe', () => {
      const updated = taskService.updateTask('id-falso', { title: 'Nuevo' });
      expect(updated).toBeNull();
    });

    test('lanza error al actualizar con título vacío', () => {
      const task = taskService.createTask({ title: 'Tarea' });
      expect(() => taskService.updateTask(task.id, { title: '' }))
        .toThrow('El título no puede estar vacío');
    });
  });

  describe('deleteTask - Eliminación de tareas', () => {
    test('elimina una tarea existente', () => {
      const task = taskService.createTask({ title: 'Tarea a eliminar' });
      const result = taskService.deleteTask(task.id);
      expect(result).toBe(true);
      expect(taskService.getAllTasks()).toHaveLength(0);
    });

    test('retorna false si la tarea no existe', () => {
      const result = taskService.deleteTask('id-inexistente');
      expect(result).toBe(false);
    });
  });

  describe('toggleTaskCompletion - Alternar completado', () => {
    test('cambia de pendiente a completado', () => {
      const task = taskService.createTask({ title: 'Tarea' });
      expect(task.completed).toBe(false);
      const toggled = taskService.toggleTaskCompletion(task.id);
      expect(toggled.completed).toBe(true);
    });

    test('cambia de completado a pendiente', () => {
      const task = taskService.createTask({ title: 'Tarea' });
      taskService.updateTask(task.id, { completed: true });
      const toggled = taskService.toggleTaskCompletion(task.id);
      expect(toggled.completed).toBe(false);
    });

    test('retorna null si la tarea no existe', () => {
      const toggled = taskService.toggleTaskCompletion('no-existe');
      expect(toggled).toBeNull();
    });
  });
});

// ============================================
// 8.2 EXPERIMENTACIÓN - Análisis e Interpretación de Resultados
// Clasificación e identificación de información relevante en los resultados.
// ============================================

describe('8.2 Experimentación - Análisis e Interpretación de Resultados', () => {

  describe('Clasificación de tareas por estado', () => {
    test('getCompletedTasks retorna solo tareas completadas', () => {
      const t1 = taskService.createTask({ title: 'Completada 1' });
      const t2 = taskService.createTask({ title: 'Pendiente' });
      const t3 = taskService.createTask({ title: 'Completada 2' });
      taskService.updateTask(t1.id, { completed: true });
      taskService.updateTask(t3.id, { completed: true });

      const completed = taskService.getCompletedTasks();
      expect(completed).toHaveLength(2);
      expect(completed.every(t => t.completed)).toBe(true);
    });

    test('getPendingTasks retorna solo tareas pendientes', () => {
      const t1 = taskService.createTask({ title: 'Pendiente 1' });
      const t2 = taskService.createTask({ title: 'Completada' });
      taskService.updateTask(t2.id, { completed: true });

      const pending = taskService.getPendingTasks();
      expect(pending).toHaveLength(1);
      expect(pending[0].title).toBe('Pendiente 1');
    });
  });

  describe('Identificación de información relevante', () => {
    test('toda tarea creada incluye timestamp de creación', () => {
      const task = taskService.createTask({ title: 'Con fecha' });
      expect(task.createdAt).toBeDefined();
      expect(new Date(task.createdAt)).toBeInstanceOf(Date);
    });

    test('toda tarea actualizada incluye timestamp de modificación', () => {
      const task = taskService.createTask({ title: 'Tarea' });
      const before = task.updatedAt;
      // Esperar un poco para asegurar diferencia de tiempo
      const updated = taskService.updateTask(task.id, { title: 'Tarea modificada' });
      expect(updated.updatedAt).toBeDefined();
      expect(updated.updatedAt).not.toBe(before);
    });

    test('el ID generado es único para cada tarea', () => {
      const t1 = taskService.createTask({ title: 'Tarea 1' });
      const t2 = taskService.createTask({ title: 'Tarea 2' });
      const t3 = taskService.createTask({ title: 'Tarea 3' });
      const ids = [t1.id, t2.id, t3.id];
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('Validación de resultados', () => {
    test('clearAllTasks elimina todas las tareas correctamente', () => {
      taskService.createTask({ title: 'T1' });
      taskService.createTask({ title: 'T2' });
      taskService.createTask({ title: 'T3' });
      expect(taskService.getAllTasks()).toHaveLength(3);
      taskService.clearAllTasks();
      expect(taskService.getAllTasks()).toHaveLength(0);
    });

    test('resultados son consistentes tras múltiples operaciones', () => {
      const t1 = taskService.createTask({ title: 'Primera' });
      taskService.createTask({ title: 'Segunda' });
      taskService.deleteTask(t1.id);
      taskService.createTask({ title: 'Tercera' });

      const all = taskService.getAllTasks();
      const pending = taskService.getPendingTasks();
      const completed = taskService.getCompletedTasks();

      expect(all).toHaveLength(2);
      expect(pending).toHaveLength(2);
      expect(completed).toHaveLength(0);
      expect(all.length).toBe(pending.length + completed.length);
    });
  });
});

// ============================================
// INTEGRACIÓN - Escenarios combinados
// ============================================

describe('Integración - Escenarios combinados realistas', () => {

  test('flujo completo: crear, completar, listar, eliminar', () => {
    // Crear 3 tareas
    const t1 = taskService.createTask({ title: 'Hacer la compra' });
    const t2 = taskService.createTask({ title: 'Estudiar Node.js', description: 'Capítulo 3' });
    const t3 = taskService.createTask({ title: 'Preparar café' });

    expect(taskService.getAllTasks()).toHaveLength(3);
    expect(taskService.getPendingTasks()).toHaveLength(3);

    // Completar una
    taskService.toggleTaskCompletion(t2.id);
    expect(taskService.getCompletedTasks()).toHaveLength(1);
    expect(taskService.getPendingTasks()).toHaveLength(2);

    // Verificar que la completada mantiene sus datos
    const completed = taskService.getTaskById(t2.id);
    expect(completed.completed).toBe(true);
    expect(completed.title).toBe('Estudiar Node.js');

    // Eliminar una
    taskService.deleteTask(t1.id);
    expect(taskService.getAllTasks()).toHaveLength(2);

    // Verificar que se eliminó la correcta
    expect(taskService.getTaskById(t1.id)).toBeNull();
    expect(taskService.getTaskById(t2.id)).not.toBeNull();
    expect(taskService.getTaskById(t3.id)).not.toBeNull();
  });

  test('cálculo correcto de progreso tras múltiples cambios', () => {
    for (let i = 1; i <= 5; i++) {
      taskService.createTask({ title: `Tarea ${i}` });
    }

    // Completar 2
    const all = taskService.getAllTasks();
    taskService.updateTask(all[0].id, { completed: true });
    taskService.updateTask(all[1].id, { completed: true });

    const completed = taskService.getCompletedTasks();
    const pending = taskService.getPendingTasks();

    expect(completed.length).toBe(2);
    expect(pending.length).toBe(3);
    expect(completed.length + pending.length).toBe(5);
  });
});
