import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to https://<username>.github.io/<repo-name>/
// set base to '/<repo-name>/'. If deploying to a custom domain or user site
// (<username>.github.io), leave base as '/'.
// Change this to match your repo name:
const REPO_NAME = 'century-compare'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
})
