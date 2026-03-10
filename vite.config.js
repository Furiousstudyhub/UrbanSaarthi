import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

/* Copy driver portal HTML into dist/ so it deploys to Firebase Hosting */
function copyDriverPortal() {
  return {
    name: 'copy-driver-portal',
    closeBundle() {
      try {
        const src = resolve(__dirname, 'driver-portal/driver.html')
        const dest = resolve(__dirname, 'dist/driver.html')
        mkdirSync(resolve(__dirname, 'dist'), { recursive: true })
        writeFileSync(dest, readFileSync(src))
        console.log('✅ Copied driver.html → dist/driver.html')
      } catch (e) {
        console.warn('⚠ Could not copy driver.html:', e.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copyDriverPortal(),
  ],
})
