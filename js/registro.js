// validacion del formulario de registro (registrarme.html)
import { emailValido, mostrarError, limpiarErrores, enfocarPrimerError } from "./validaciones.js";

const formulario = document.querySelector("#formulario-registro");
const inputNombre = document.querySelector("#id-nombre");
const inputApellido = document.querySelector("#id-apellido");
const inputDni = document.querySelector("#id-dni");
const inputTelefono = document.querySelector("#id-telefono");
const inputCorreo = document.querySelector("#id-correo");
const inputPassword = document.querySelector("#id-password");
const inputConfirmar = document.querySelector("#id-password-confirmar");
const boton = formulario.querySelector("button[type='submit']");
const notificacion = document.querySelector("#notificacion");


// patrones (expresiones regulares) para controlar el formato de cada dato
const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,}$/;  // letras y espacios, minimo 2
const dniValido = /^\d{7,8}$/;                        // solo numeros, 7 u 8 digitos
const telefonoValido = /^\d{8,15}$/;                  // solo numeros, entre 8 y 15 digitos


formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    limpiarErrores(formulario);
    notificacion.textContent = "";
    notificacion.className = "notificacion";

    let formularioValido = true;

    // nombre y apellido: solo letras
    if (!soloLetras.test(inputNombre.value.trim())) {
        mostrarError(inputNombre, "El nombre solo puede tener letras (al menos 2).");
        formularioValido = false;
    }

    if (!soloLetras.test(inputApellido.value.trim())) {
        mostrarError(inputApellido, "El apellido solo puede tener letras (al menos 2).");
        formularioValido = false;
    }

    // DNI: solo numeros, sin puntos
    if (!dniValido.test(inputDni.value.trim())) {
        mostrarError(inputDni, "El DNI debe tener 7 u 8 números, sin puntos.");
        formularioValido = false;
    }

    // telefono: se quitan espacios y guiones antes de controlar, asi "351 123-4567" es valido
    const telefono = inputTelefono.value.replace(/[\s-]/g, "");
    if (!telefonoValido.test(telefono)) {
        mostrarError(inputTelefono, "El teléfono debe tener solo números (entre 8 y 15), con código de área.");
        formularioValido = false;
    }

    // correo: formato estricto
    if (!emailValido(inputCorreo.value.trim())) {
        mostrarError(inputCorreo, "Ingresá un correo válido, por ejemplo nombre@correo.com");
        formularioValido = false;
    }

    // contraseña: al menos 6 caracteres
    if (inputPassword.value.length < 6) {
        mostrarError(inputPassword, "La contraseña debe tener al menos 6 caracteres.");
        formularioValido = false;
    }

    // confirmar contraseña: tiene que ser igual (esto el HTML no lo puede controlar)
    if (inputConfirmar.value !== inputPassword.value) {
        mostrarError(inputConfirmar, "Las contraseñas no coinciden.");
        formularioValido = false;
    }

    // la obra social es opcional: no se valida

    if (formularioValido) {
        notificacion.textContent = "¡Cuenta creada! Te llevamos al inicio de sesión...";
        notificacion.classList.add("notificacion-exito");
        boton.disabled = true;

        // espera 2,5 segundos para que se lea el aviso y despues va al login
        setTimeout(() => {
            window.location.href = "./index.html";
        }, 2500);
    } else {
        enfocarPrimerError(formulario);
    }
});
