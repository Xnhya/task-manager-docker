# ========================================
# Dockerfile - Task Manager
# Imagen basada en Node.js para producción
# ========================================

# Imagen base: Node.js 20 LTS (slim para menor tamaño)
FROM node:20-slim

# Etiquetas de metadatos
LABEL maintainer="Abel Maldonado Vasquez"
LABEL description="Task Manager - Aplicación de gestión de tareas"
LABEL version="1.0.0"

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar caché de Docker)
COPY package*.json ./

# Instalar dependencias de producción y desarrollo (para tests)
RUN npm ci --production=false

# Copiar todo el código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Usuario no-root por seguridad
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Comando de inicio: desarrollo con nodemon (o producción con node)
CMD ["node", "backend/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/tasks', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
