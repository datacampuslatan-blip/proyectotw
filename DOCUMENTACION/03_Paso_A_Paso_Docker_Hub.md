# 03. Paso a Paso: Publicación en Docker Hub

Habiendo creado las imágenes locales basadas en los *Dockerfiles* del paso anterior, el objetivo de esta fase es llevar estas imágenes a la nube para hacerlas públicas demostrando el dominio sobre el ciclo de vida de un contenedor.

## Requisitos Previos
Tener una cuenta activa en [hub.docker.com](https://hub.docker.com/). Supongamos que el nombre de usuario de nuestra cuenta es `estudianteiudigital` (este es un ejemplo, se debe reemplazar por el usuario real al ejecutar comandos).

## Paso 1: Inicio de Sesión desde la Terminal
Para comunicarnos con Docker Hub, debemos autenticarnos desde la Consola/Terminal de Comandos en Windows:

```bash
docker login
```
*El sistema pedirá el Username y luego el Password. Al ingresarlos correctamente, mostrará un mensaje "Login Succeeded".*

## Paso 2: Etiquetado de Imágenes (Tagging)
Docker Hub exige una estructura específica para recibir imágenes: `usuario/nombre_repositorio:etiqueta`. Por defecto nuestras imágenes se llamaban `api-core-local`, así que debemos "re-etiquetarlas" para que apunten al repositorio en la nube.

```bash
# Formato: docker tag <imagen_local> <usuario_docker_hub>/<nombre_app>:<version>

# 1. Etiquetar el Monolito
docker tag api-core-local estudianteiudigital/api-core:v1.0

# 2. Etiquetar el Microservicio
docker tag api-proyectos-local estudianteiudigital/api-proyectos:v1.0
```

## Paso 3: Subida a la Nube (Push)
Con las etiquetas correctas asignadas, procedemos a "empujar" las imágenes locales hacia los repositorios remotos de Docker Hub.

```bash
# Subir la imagen del Monolito
docker push estudianteiudigital/api-core:v1.0

# Subir la imagen del Microservicio desacoplado
docker push estudianteiudigital/api-proyectos:v1.0
```

## Paso 4: Evidenciar la Carga
Al terminar la barra de progreso de los *pushes* en la terminal, ingresamos al navegador web y abrimos nuestra cuenta de Docker Hub. En la pestaña **Repositories** podremos observar que ambos repositorios existen, su tamaño aproximado (alrededor de 150-200MB optimizados gracias a Alpine Linux) y la etiqueta `v1.0` activa y lista para ser descargada por el evaluador usando `docker pull`.
