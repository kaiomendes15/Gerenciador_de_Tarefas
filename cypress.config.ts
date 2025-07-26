import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Você pode definir variáveis de ambiente aqui
      config.env.API_BASE_URL = 'http://localhost:3000/api'; // URL da API
      return config;
    },
  },
});
