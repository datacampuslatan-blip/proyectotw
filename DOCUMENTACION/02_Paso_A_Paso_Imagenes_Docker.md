# 02. Paso a Paso: Construcción de Imágenes Docker

Este documento explica de forma detallada cómo se procedió a empaquetar ("dockerizar") las dos piezas de software de nuestro sistema: el Monolito central y el Microservicio de Proyectos (el componente de mayor demanda que fue desacoplado).

## 1. El Dockerfile del Monolito (api-core)
El archivo `Dockerfile` en el directorio raíz (`PROYECTO TW/Dockerfile`) es el encargado de construir el monolito. Su contenido línea por línea significa lo siguiente:

```dockerfile
# Se usa la versión 18 de Node.js montada sobre Alpine Linux por ser extremadamente ligera
FROM node:18-alpine

# Se crea y define la carpeta /usr/src/app como el lugar donde vivirá nuestra app dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json para preparar la instalación de librerías
COPY package*.json ./

# Descargamos los paquetes de Node.js omitiendo los de desarrollo (--production) para optimizar peso
RUN npm install --production

# Copiamos toda la carpeta 'src' de nuestra computadora hacia el contenedor
COPY src/ ./src/

# Le indicamos a Docker que este proceso escuchará por el puerto 4000
EXPOSE 4000

# El comando definitivo que levanta el servidor de Express
CMD ["node", "src/index.js"]
```

## 2. El Dockerfile del Microservicio Desacoplado (api-proyectos)
El archivo en `PROYECTO TW/microservicio-proyectos/Dockerfile` es semánticamente idéntico, demostrando la homogeneidad tecnológica, pero adaptado a su contexto independiente:

```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

# A diferencia del monolito, aquí la carpeta src es LA DEL MICROSERVICIO (rutas y controllers solo de Proyectos)
COPY src/ ./src/

# Este servicio aislado expone el puerto 4001, evitando colisiones con el monolito
EXPOSE 4001

CMD ["npm", "run", "start"]
```

## 3. Construcción Local (Build)
Para probar que estas instrucciones son correctas, abrimos una terminal en la computadora local y ejecutamos los siguientes comandos para empaquetar ambas imágenes:

### Para el Monolito:
```bash
# Estando en PROYECTO TW/
docker build -t api-core-local .
```
*(El `.` indica que debe buscar el Dockerfile en ese mismo directorio).*

### Para el Microservicio:
```bash
# Estando en PROYECTO TW/microservicio-proyectos/
docker build -t api-proyectos-local .
```

Al finalizar ambos procesos de *build*, nuestra computadora ya poseía las dos "cajas" independientes listas para ser ejecutadas en cualquier entorno con Docker, sin importar si existe Node.js instalado en el Sistema Operativo anfitrión.
