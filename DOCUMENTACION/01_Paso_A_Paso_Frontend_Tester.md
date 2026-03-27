# 01. Paso a Paso: Desarrollo de la Interfaz de Pruebas Frontend (Tester UI)

Para evitar la dependencia de herramientas externas de testing como Postman y tener una forma visual, amigable e interactiva de validar que tanto el Monolito como el Microservicio funcionan y persisten correctamente los datos en MongoDB, se desarrolló una pequeña aplicación de Front-End con HTML, CSS y JavaScript Vanilla.

## Objetivo
Demostrar gráficamente el correcto funcionamiento de todas las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) que la aplicación y sus componentes exponen en diferentes puertos.

---

## Paso 1: Creación de la Estructura de Archivos
Se creó un directorio llamado `frontend` en la raíz del proyecto para alojar los archivos del cliente de manera limpia. Dentro se crearon tres archivos fundamentales:
1. `tester.html`: El esqueleto y estructura de la aplicación.
2. `styles.css`: Modificaciones visuales para hacer la interfaz amigable.
3. `app.js`: La lógica central encargada de las peticiones asíncronas HTTP (Fetch API).

## Paso 2: Diseño de la Interfaz de Usuario (HTML)
En `frontend/tester.html`, se estructuró la interfaz basándose en dos columnas principales. 
- A la **izquierda**, un panel de control con un formulario centralizado para enviar datos (POST/PUT).
- A la **derecha**, una tabla dinámica donde se inyectan los resultados que provienen de la Base de Datos al hacer peticiones GET.

Se utilizó un elemento `<select>` clave para que el evaluador elija contra **cuál módulo** y **cuál puerto** desea hacer pruebas:
- Tipos de Proyecto (Puerto 4000)
- Clientes (Puerto 4000)
- Universidades (Puerto 4000)
- Etapas (Puerto 4000)
- **Proyectos (Microservicio Desacoplado - Puerto 4001)**

## Paso 3: Estilización (CSS)
En `frontend/styles.css`, se usó flexbox para posicionar los contenedores. Se definieron variables de colores y un esquema oscuro moderno para que la aplicación tenga una apariencia profesional a la hora de presentarla en una sustentación o demostración.

## Paso 4: Lógica de Pruebas Dinámicas (JavaScript)
En `frontend/app.js` se codificó el "motor" de pruebas. El sistema funciona así:

1. **Gestión de Puertos:** 
   El sistema está programado para saber que cuando el selector de entidades apunta a `proyectos`, la petición (Fetch) automáticamente debe enrutarse hacia el puerto `4001`. Para el resto, dirige la red por defecto hacia el `4000`.

2. **Leer (GET):**
   Posee un botón "Cargar Datos" que dispara una función `fetchData()`, realiza un GET al backend correspondiente e inyecta dinámicamente filas en la tabla HTML (`<tbody>`).

3. **Crear (POST):**
   Al llenar el campo "Nombre" y dar click a "Guardar / Crear", se ejecuta un `POST` eviando los datos al backend en formato JSON. Si MongoDB responde con éxito, se recarga la tabla sola.

4. **Actualizar y Borrar (PUT / DELETE):**
   Por cada registro dibujado en la tabla, JS inyecta dinámicamente dos botones: "Editar" y "Eliminar". Pulsar "Eliminar" ejecuta la petición `DELETE /id` en el puerto adecuado, borrándolo instantáneamente de la bdd.

---
**Conclusión de la Fase 1:**
Esta aplicación servirá como evidencia fehaciente de que el desacoplamiento funciona, permitiendo a cualquier examinador comprobar si el envío de un proyecto a un sistema distribuido y aislado es capaz de guardar información en Atlas al igual que el sistema monolítico central.
