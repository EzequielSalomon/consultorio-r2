// validacion del formulario de inicio de sesion (index.html)
import { emailValido, mostrarError, limpiarErrores, enfocarPrimerError } from "./validaciones.js";

const formulario = document.querySelector("#formulario-login");
const inputUsuario = document.getElementById("id-usuario");
const inputContraseña = document.getElementById("id-contraseña");


formulario.addEventListener("submit", (evento) => {
    // evita el envio: asi el usuario y la contraseña no viajan en la URL
    evento.preventDefault();

    limpiarErrores(formulario);

    const usuario = inputUsuario.value.trim();
    const contraseña = inputContraseña.value;

    // arranca en true y pasa a false si algun campo tiene error
    let formularioValido = true;

    // usuario: no puede ser solo espacios (el required del HTML acepta "   ")
    if (usuario === "") {
        mostrarError(inputUsuario, "Ingresá tu usuario o correo electrónico.");
        formularioValido = false;
    } else if (usuario.includes("@") && !emailValido(usuario)) {
        // si escribio un "@", se asume que es un correo y se controla su formato
        mostrarError(inputUsuario, "El correo no es válido, por ejemplo nombre@correo.com");
        formularioValido = false;
    }

    // contraseña: al menos 6 caracteres
    if (contraseña.length < 6) {
        mostrarError(inputContraseña, "La contraseña debe tener al menos 6 caracteres.");
        formularioValido = false;
    }

    if (formularioValido) {
        // simulacion: no hay usuarios reales, si el formato es correcto se pasa a la reserva
        window.location.href = "./tratamiento.html";
    } else {
        enfocarPrimerError(formulario);
    }
});
