/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(96,165,250,0.2), 0 20px 45px rgba(15,23,42,0.45)",
      },
    },
  },
  plugins: [],
}

