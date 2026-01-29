import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/promo-toki-mobile-referral", // TODO Prod
  // base: "/promo-lunar-ny2025-pre", // TODO SSS
  // base: "/" // TODO Dev
})
