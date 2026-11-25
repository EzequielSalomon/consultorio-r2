// Tests de punta a punta (E2E) del turnero del Consultorio R2 con Playwright
// Son los mismos tests que en Cypress, para comparar las dos herramientas.
//
// npx playwright test            -> corre todo sin ventana (como en CI)
// npx playwright test --ui       -> modo visual, con linea de tiempo
// npx playwright test --debug    -> paso a paso con el Inspector

import { test, expect } from "@playwright/test";

test.describe("Consultorio R2 - reserva de turnos", () => {

    test("el buscador filtra los tratamientos", async ({ page }) => {
        await page.goto("/tratamiento.html");

        // al cargar, se muestran los 12 tratamientos del JSON
        const items = page.locator("#lista-tratamientos li");
        await expect(items).toHaveCount(12);

        // al escribir "dent" quedan solo los que contienen esa palabra
        await page.getByLabel("Buscar tratamiento").fill("dent");
        await expect(items).toHaveCount(3);
        await expect(page.getByText("Limpieza Dental")).toBeVisible();

        // si no hay coincidencias, se muestra el mensaje
        await page.getByLabel("Buscar tratamiento").fill("xyz");
        await expect(page.getByText("No se encontraron tratamientos")).toBeVisible();
    });


    test("el boton CONTINUAR se habilita recien al elegir una opcion", async ({ page }) => {
        await page.goto("/tratamiento.html");

        const continuar = page.getByRole("button", { name: "CONTINUAR" });
        await expect(continuar).toBeDisabled();

        await page.getByLabel("Ortodoncia").check();
        await expect(continuar).toBeEnabled();
    });


    test("reserva completa: el resumen muestra lo elegido y el turno se confirma", async ({ page }) => {
        // el envio del mail se simula: asi cada corrida no manda un correo real
        let datosEnviados = null;
        await page.route("https://api.emailjs.com/**", async (route) => {
            datosEnviados = route.request().postDataJSON().template_params;
            await route.fulfill({ status: 200, body: "OK" });
        });

        const continuar = page.getByRole("button", { name: "CONTINUAR" });

        // 1. tratamiento
        await page.goto("/tratamiento.html");
        await page.getByLabel("Ortodoncia").check();
        await continuar.click();

        // 2. profesional
        await expect(page).toHaveURL(/profesional\.html/);
        await page.getByLabel("Dr. Valentin Acuña").check();
        await continuar.click();

        // 3. horario (el id distingue el dia, porque "15:00h" se repite)
        await expect(page).toHaveURL(/horario\.html/);
        await page.locator("#id-miercoles15").check();
        await continuar.click();

        // 4. resumen
        await expect(page).toHaveURL(/resumen\.html/);
        await expect(page.locator("#resumen-tratamiento")).toHaveText("Ortodoncia");
        await expect(page.locator("#resumen-profesional")).toHaveText("Dr. Valentin Acuña");
        await expect(page.locator("#resumen-horario")).toHaveText("Miércoles - 15:00h");

        // 5. confirmar con un email valido
        await page.getByLabel("Correo electrónico para recibir la confirmación").fill("paciente@correo.com");
        await page.getByRole("button", { name: "CONFIRMAR TURNO" }).click();

        // aparece el aviso y se enviaron los datos correctos a EmailJS
        await expect(page.locator("#notificacion")).toContainText("¡Turno confirmado!");
        expect(datosEnviados.tratamiento).toBe("Ortodoncia");
        expect(datosEnviados.email_paciente).toBe("paciente@correo.com");

        // el turno queda guardado en notificaciones
        await page.goto("/notificaciones.html");
        await expect(page.getByText("Ortodoncia")).toBeVisible();
    });

});
