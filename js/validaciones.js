// modulo con las funciones de validacion que se repiten en varios formularios
// lo usan el login, el registro, recuperar cuenta y el resumen


// valida el formato del email: exige algo@algo.algo
// (el type="email" del HTML acepta "ana@correo" sin el ".com"; esta validacion es mas estricta)
export function emailValido(email) {
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formato.test(email);
}


// muestra un mensaje de error debajo de un campo y lo marca en rojo
// cada input tiene debajo un <p class="mensaje-error"> cuyo id es "error-" + el id del input
export function mostrarError(input, mensaje) {
    const parrafoError = document.getElementById(`error-${input.id}`);
    parrafoError.textContent = mensaje;

    input.classList.add("campo-invalido");
    // aria-invalid le avisa al lector de pantalla que el campo tiene un error
    input.setAttribute("aria-invalid", "true");
}


// borra todos los mensajes de error y las marcas rojas de un formulario
// se llama al principio de cada envio, para empezar a revisar "de cero"
export function limpiarErrores(formulario) {
    formulario.querySelectorAll(".mensaje-error").forEach((parrafo) => {
        parrafo.textContent = "";
    });

    formulario.querySelectorAll(".campo-invalido").forEach((input) => {
        input.classList.remove("campo-invalido");
        input.removeAttribute("aria-invalid");
    });
}


// lleva el cursor al primer campo con error, para que el usuario lo corrija
export function enfocarPrimerError(formulario) {
    const primerCampoInvalido = formulario.querySelector(".campo-invalido");
    if (primerCampoInvalido) {
        primerCampoInvalido.focus();
    }
}
