# 04. Paso a Paso: Orquestación con Docker Compose

Si bien en los pasos anteriores logramos aislar las aplicaciones (Monolito y Microservicio), en un entorno de producción necesitamos que ambas se levanten simultáneamente, conozcan la cadena de conexión a MongoDB y eventualmente puedan verse entre sí en una misma red virtual. Para solucionar esto, implementamos **Orquestación mediante Docker Compose**.

## Análisis del Archivo de Orquestación
El archivo que maneja esto se encuentra en la raíz del proyecto y se llama `docker-compose.yml`. Vamos a desglosarlo para demostrar entendimiento técnico:

```yaml
version: '3.8' # Utilizamos una versión moderna de la sintaxis de compose

services:
  # ---------------------------------------------------------
  # SERVICIO 1: Monolito Administrativo (Core)
  # ---------------------------------------------------------
  api-core:
    build:
      context: .              # Indica que busque el Dockerfile en la raíz actual
    container_name: iudigital_api_core
    ports:
      - "4000:4000"           # Mapeo de puerto Host:Contenedor. Todo lo de la PC pasa al contenedor en el 4000.
    environment:
      - PORT=4000
      - MONGODB_URI=${MONGODB_URI} # Inyecta la cadena de BD desde un archivo .env oculto por seguridad
    restart: always           # Políticas de resiliencia: Si falla, Docker lo levanta automáticamente.
    networks:
      - iudigital_net         # Lo inyecta dentro de la VPN encapsulada de Docker

  # ---------------------------------------------------------
  # SERVICIO 2: Microservicio de Proyectos (Componente Desacoplado)
  # ---------------------------------------------------------
  api-proyectos:
    build:
      context: ./microservicio-proyectos # La ruta hacia donde está el código del microservicio
    container_name: iudigital_microservicio_proyectos
    ports:
      - "4001:4001"           # Expuesto enteramente por un puerto independiente (4001) aislando carga.
    environment:
      - PORT=4001
      - MONGODB_URI=${MONGODB_URI}
    restart: always
    networks:
      - iudigital_net

# Definición de la red interna de contenedores
networks:
  iudigital_net:
    driver: bridge            # Red tipo puente que permite la inter-comunicación por nombre de contenedor
```

## Paso a Paso para Despliegue Orquestado

1. **Asegurar la Conexión a Base de Datos:**
   Se corrobora la existencia de un archivo llamado `.env` en la misma carpeta que el `docker-compose`. Este debe contener exclusivamente:
   ```env
   MONGODB_URI=mongodb+srv://iudigital:Medellin2026*@cluster0.qgt2hux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Ejecución del Enjambre (Swarm/Orchestration):**
   A diferencia del paso manual del *build*, Compose nos resume todo en un solo y elegante comando. En la terminal de Windows en la carpeta raíz del proyecto, digitamos:
   ```bash
   docker-compose up -d --build
   ```
   > **Explicación del comando**: `up` indica encender. `-d` (detached) significa que la terminal no se bloqueará con logs, dejándolos en el fondo. `--build` asegura que las imágenes se reconstruyan si detecta algún cambio en el código `src/`.

3. **Verificación:**
   Para evidenciar que el orquestador triunfó, podemos ejecutar:
   ```bash
   docker ps
   ```
   Nos devolverá una lista indicando que `iudigital_api_core` y `iudigital_microservicio_proyectos` están reportando un *Status: Up*. En ese momento, la App Frontend de Pruebas que creamos en el Paso 01 podrá interactuar sin problemas con ambos contenedores.
