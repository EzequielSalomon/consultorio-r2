// NUEVO: los datos se piden con fetch a traves de api.js
import { obtenerDatos } from "./api.js";
import { habilitarBoton, guardarEleccion } from "./funciones.js";

const lista = document.querySelector("#lista-profesionales");
const boton = document.querySelector(".formulario-seleccion button");

// el boton arranca deshabilitado y se registran los eventos de la lista
habilitarBoton(lista, boton);
guardarEleccion(lista, "profesional");

// mientras llegan los datos, se muestra un aviso
lista.innerHTML = `<li class="sin-resultados">Cargando profesionales...</li>`;

try {
    // la ruta se cuenta desde profesional.html
    const profesionales = await obtenerDatos("./datos/profesionales.json");

    let profesionalesHTML = ``;

    profesionales.forEach((profesional) => {
        profesionalesHTML += `
            <li>
                <input type="radio" name="profesional" id="id-${profesional.id}" value="${profesional.id}">
                <label for="id-${profesional.id}">${profesional.nombre}</label><span class="matricula">Mat. Profesional ${profesional.matricula}</span>
            </li>
        `;
    });

    lista.innerHTML = profesionalesHTML;

} catch (error) {
    console.error("Error al cargar los profesionales:", error);
    lista.innerHTML = `<li class="sin-resultados">No pudimos cargar los profesionales. Intentá más tarde.</li>`;
}