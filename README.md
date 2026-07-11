# Task Manager - Aplicación de Gestión de Tareas

Aplicación web básica para gestionar tareas pendientes, desarrollada como proyecto final de la asignatura **Construcción de Software (ASUC00947)**.

## Características

- Agregar tareas pendientes
- Marcar tareas como completadas
- Eliminar tareas
- Interfaz web responsiva
- API REST backend
- Pruebas unitarias con Jest
- Contenerizada con Docker

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Pruebas**: Jest
- **Contenedor**: Docker

## Instalación local

```bash
npm install
npm start
```

La aplicación estará disponible en: http://localhost:3000

## Ejecutar pruebas

```bash
npm test
```

## Docker

```bash
docker build -t task-manager .
docker run -p 3000:3000 task-manager
```

## Estructura del proyecto

```
task-manager/
├── backend/
│   ├── server.js       # Servidor Express
│   ├── taskService.js  # Lógica de negocio
│   └── taskStore.js    # Almacenamiento en memoria
├── frontend/
│   ├── index.html      # Página principal
│   ├── css/styles.css   # Estilos
│   └── js/app.js       # Lógica del cliente
├── tests/
│   └── taskService.test.js  # Pruebas unitarias
├── Dockerfile
└── package.json
```
