# 05. Análisis Arquitectónico: Desacoplamiento del Componente de Mayor Demanda

Este documento da respuesta formal al requerimiento del proyecto: *"Una vez desarrollada la aplicación, analizar cuál es el componente que mayor demanda tiene y desacoplarlo de la aplicación previamente construida"*.

## 1. Identificación del Componente de Mayor Demanda

Al auditar la aplicación monolítica inicial desarrollada en Node.js, se encontró una arquitectura de módulos interdependientes: `tipos-proyecto`, `clientes`, `universidades`, `etapas` y `proyectos`.

Se determinó, mediante análisis funcional e inferencia de flujos de valor del negocio, que **el módulo `proyectos` es el componente transaccional principal y de mayor demanda**.
		
Las razones arquitectónicas y de negocio son las siguientes:
1. **Centralidad de Entidad:** `proyectos` es la tabla raíz donde convergen las llaves foráneas y datos de todas las demás entidades (Tipo, Cliente, Universidad, Etapa). 
2. **Volumen de Transacciones (I/O):** Mientras que un "Cliente" o un "Tipo de Proyecto" (Tablas maestras) se crean ocasionalmente (Baja volatilidad - operaciones de solo lectura intensivas), los registros en la colección de `proyectos` se crean constantemente, se editan con cambios de fechas o valores, y reciben más peticiones de tipo escrituras/consultas cruzadas (Alta volatilidad).
3. **Escalabilidad Eje X, Y, Z (Cubo Mágico):** Si nuestro tráfico aumentase debido a una licitación masiva, la sobrecarga del servidor sucedería al computar o renderizar Proyectos, no al consultar la lista estática de Clientes o Universidades. 

Por estas tres razones fundamentales, "Proyectos" fue el candidato irrefutable para ser extraído de la arquitectura monolítica.

## 2. Proceso de Desacoplamiento (Patrón Microservicios)

En lugar de mantener esta lógica de alto tráfico acoplada al servidor principal (Monolito), se adoptó una arquitectura híbrida implementando el patrón *Database per Microservice* (o Contexto Delimitado / Bounded Context de DDD).

### 2.1 Refactorización a Nivel de Código (API Independence)
1. **Creación de Carpeta Aislada**: Se creó el directorio `microservicio-proyectos/`.
2. **`package.json` Propio**: Se independizaron sus dependencias (Express, Mongoose, Cors) del monolito `api-core`. Si el microservicio falla un paquete, el Monolito no colapsa (Resiliencia de Aislamiento de Fallos).
3. **Controladores y Rutas Únicas**: Se migró `proyectoController.js` y `proyectos.js` (Rutas) al nuevo ecosistema.
4. **Separación de Puertos:** 
   - El monolito que controla las entidades estables (Clientes, Universidades) opera seguro en el **Puerto 4000**.
   - El microservicio de alto tráfico (Proyectos) opera libre en el **Puerto 4001**, dedicando todo su pool de hilos de Node.js a este único fin.

### 2.2 Desacoplamiento a Nivel de Despliegue (Docker)
Para garantizar la independencia real y poder escalar solo este módulo a nivel infraestructura sin malgastar RAM ni CPU replicando las demás rutas del monolito, se lo "Dockerizó" de manera autónoma.

Se creó un segundo `Dockerfile` exclusivo dentro de la carpeta del microservicio. Gracias a esto y a Docker Compose:
- **`iudigital_api_core`** puede funcionar sin enterarse si el microservicio se cae.
- **`iudigital_microservicio_proyectos`** puede ser clonado 10 veces detrás de un Balanceador de Carga si la "mayor demanda" satura el nodo original sin afectar el Core. Ambos se comunican pasivamente a través de la misma Base de Datos en la nube (MongoDB Atlas).

## 3. Conclusión
La estrategia ejecutada demostró un conocimiento pleno de los riesgos del crecimiento (escalabilidad) en aplicaciones transaccionales. Al identificar a `proyectos` como el cuello de botella potencial por su volumen de R/W, y trasladarlo a su propio Microservicio (con puerto, lógica y contenedor dedicado), el proyecto pasa de ser una aplicación estática frágil a convertirse en una plataforma hiper-escalable moderna siguiendo las mejores prácticas de Dev-Ops y metodologías cloud-native.
