import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: process.env.VITE_BASE_PATH || "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mis": path.resolve(__dirname, "./src/mis"),
      "@mis-components": path.resolve(__dirname, "./src/mis/components"),
      "@auth": path.resolve(__dirname, "./src/mis/modules/auth"),
      "@students": path.resolve(__dirname, "./src/mis/modules/students"),
      "@academic": path.resolve(__dirname, "./src/mis/modules/academic"),
      "@staff": path.resolve(__dirname, "./src/mis/modules/staff"),
      "@teachers": path.resolve(__dirname, "./src/mis/modules/teachers"),
      "@attendance": path.resolve(__dirname, "./src/mis/modules/attendance"),
      "@grades": path.resolve(__dirname, "./src/mis/modules/grades"),
      "@classes": path.resolve(__dirname, "./src/mis/modules/classes"),
      "@parents": path.resolve(__dirname, "./src/mis/modules/parents"),
      "@fees": path.resolve(__dirname, "./src/mis/modules/fees"),
      "@library": path.resolve(__dirname, "./src/mis/modules/library"),
      "@mis-reports": path.resolve(__dirname, "./src/mis/modules/reports"),
      "@mis-settings": path.resolve(__dirname, "./src/mis/modules/settings"),
      "@mis-dashboard": path.resolve(__dirname, "./src/mis/modules/dashboard"),
      "@mis-services": path.resolve(__dirname, "./src/mis/services"),
      "@mis-hooks": path.resolve(__dirname, "./src/mis/hooks"),
      "@mis-entities": path.resolve(__dirname, "./src/mis/entities"),
      "@mis-data": path.resolve(__dirname, "./src/mis/data"),
      "@mis-lib": path.resolve(__dirname, "./src/mis/lib"),
      "@mis-providers": path.resolve(__dirname, "./src/mis/providers"),
      "@mis-stores": path.resolve(__dirname, "./src/mis/stores"),
    },
  },
});
