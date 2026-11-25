// configuracion de Playwright
// - en mi compu (npx playwright test): prueba el sitio publicado en Vercel
// - en GitHub Actions (CI): levanta el sitio con los archivos del push y prueba ESOS archivos
const { defineConfig, devices } = require("@playwright/test");

// GitHub Actions define la variable CI automaticamente
const enCI = !!process.env.CI;

module.exports = defineConfig({
    // carpeta de los tests E2E
    testDir: "./e2e",

    // en CI, si un test falla se reintenta una vez (por si fue un problema de red)
    retries: enCI ? 1 : 0,

    // reporte en la terminal + reporte HTML (en CI se guarda como artefacto)
    reporter: [["list"], ["html", { open: "never" }]],

    use: {
        baseURL: enCI ? "http://localhost:3000" : "https://consultorio-r2.vercel.app",

        // DEMO: con DEMO=1 cada accion espera 800 ms (para mostrar en vivo)
        launchOptions: { slowMo: process.env.DEMO ? 800 : 0 },

        // guarda una traza (paso a paso con capturas) cuando un test falla
        trace: "retain-on-failure",
    },

    // en CI, antes de los tests se levanta un servidor con los archivos del repo
    webServer: enCI
        ? {
              command: "npx --yes http-server -p 3000 -c-1 --silent",
              url: "http://localhost:3000/index.html",
              timeout: 60000,
          }
        : undefined,

    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ],
});
