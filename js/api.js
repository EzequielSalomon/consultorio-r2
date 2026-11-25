// modulo para pedir datos a los archivos JSON (simulan una API REST)
// lo usan las paginas de tratamiento, profesional, horario y resumen


// pide un archivo JSON y devuelve su contenido como arreglo
// si algo falla, lanza un error para que la pagina lo maneje en su catch
export async function obtenerDatos(ruta) {
    // 1. pide el archivo al servidor y espera la respuesta
    const respuesta = await fetch(ruta);

    // 2. fetch no da error si el archivo no existe (404): hay que revisarlo a mano
    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${ruta} (error ${respuesta.status})`);
    }

    // 3. convierte el texto JSON recibido en un arreglo de objetos
    const datos = await respuesta.json();
    return datos;
}