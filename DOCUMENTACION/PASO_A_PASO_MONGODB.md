# Guía de Configuración: Node.js y MongoDB Atlas

Este documento detalla los pasos para preparar un entorno de desarrollo local con Node.js y conectarlo a una base de datos no relacional alojada en la nube usando MongoDB Atlas.

## 1. Instalación y Configuración de Node.js

### Verificación de Instalación
Primero, verifica si Node.js y npm (el gestor de paquetes de Node) están instalados en tu sistema.
Abre tu terminal (PowerShell en Windows) y ejecuta:
```powershell
node -v
npm -v
```
Si ves números de versión (ej. `v24.13.1` para node y `11.8.0` para npm), ya los tienes instalados.
Si aparece un error indicando que el comando no se reconoce, debes instalar Node.js.

### Instalación (si es necesaria)
La forma más fácil en Windows es usar `winget`. En tu terminal, ejecuta:
```powershell
winget search OpenJS.NodeJS.LTS
winget install OpenJS.NodeJS.LTS
```
Esto instalará la versión Long Term Support (LTS), que es la más estable.

### Solución de Problemas con scripts en PowerShell (Windows)
A veces, Windows bloquea la ejecución de scripts (como npm) por políticas de seguridad. Si al ejecutar `npm -v` obtienes un error rojo de "SecurityError", ejecuta este comando en PowerShell **abierto como Administrador**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

## 2. Inicialización del Proyecto Local

1.  Crea una carpeta para tu proyecto (ej. `PROYECTO TW`) y abre una terminal dentro de esa carpeta.
2.  Inicializa el proyecto de Node.js:
    ```powershell
    npm init -y
    ```
    Esto creará un archivo `package.json`.
3.  Instala las dependencias principales que usaremos:
    ```powershell
    npm install mongoose dotenv
    ```
    *   **mongoose**: Librería para interactuar con MongoDB de forma estructurada.
    *   **dotenv**: Librería para manejar variables de entorno (como contraseñas) de forma segura.

## 3. Configuración de MongoDB Atlas (La Base de Datos en la Nube)

1.  **Crear cuenta y Cluster:**
    *   Ve a [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) y regístrate.
    *   Crea un nuevo proyecto y despliega un cluster gratuito (nivel M0, proveedor AWS o el de tu preferencia, en la región más cercana).

2.  **Crear Usuario de Base de Datos:**
    *   En el menú izquierdo, ve a **Security > Database Access**.
    *   Clic en **Add New Database User**.
    *   Elige autenticación por Password.
    *   Asigna un nombre de usuario (ej. `admin_db`) y una contraseña segura. **Guarda esta contraseña**.
    *   Desplázate hacia abajo y haz clic en **Add User**.

3.  **Configurar Acceso a la Red (IP Access List):**
    *   En el menú izquierdo, ve a **Security > Network Access**.
    *   Clic en **Add IP Address**.
    *   Haz clic en **Add Current IP Address** para permitir que tu computadora se conecte. (Para acceso universal, puedes usar `0.0.0.0/0`, pero es menos seguro).
    *   Confirma y espera a que el estado cambie de "Pending" a "Active".

4.  **Obtener la Cadena de Conexión (Connection String):**
    *   En el menú izquierdo, ve a **Deployment > Database**.
    *   En tu cluster, haz clic en el botón azul **Connect**.
    *   Selecciona la opción **Drivers** (Node.js).
    *   Copia la cadena que comienza con `mongodb+srv://...`.

## 4. Conectar el Proyecto Local a MongoDB Atlas

1.  En la raíz de tu proyecto local, crea un archivo llamado `.env` (este archivo **nunca** debe subirse a repositorios públicos como GitHub).
2.  Pega la cadena de conexión que copiaste, reemplazando `<password>` por la contraseña que creaste en el paso 3.2.
    ```env
    MONGODB_URI=mongodb+srv://tu_usuario:tu_contraseña_aqui@cluster0...mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```
3.  Crea un archivo JavaScript (ej. `test-db.js`) para probar la conexión:
    ```javascript
    require('dotenv').config();
    const mongoose = require('mongoose');

    async function conectarDB() {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
        } catch (error) {
            console.error('❌ Error de conexión:', error.message);
        } finally {
            await mongoose.connection.close();
            process.exit(0);
        }
    }

    conectarDB();
    ```
4.  Ejecuta el script en tu terminal:
    ```powershell
    node test-db.js
    ```
    Si todo está correcto, verás el mensaje de conexión exitosa.

## 5. Operaciones Básicas (Sembrar Datos - Ejemplo)

Para insertar datos, necesitas definir un *"Schema"* (la estructura de los datos) y un *"Model"*.

Ejemplo de script (`seed-db.js`) para insertar datos:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

// 1. Definir la estructura (Schema)
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 }
});

// 2. Crear el Modelo
const Producto = mongoose.model('Producto', productoSchema);

async function insertarDatos() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // 3. Crear array de objetos
        const nuevosProductos = [
            { nombre: "Laptop", precio: 1200, stock: 5 },
            { nombre: "Mouse", precio: 25, stock: 50 }
        ];

        // 4. Insertar en la base de datos
        await Producto.insertMany(nuevosProductos);
        console.log('✨ Datos insertados correctamente.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

insertarDatos();
```
Al ejecutar este script con `node seed-db.js`, los objetos se guardarán en tu base de datos en la nube y podrás verlos desde el panel de MongoDB Atlas en la pestaña "Browse Collections".

## 6. FASE 1: Construcción del Backend Monolítico (Plan de Implementación)

### Paso 1: Instalación de Dependencias Base
Se deben instalar las librerías necesarias para levantar un servidor web:
```powershell
npm install express cors
npm install nodemon --save-dev
```
- **express:** Framework ligero para crear servidores web.
- **cors:** Permite que aplicaciones web (ej. un frontend en React) puedan conectarse a esta API.
- **nodemon:** Reinicia el servidor automáticamente cuando detecta cambios en el código.

### Paso 2: Creación de la Estructura de Carpetas Profesionales
Para mantener el código organizado, usaremos una arquitectura de Modelo-Vista-Controlador (MVC), creando las siguientes carpetas dentro de la carpeta `src`:
- `config/`: Configuración de base de datos.
- `models/`: Esquemas de Mongoose (Reglas de los datos).
- `controllers/`: Lógica de negocio (CRUD).
- `routes/`: Rutas o "Endpoints" de la API.

### Paso 3 a 5: Codificación de Componentes
Se trasladará la lógica de conexión a la base de datos a `src/config/db.js`, se creará el `index.js` principal, y se construirán los Modelos Mongoose correspondientes al caso de estudio (Tipo de Proyecto, Cliente, Universidad, Etapas, Proyecto).

### Paso 6: Controladores (Lógica de Negocio)
Los controladores son las funciones que contienen la lógica respecto al manejo de los datos. Según el caso de estudio de IUDigital, el sistema debe permitir **"listar, crear y editar"** elementos para todos los módulos.

En la carpeta `src/controllers/`, se creará un archivo por cada módulo (ej. `clienteController.js`, `proyectoController.js`), e incluiremos las siguientes operaciones (CRUD parcial):
- **Crear (Create):** Toma la información enviada por el front-end y la guarda en la base de datos usando el Modelo asignado.
- **Listar/Obtener (Read):** Consulta todos los registros almacenados en la base de datos para un modelo en particular y los devuelve.
- **Editar/Actualizar (Update):** Busca un registro por su identificador único (ID) y actualiza sus atributos con los datos nuevos.

### Paso 7: Rutas (Endpoints de la API)
Las rutas o "Endpoints" son las direcciones URL a través de las cuales el usuario o la aplicación front-end accederá a las funciones de nuestros Controladores.

En la carpeta `src/routes/`, crearemos un archivo para cada entidad (ej. `cliente.js`) y usaremos los métodos HTTP para enrutarlos a su controlador respectivo:
- Método **POST** (`/api/clientes`): Conectado a la función de **Crear**.
- Método **GET** (`/api/clientes`): Conectado a la función de **Listar**.
- Método **PUT** (`/api/clientes/:id`): Conectado a la función de **Editar**.

Por último, estas rutas se importarán y habilitarán en el archivo raíz principal (`src/index.js`) para que funcionen apropiadamente en el servidor web.
