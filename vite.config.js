import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change this to match your GitHub repo name.
// If your site is https://username.github.io/century-compare/ then REPO_NAME = "century-compare"
const REPO_NAME = "century-compare";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? `/${REPO_NAME}/` : "/",
});
