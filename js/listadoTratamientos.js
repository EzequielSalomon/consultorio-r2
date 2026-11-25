// NUEVO: los datos ya no se importan de un .js, se piden con fetch a traves de api.js
import { obtenerDatos } from "./api.js";
import { habilitarBoton, guardarEleccion } from "./funciones.js";

const lista = document.querySelector("#lista-tratamientos");
const buscador = document.querySelector("#buscador-tratamientos");
const boton = document.querySelector(".formulario-seleccion button");


// pasa el texto a minuscula y le saca las tildes, para comparar en el buscador
function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


// dibuja en pantalla la lista de tratamientos que recibe
function mostrarTratamientos(listaTratamientos) {
    if (listaTratamientos.length === 0) {
        lista.innerHTML = `<li class="sin-resultados">No se encontraron tratamientos</li>`;
    } else {
        let tratamientosHTML = ``;

        listaTratamientos.forEach((tratamiento) => {
            tratamientosHTML += `
                <li>
                    <input type="radio" name="tratamiento" id="id-${tratamiento.id}" value="${tratamiento.id}">
                    <label for="id-${tratamiento.id}">${tratamiento.nombre}</label>
                </li>
            `;
        });

        lista.innerHTML = tratamientosHTML;
    }
}


// el boton arranca deshabilitado y se registran los eventos de la lista
habilitarBoton(lista, boton);
guardarEleccion(lista, "tratamiento");


// NUEVO: carga de los datos desde el JSON
let tratamientos = [];

// mientras llegan los datos, se muestra un aviso
lista.innerHTML = `<li class="sin-resultados">Cargando tratamientos...</li>`;

try {
    // la ruta se cuenta desde tratamiento.html, no desde este archivo .js
    tratamientos = await obtenerDatos("./datos/tratamientos.json");
    mostrarTratamientos(tratamientos);

} catch (error) {
    // si el archivo no existe, tiene un error o no hay conexion
    console.error("Error al cargar los tratamientos:", error);
    lista.innerHTML = `<li class="sin-resultados">No pudimos cargar los tratamientos. Intentá más tarde.</li>`;
    buscador.disabled = true;
}


// cada vez que el usuario escribe en el buscador, se filtra la lista
buscador.addEventListener("input", () => {
    const textoBuscado = normalizar(buscador.value);

    const tratamientosFiltrados = tratamientos.filter((tratamiento) =>
        normalizar(tratamiento.nombre).includes(textoBuscado)
    );

    mostrarTratamientos(tratamientosFiltrados);

    // al redibujar la lista se pierde la opcion marcada, entonces se vuelve a deshabilitar el boton
    boton.disabled = true;
});