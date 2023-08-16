# Usa una imagen base de Node.js
FROM node:14 AS builder

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Compila la aplicación de Angular
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos compilados de la etapa de compilación al directorio de trabajo de Nginx
COPY --from=builder /app/dist/shopaholic-backoffice /usr/share/nginx/html

# Expone el puerto 80 para que Nginx pueda escuchar
EXPOSE 80

# Comando para iniciar Nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]