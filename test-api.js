const baseUrl = "http://localhost:4000/api";

async function runTest() {
    try {
        console.log("1. Probando conexión a la API...");
        const resRoot = await fetch("http://localhost:4000/");
        const textRoot = await resRoot.text();
        console.log("Respuesta raíz:", textRoot);

        console.log("\n2. Creando un nuevo Cliente...");
        const resCliente = await fetch(baseUrl + "/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: "Maria Gomez",
                email: `maria.gomez${Date.now()}@example.com`,
                telefono: "3001234567"
            })
        });
        const clienteCreado = await resCliente.json();
        console.log("Cliente creado en Mongo:", clienteCreado);

        console.log("\n3. Obteniendo lista de Clientes...");
        const resLista = await fetch(baseUrl + "/clientes");
        const listaClientes = await resLista.json();
        console.log(`Total de clientes en DB: ${listaClientes.length}`);

        console.log("\n✅ ¡Prueba de API y guardado en MongoDB finalizada con ÉXITO!");
        process.exit(0);
    } catch (e) {
        console.error("❌ Error durante la prueba:", e.message);
        process.exit(1);
    }
}

// Retrasar 2 segundos la ejecución para dar tiempo al servidor a levantar
setTimeout(runTest, 2000);
