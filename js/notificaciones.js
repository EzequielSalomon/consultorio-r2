// muestra los turnos confirmados guardados en localStorage y permite cancelarlos
import { obtenerTurnos, cancelarTurno } from "./turnos.js";

const lista = document.querySelector("#lista-turnos");


// dibuja la lista de turnos (se llama al cargar la pagina y cada vez que se cancela uno)
function mostrarTurnos() {
    const turnos = obtenerTurnos();

    if (turnos.length === 0) {
        lista.innerHTML = `<li class="sin-turnos">No tenés notificaciones pendientes.</li>`;
    } else {
        let turnosHTML = ``;

        // reverse da vuelta el arreglo: asi el turno mas reciente aparece primero
        turnos.reverse().forEach((turno) => {
            turnosHTML += `
                <li class="tarjeta-turno">
                    <h2>Turno confirmado</h2>
                    <p><strong>Tratamiento:</strong> ${turno.tratamiento}</p>
                    <p><strong>Profesional:</strong> ${turno.profesional}</p>
                    <p><strong>Día y horario:</strong> ${turno.horario}</p>
                    <p class="fecha-confirmacion">Confirmado el ${turno.fechaConfirmacion} - enviado a ${turno.email}</p>
                    <button type="button" class="boton-cancelar" data-id="${turno.id}">Cancelar turno</button>
                </li>
            `;
        });

        lista.innerHTML = turnosHTML;
    }
}


// al cargar la pagina se muestran los turnos guardados
mostrarTurnos();


// un solo listener en la lista para todos los botones "Cancelar" (delegacion de eventos)
lista.addEventListener("click", (evento) => {
    // si el clic no fue en un boton de cancelar, no se hace nada
    if (evento.target.classList.contains("boton-cancelar")) {
        const confirmado = confirm("¿Seguro que querés cancelar este turno?");

        if (confirmado) {
            // el data-id llega como texto: Number lo convierte al numero guardado
            const idTurno = Number(evento.target.dataset.id);
            cancelarTurno(idTurno);
            mostrarTurnos();
        }
    }
});