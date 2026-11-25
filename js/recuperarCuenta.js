// validacion del formulario de recuperar cuenta
import { emailValido, mostrarError, limpiarErrores, enfocarPrimerError } from "./validaciones.js";

const formulario = document.querySelector("#formulario-recuperar");
const inputCorreo = document.querySelector("#id-correo");
const boton = formulario.querySelector("button[type='submit']");
const notificacion = document.querySelector("#notificacion");


formulario.addEventListener("submit", (evento) => {
    // evita que el formulario se envie y recargue la pagina
    evento.preventDefault();

    limpiarErrores(formulario);
    notificacion.textContent = "";
    notificacion.className = "notificacion";

    const correo = inputCorreo.value.trim();

    // validacion por JS: formato de email estricto
    if (!emailValido(correo)) {
        mostrarError(inputCorreo, "Ingresá un correo válido, por ejemplo nombre@correo.com");
        enfocarPrimerError(formulario);
        return;
    }

    // si el correo es valido, se muestra el aviso (es una simulacion: el sitio no tiene usuarios reales)
    notificacion.textContent = `Si ${correo} está registrado, te enviamos un correo con los pasos para recuperar tu cuenta.`;
    notificacion.classList.add("notificacion-exito");
    formulario.reset();
    boton.disabled = true;
});
