/**
 * Task Manager - Aplicación Frontend
 * Cliente JavaScript para la API REST de gestión de tareas.
 */

const API_BASE = '/api/tasks';

// Estado global
let tasks = [];
let currentFilter = 'all';

// ============================================
// FUNCIONES DE API
// ============================================

/**
 * Obtiene todas las tareas desde el servidor.
 */
async function fetchTasks() {
    try {
        const response = await fetch(API_BASE);
        const result = await response.json();
        if (result.success) {
            tasks = result.data;
            renderTasks();
            updateStats();
        }
    } catch (error) {
        showToast('Error al cargar tareas', 'error');
        console.error('Error al obtener tareas:', error);
    }
}

/**
 * Crea una nueva tarea.
 * @param {string} title - Título de la tarea.
 * @param {string} [description] - Descripción opcional.
 */
async function createTask(title, description) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        const result = await response.json();
        if (result.success) {
            showToast('Tarea agregada correctamente', 'success');
            await fetchTasks();
        } else {
            showToast(result.error || 'Error al crear tarea', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error('Error al crear tarea:', error);
    }
}

/**
 * Alterna el estado completado de una tarea.
 * @param {string} id - ID de la tarea.
 */
async function toggleTask(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}/toggle`, {
            method: 'PATCH'
        });
        const result = await response.json();
        if (result.success) {
            await fetchTasks();
        } else {
            showToast(result.error || 'Error al actualizar', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error('Error al alternar tarea:', error);
    }
}

/**
 * Elimina una tarea.
 * @param {string} id - ID de la tarea.
 */
async function deleteTask(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            showToast('Tarea eliminada', 'success');
            await fetchTasks();
        } else {
            showToast(result.error || 'Error al eliminar', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error('Error al eliminar tarea:', error);
    }
}

// ============================================
// RENDERIZADO
// ============================================

/**
 * Renderiza la lista de tareas según el filtro activo.
 */
function renderTasks() {
    const list = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');

    let filtered = tasks;
    if (currentFilter === 'pending') {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    }

    if (filtered.length === 0) {
        list.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    list.innerHTML = filtered.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask('${task.id}')"
                title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}"
            >
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-date">Creada: ${formatDate(task.createdAt)}</div>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-delete" onclick="deleteTask('${task.id}')" title="Eliminar">
                    🗑
                </button>
            </div>
        </li>
    `).join('');
}

/**
 * Actualiza las tarjetas de estadísticas.
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? ((completed / total) * 100).toFixed(0) : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-rate').textContent = rate + '%';
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} text - Texto a escapar.
 * @returns {string} Texto seguro.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Formatea una fecha ISO a formato local.
 * @param {string} isoDate - Fecha ISO.
 * @returns {string} Fecha formateada.
 */
function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Muestra una notificación toast.
 * @param {string} message - Mensaje a mostrar.
 * @param {string} [type] - Tipo: 'success' | 'error'.
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar tareas al iniciar
    fetchTasks();

    // Formulario de nueva tarea
    document.getElementById('task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-description');
        const title = titleInput.value.trim();
        const description = descInput.value.trim();

        if (!title) {
            showToast('Ingresa un título para la tarea', 'error');
            return;
        }

        await createTask(title, description);
        titleInput.value = '';
        descInput.value = '';
        titleInput.focus();
    });

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
});
