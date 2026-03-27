// Constantes
const MONOLITH_URL = 'http://localhost:4000/api';
const MICROSERVICE_URL = 'http://localhost:4001/api';

// Referencias del DOM
const entitySelect = document.getElementById('entitySelect');
const portIndicator = document.getElementById('portIndicator');
const crudForm = document.getElementById('crudForm');
const entityIdInput = document.getElementById('entityId');
const nombreInput = document.getElementById('nombreInput');
const extraFieldsContainer = document.getElementById('extraFields');
const tableBody = document.getElementById('tableBody');
const loader = document.getElementById('loader');
const statusMessage = document.getElementById('statusMessage');

// Estado Actual
let currentEntity = 'tipos-proyecto';
let currentPort = 4000;

function cambioEntidad() {
    currentEntity = entitySelect.value;

    // Si la entidad es proyectos (la de mayor demanda), usamos el puerto 4001 del microservicio
    if (currentEntity === 'proyectos') {
        currentPort = 4001;
        portIndicator.textContent = 'Puerto activo: 4001 (Microservicio)';
        renderExtraFields(true);
    } else {
        currentPort = 4000;
        portIndicator.textContent = 'Puerto activo: 4000 (Monolito)';
        renderExtraFields(false);
    }
    limpiarFormulario();
    fetchData(); // Recargar datos de la nueva tabla automáticamente
}

// Para Proyectos (Microservicio), hay campos extra. Para el Monolito (Tipos, Clientes, etc), solo "nombre"
function renderExtraFields(isProyecto) {
    if (isProyecto) {
        extraFieldsContainer.style.display = 'block';
        extraFieldsContainer.innerHTML = `
            <div class="form-group" style="margin-top: 10px;">
                <label for="fechaIniInput">Fecha Inicio:</label>
                <input type="date" id="fechaIniInput" required>
            </div>
            <div class="form-group" style="margin-top: 10px;">
                <label for="fechaFinInput">Fecha Entrega:</label>
                <input type="date" id="fechaFinInput" required>
            </div>
            <div class="form-group" style="margin-top: 10px;">
                <label for="valorInput">Valor:</label>
                <input type="number" id="valorInput" placeholder="Ej: 5000000" required>
            </div>
            <p style="font-size: 0.8rem; color: #b3b3b3; margin-top: 5px;">* Como administrador del Tester, ID Cliente, Tipo, U y Etapa se asignarán quemados para prueba del CRUD.</p>
        `;
    } else {
        extraFieldsContainer.style.display = 'none';
        extraFieldsContainer.innerHTML = '';
    }
}

// Mostrar mensajes de UI
function showMessage(msg, isError = false) {
    statusMessage.textContent = msg;
    statusMessage.className = `status-message ${isError ? 'status-error' : 'status-success'}`;
    statusMessage.style.display = 'block';
    setTimeout(() => { statusMessage.style.display = 'none'; }, 3000);
}

// Obtener la URL Base correcta 
function getBaseUrl() {
    return currentPort === 4001 ? MICROSERVICE_URL : MONOLITH_URL;
}

// Lógica [R]EAD (GET)
async function fetchData() {
    loader.style.display = 'block';
    tableBody.innerHTML = '';

    try {
        const response = await fetch(`${getBaseUrl()}/${currentEntity}`);
        const data = await response.json();

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay datos guardados aún en Atlas JS para este módulo.</td></tr>';
        } else {
            data.forEach(item => {
                const tr = document.createElement('tr');
                let cellData = '';
                // Mostrar solo nombre (y valor y titulo si es proyecto)
                const valorRender = item.valor ? `<br><small style="color:var(--primary-color)">$${item.valor}</small>` : '';
                const titleRender = item.numero ? `${item.numero} ` : item.nombre;

                tr.innerHTML = `
                    <td style="font-size: 0.8rem; color: #b3b3b3;">${item._id}</td>
                    <td><strong>${titleRender}</strong>${valorRender}</td>
                    <td>
                        <button class="btn success-btn" onclick="editar('${item._id}', '${item.nombre || item.numero}')">Editar</button>
                        <button class="btn danger-btn" onclick="eliminar('${item._id}')">Borrar</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
        showMessage(`Datos de /${currentEntity} cargados OK`);
    } catch (error) {
        console.error("Error Fetching:", error);
        showMessage("No se pudo conectar a la base de datos Atlas o al Backend. ¿Están encendidos?", true);
    } finally {
        loader.style.display = 'none';
    }
}

// Logica [C]REATE & [U]PDATE (POST / PUT)
crudForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = entityIdInput.value;
    const isUpdating = id !== '';
    const method = isUpdating ? 'PUT' : 'POST';
    const url = isUpdating ? `${getBaseUrl()}/${currentEntity}/${id}` : `${getBaseUrl()}/${currentEntity}`;

    // Armar el payload
    let payload = {};
    if (currentEntity === 'proyectos') {
        // Estructura Compleja Microservicio Proyectos
        payload = {
            numero: nombreInput.value,
            titulo: nombreInput.value,
            fechaIniciacion: document.getElementById('fechaIniInput').value,
            fechaEntrega: document.getElementById('fechaFinInput').value,
            valor: parseFloat(document.getElementById('valorInput').value),
            // IDs Quamados por defecto para asegurar que pase validacion (o requeririan 4 selects en UI)
            cliente: "664ecab6a2588c5efbcfa71b", // Reemplazar por ids válidos en la db
            tipoProyecto: "664b9d0336ae5ccae405785f",
            universidad: "664efaf529a6dc280ab44415",
            etapa: "664f7c2aa5b7d6bfee53f3e0"
        };
    } else {
        // Estructura Simple Monolito (Tipos, Clientes, Univ, Etapas)
        payload = { nombre: nombreInput.value };
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showMessage(`Registro ${isUpdating ? 'Actualizado' : 'Creado'} Mágicamente en MongoDB!`);
            limpiarFormulario();
            fetchData();
        } else {
            const err = await response.json();
            showMessage(`Error de Validacion de Datos Backend: ${err.msg || 'Fallo'}`, true);
        }
    } catch (error) {
        showMessage("Error de red enviando petición al Backend", true);
    }
});

// Logica Delete [D]ELETE
async function eliminar(id) {
    if (!confirm('¿Estás seguro de que quieres borrar este registro de la Base de Datos?')) return;

    try {
        const response = await fetch(`${getBaseUrl()}/${currentEntity}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            showMessage("Registro aniquilado permanentemente de Atlas");
            fetchData();
        } else {
            showMessage("Hubo un error al intentar eliminar.", true);
        }
    } catch (error) {
        showMessage("Error de red", true);
    }
}

// Helpers
function editar(id, nombre) {
    entityIdInput.value = id;
    nombreInput.value = nombre;
    // (Opcional) Si quisiéramos llenar fechas en proyecto las llamaríamos también, por ahora simplificado.
    document.querySelector('.primary-btn').textContent = 'Actualizar Registro';
    document.querySelector('.primary-btn').style.backgroundColor = 'var(--warning-color)';
}

function limpiarFormulario() {
    crudForm.reset();
    entityIdInput.value = '';
    const btn = document.querySelector('.primary-btn');
    btn.textContent = 'Guardar Registro';
    btn.style.backgroundColor = 'var(--primary-color)';
}

// Carga Inicial
window.onload = fetchData;
