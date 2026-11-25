// NUEVO: los datos se piden con fetch a traves de api.js
import { obtenerDatos } from "./api.js";
import { habilitarBoton, guardarEleccion } from "./funciones.js";

const lista = document.querySelector("#lista-horarios");
const boton = document.querySelector(".formulario-seleccion button");

// el boton arranca deshabilitado y se registran los eventos de la lista
habilitarBoton(lista, boton);
guardarEleccion(lista, "horario");

// mientras llegan los datos, se muestra un aviso
lista.innerHTML = `<li>Cargando horarios...</li>`;

try {
    // la ruta se cuenta desde horario.html
    const horarios = await obtenerDatos("./datos/horarios.json");

    let horariosHTML = ``;

    // recorrido anidado: por cada dia, se recorren sus turnos
    horarios.forEach((dia) => {
        let turnosHTML = ``;

        dia.turnos.forEach((turno) => {
            turnosHTML += `
                <input type="radio" name="turno" id="id-${turno.id}" value="${turno.id}">
                <label for="id-${turno.id}">${turno.hora}</label>
            `;
        });

        horariosHTML += `
            <li>
                <span class="dia">${dia.dia}</span>
                ${turnosHTML}
            </li>
        `;
    });

    lista.innerHTML = horariosHTML;

} catch (error) {
    console.error("Error al cargar los horarios:", error);
    lista.innerHTML = `<li>No pudimos cargar los horarios. Intentá más tarde.</li>`;
}