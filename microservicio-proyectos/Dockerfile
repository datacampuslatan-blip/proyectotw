# Usa una imagen oficial ligera de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias (solo para producción)
RUN npm install --production

# Copia el código fuente (Microservicio)
COPY src/ ./src/

# Expone el puerto del microservicio
EXPOSE 4001

# Comando para iniciar el servicio
CMD ["npm", "run", "start"]
