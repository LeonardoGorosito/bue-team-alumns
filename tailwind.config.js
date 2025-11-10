/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // 👈 Esta línea es la clave: busca en todos los archivos JS/TS/JSX/TSX dentro de src
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}