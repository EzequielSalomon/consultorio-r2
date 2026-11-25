// NUEVO: los datos se piden con fetch a traves de api.js (ya no se importan los .js de datos)
import { obtenerDatos } from "./api.js";
import { guardarTurno } from "./turnos.js";
import { emailValido } from "./validaciones.js";   // la validacion de email ahora es compartida


// ===== datos de EmailJS =====
const EMAILJS_SERVICE = "service_qgs6hfm";
const EMAILJS_TEMPLATE = "template_jjp91d6";
const EMAILJS_PUBLIC_KEY = "-K0Nh_xjGqUTragLz";

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });


// CAMBIO: los elementos de la pagina se buscan al principio,
// porque si falla la carga de datos hay que usar el aviso y el boton
const formulario = document.querySelector("#formulario-confirmacion");
const inputEmail = document.querySelector("#id-email-paciente");
const errorEmail = document.querySelector("#error-email");
const boton = document.querySelector("#boton-confirmar");
const notificacion = document.querySelector("#notificacion");


// ===== 1. mostrar el resumen =====
const idTratamiento = sessionStorage.getItem("tratamiento");
const idProfesional = sessionStorage.getItem("profesional");
const idHorario = sessionStorage.getItem("horario");

// CAMBIO: arrancan como "No seleccionado" y se completan si se encuentran los datos
let textoTratamiento = "No seleccionado";
let textoProfesional = "No seleccionado";
let textoHorario = "No seleccionado";

// NUEVO: se cargan los tres catalogos desde sus JSON
try {
    const tratamientos = await obtenerDatos("./datos/tratamientos.json");
    const profesionales = await obtenerDatos("./datos/profesionales.json");
    const horarios = await obtenerDatos("./datos/horarios.json");

    // se busca el objeto completo a partir del id guardado (igual que antes)
    const tratamiento = tratamientos.find((t) => t.id === idTratamiento);
    const profesional = profesionales.find((p) => p.id === idProfesional);

    if (tratamiento) {
        textoTratamiento = tratamiento.nombre;
    }
    if (profesional) {
        textoProfesional = profesional.nombre;
    }

    horarios.forEach((dia) => {
        const turno = dia.turnos.find((t) => t.id === idHorario);
        if (turno) {
            textoHorario = `${dia.dia} - ${turno.hora}`;
        }
    });

} catch (error) {
    // si falla la carga, se avisa y no se permite confirmar
    console.error("Error al cargar los datos del resumen:", error);
    textoTratamiento = "No disponible";
    textoProfesional = "No disponible";
    textoHorario = "No disponible";

    notificacion.textContent = "No pudimos cargar los datos del turno. Recargá la página.";
    notificacion.classList.add("notificacion-error");
    boton.disabled = true;
}

document.querySelector("#resumen-tratamiento").textContent = textoTratamiento;
document.querySelector("#resumen-profesional").textContent = textoProfesional;
document.querySelector("#resumen-horario").textContent = textoHorario;


// ===== 2. confirmar el turno y enviar el email =====

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    errorEmail.textContent = "";
    notificacion.textContent = "";
    notificacion.className = "notificacion";

    const email = inputEmail.value.trim();

    if (!emailValido(email)) {
        errorEmail.textContent = "Ingresá un correo válido, por ejemplo nombre@correo.com";
        inputEmail.focus();
        return;
    }

    // CAMBIO: ahora se pregunta por los textos, porque los objetos quedaron adentro del try
    if (textoTratamiento === "No seleccionado" || textoProfesional === "No seleccionado" || textoHorario === "No seleccionado") {
        errorEmail.textContent = "Falta elegir el tratamiento, el profesional o el horario. Volvé a empezar la reserva.";
        return;
    }

    boton.disabled = true;
    boton.textContent = "ENVIANDO...";

    try {
        await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
            email_paciente: email,
            tratamiento: textoTratamiento,
            profesional: textoProfesional,
            horario: textoHorario
        });

        guardarTurno({
            id: Date.now(),
            tratamiento: textoTratamiento,
            profesional: textoProfesional,
            horario: textoHorario,
            email: email,
            fechaConfirmacion: new Date().toLocaleString("es-AR", { hour12: false })
        });

        notificacion.textContent = `¡Turno confirmado! Te enviamos los datos a ${email}.`;
        notificacion.classList.add("notificacion-exito");
        formulario.reset();
        boton.textContent = "TURNO CONFIRMADO";

    } catch (error) {
        console.error("Error al enviar el email:", error);
        notificacion.textContent = "No pudimos enviar el email. Revisá tu conexión e intentá de nuevo.";
        notificacion.classList.add("notificacion-error");
        boton.disabled = false;
        boton.textContent = "CONFIRMAR TURNO";
    }
});