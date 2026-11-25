// modulo para guardar, leer y cancelar los turnos confirmados en localStorage
// lo usan resumen.js (para guardar) y notificaciones.js (para mostrar y cancelar)

// nombre de la "clave" con la que se guardan los turnos en localStorage
const CLAVE_TURNOS = "turnosConfirmados";


// devuelve el arreglo de turnos guardados (o un arreglo vacio si no hay ninguno)
export function obtenerTurnos() {
    const turnosTexto = localStorage.getItem(CLAVE_TURNOS);

    // si todavia no se guardo ningun turno, getItem devuelve null
    if (turnosTexto === null) {
        return [];
    }

    // localStorage guarda texto: JSON.parse lo convierte de nuevo en arreglo de objetos
    // si el texto estuviera roto, JSON.parse falla: el catch evita que se rompa la pagina
    try {
        return JSON.parse(turnosTexto);
    } catch (error) {
        console.error("Los turnos guardados estan dañados:", error);
        return [];
    }
}


// agrega un turno nuevo a la lista y la guarda
export function guardarTurno(turno) {
    const turnos = obtenerTurnos();
    turnos.push(turno);

    // JSON.stringify convierte el arreglo en texto para poder guardarlo
    localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
}


// borra el turno que tenga ese id y guarda la lista actualizada
export function cancelarTurno(idTurno) {
    const turnos = obtenerTurnos();
    const turnosRestantes = turnos.filter((turno) => turno.id !== idTurno);

    localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnosRestantes));
}